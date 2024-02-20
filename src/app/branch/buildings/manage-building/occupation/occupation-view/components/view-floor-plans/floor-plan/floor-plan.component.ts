import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import Konva from 'konva';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FloorPlanService} from './services';
import * as buildingCommonData from '../../../../../shared/store/selectors/common-data.selectors';
import { select, Store } from '@ngrx/store';
import * as fromOccupation from '../../../../shared/store/reducers';

const DEBOUNCE_TIME = 250;
const FRAME_RATE = 1000 / 30;

@Component({
  selector: 'floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.less']
})
export class FloorPlanComponent implements OnInit, OnDestroy {

  public menu = [
    {
      id: 'edit',
      icon: '\u270E',
      title: 'Edit Shop',
      comment: 'Click on the shop to start edit it',
      action: 'edit'
    },
    {
      id: 'addPoint',
      icon: '\u002B',
      title: 'Add a point',
      comment: 'Choose shop to edit it',
      action: 'addPoint'
    },
    {
      id: 'deletePoint',
      icon: '\u2716',
      title: 'Delete a point',
      comment: 'Choose a point to delete it',
      action: 'deletePoint'
    },
    {
      id: 'transform',
      icon: '\u21ba',
      title: 'Transform shop',
      comment: 'Choose shop to edit it',
      action: 'transform'
    },
    {
      id: 'moveUp',
      icon: '\u274f',
      title: 'Move shop on one level up',
      comment: 'Choose shop to edit it',
      action: 'moveUp'
    },
    {
      id: 'moveDown',
      icon: '\u2750',
      title: 'Move shop on one level down',
      comment: 'Choose shop to edit it',
      action: 'moveUp'
    },
    {
      id: 'addText',
      icon: 'T',
      title: 'Add text',
      comment: 'Click on canvas to add text',
      action: 'addText'
    }
  ];
  public activeAction = this.menu[0];

  o = {
    shop: {
      padding: 30
    },
    nameComment: 'comment',
    zoomStep: 0.2,
    defaultZoom: 1,
    maxZoom: 6,
    minZoom: 0,
    floorCanvasW: 5000,
    floorCanvasH: 5000,
    activeShopAttr: '_isActive'
  };
  zoom = this.o.defaultZoom;
  buildingPeriodIsFinalized$: Observable<any>;
  
  @Input() floors: any[];
  @Input() activeFloor: any;
  @Output() changeFloor: EventEmitter<string> = new EventEmitter<string>();
  @Output() save: EventEmitter<string> = new EventEmitter<string>();
  @Output() reset: EventEmitter<any> = new EventEmitter<any>();
  @Output() lastLoad: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('floor', {static: true}) canvas: ElementRef;
  @ViewChild('container', {static: true}) container: ElementRef;
  @ViewChild('textEdit', {static: true}) textEdit: ElementRef;
  private activeShop;
  private editShopSubject$ = new Subject<any>();
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private shopBox: Konva.Group;
  private floorBox: Konva.Group;
  private shopsList: Konva.Group;
  private transformer: Konva.Transformer;
  private winTopOffset = 300;
  private winLeftOffset = 305;
  private shopBoxWidth = 200;
  private containerSize = this.getContainerSize();
  private lastX = null;
  private lastY = null;
  private shopSize = {
    width: this.shopBoxWidth - this.o.shop.padding * 2,
    height: this.shopBoxWidth - this.o.shop.padding * 2
  };
  private lastTimeDraw: number;
  private destroyed$ = new Subject();

  constructor(
    private readonly floorService: FloorPlanService,
    private readonly renderer: Renderer2,
    private store: Store<fromOccupation.State>,
  ) {
  }

  private _shops: any;

  get shops() {
    return this._shops;
  }

  @Input()
  set shops(val: any) {
    this._shops = val;
    this.drawCanvas(val, this._importData);
  }

  private _importData: any;

  get importData() {
    return this._importData;
  }

  @Input()
  set importData(val: any) {
    this._importData = val;
    this.drawCanvas(this.shops, val);
  }

  drawCanvas(shops, data) {

    this.destroyCanvas();

    if (data) {
      this.importCanvas(data);
    } else {
      this.createCanvas(shops);
    }

    this.floorService.recalculateShopBox(this.shopsList, this.containerSize.height);
    this.floorService.recalculateScrollBar(this.shopBox, this.containerSize.height, this.shopsList.getClientRect(null).height);

    this.shopBox.on('wheel', (e) => this.onShopBoxWheel(e, this.shopsList, this.containerSize.height));
    this.floorBox.on('click', (e) => this.onCanvasClick(e));

    this.stage.batchDraw();
    // this.centerFloorBox(this.zoom);
  }

  createCanvas(shops) {
    this.stage = new Konva.Stage({
      container: this.canvas.nativeElement,
      ...this.containerSize
    });
    this.floorBox = this.floorService.createFloorBox(this.o.floorCanvasW, this.o.floorCanvasH);
    this.shopBox = this.floorService.createShopBox(this.shopBoxWidth, this.containerSize.height);

    this.shopsList = this.floorService.createShopList();
    this.layer = new Konva.Layer();
    this.transformer = this.floorService.createTransformer();

    shops?.forEach(s => this.shopsList.add(this.initShop(s)));

    // this.setScrollBarHandlers(this.shopBox, this.shopsList);

    this.shopBox.add(this.shopsList);
    this.floorBox.add(this.transformer);

    this.layer.add(this.floorBox);
    this.layer.add(this.shopBox);

    this.stage.add(this.layer);
  }

  importCanvas(data) {
    this.stage = Konva.Node.create(data, this.canvas.nativeElement);
    this.stage.size(this.containerSize);

    this.floorBox = this.floorService.findItemByNameType(this.stage, this.floorService.o.floorBox.name, 'Group');
    this.shopBox = this.floorService.findItemByNameType(this.stage, this.floorService.o.shopBox.name, 'Group');

    this.shopsList = this.floorService.findItemByNameType(this.stage, this.floorService.o.shopBox.nameShopList, 'Group');
    this.layer = this.floorService.findItemByType(this.stage, Konva.Layer);
    this.transformer = this.floorService.findItemByType(this.stage, Konva.Transformer);

    const shops = this.stage.find(`.${this.floorService.o.shop.name}`) as any;

    shops.forEach(s => {
      const isEditable = s.getAttr('_isEditable');
      const isActive = s.getAttr(this.o.activeShopAttr);

      if (isActive) this.setActiveShop(s);

      if (isEditable) {
        this.setEditShopHandlers(s);
        this.initShopAnchors(s);
      } else {
        this.setShopHandlers(s);
      }
    });

    const comments = this.stage.find(`.${this.o.nameComment}`) as any;
    comments.forEach(c => c.on('click', this.setTextHandlers.bind(this)));
  }

  destroyCanvas(): void {
    if (this.stage) {
      this.stage.clear();
      this.stage.clearCache();
      this.stage.destroy();
    }
  }

  // Shop
  initShop(shopData: any) {
    const shop = this.floorService.createShop(shopData, this.shopSize);
    this.setShopHandlers(shop);
    return shop;
  }

  setShopHandlers(shop) {
    shop.on('mouseenter', this.onShopMouseOver.bind(this));
    shop.on('mouseleave', this.onShopMouseOut.bind(this));
    shop.on('dragend', this.onShopDragEnd.bind(this));
  }

  // Shop events
  onShopMouseOver() {
    this.floorService.setCursor(this.floorService.o.grabCursor);
  }

  onShopMouseOut() {
    this.floorService.removeCursor();
  }

  onShopDragEnd(e) {
    const {evt, currentTarget} = e;
    const attr = currentTarget.getAttr('_shopData');
    const currentTargetCord = currentTarget.getClientRect({relativeTo: 'stage'});
    const editShop = this.floorService.createShop(attr, this.shopSize, true);

    const offsetX = this.stage.getPointerPosition().x - currentTargetCord.x;
    const offsetY = this.stage.getPointerPosition().y - currentTargetCord.y;

    editShop.x(evt.offsetX - offsetX);
    editShop.y(evt.offsetY - offsetY);

    currentTarget.destroy();

    this.floorService.recalculateShopBox(this.shopsList, this.containerSize.height);
    this.floorService.recalculateScrollBar(this.shopBox, this.containerSize.height, this.shopsList.getClientRect(null).height);
    this.activeAction = this.menu[0];

    this.floorBox.add(editShop);
    this.setEditShopHandlers(editShop);
    this.initShopAnchors(editShop);
    this.setActiveShop(editShop);

    this.stage.batchDraw();
  }

  setEditShopHandlers(shop) {
    shop.on('mouseenter', this.onShopMouseOver.bind(this));
    shop.on('mouseleave', this.onShopMouseOut.bind(this));
    shop.on('click', this.onShopClick.bind(this));
  }

  // Edit shop (actions)
  onEditShop(shop) {
    this.hideShopAnchors(shop);
    this.detachTransformer();
    this.disableTextMode();

    switch (this.activeAction.action) {
      case 'edit': {
        this.showShopAnchors(shop);
        break;
      }

      case 'transform': {
        this.attachTransformer(shop);
        break;
      }

      case 'addPoint': {
        this.showShopAnchors(shop);
        this.showAddNewAnchor(shop);

        break;
      }

      case 'deletePoint': {
        this.showShopAnchors(shop);
        break;
      }

      case 'moveUp': {
        this.floorService.moveOneLevelUp(shop);
        break;
      }

      case 'moveDown': {
        this.floorService.moveOneLevelDown(shop);
        break;
      }

      case 'addText': {
        this.initTextMode();
        break;
      }
    }

    this.stage.batchDraw();
  }

  onShopClick(e) {
    const clickedShop = e.currentTarget;
    this.setActiveShop(clickedShop);
  }

  setActiveShop(shop) {
    if (this.activeShop === shop) return null;
    if (this.activeShop) {
      this.activeShop.setAttr(this.o.activeShopAttr, false);
      this.hideShopAnchors(this.activeShop);
    }
    this.activeShop = shop;
    this.activeShop.setAttr(this.o.activeShopAttr, true);

    this.editShopSubject$.next(shop);
    this.lastX = null;
    this.lastY = null;
  }

  // Shop anchors
  initShopAnchors(shop) {
    const anchors = shop.findOne(`.${this.floorService.o.shop.nameAnchors}`);
    if (!anchors) return null;

    anchors.children.forEach((item) => this.setAnchorHandlers(item, shop));
  }

  setAnchorHandlers(anchor, shop) {
    anchor.on('mouseenter', (e) => this.onShopAnchorMouseOver(e));
    anchor.on('mouseleave', (e) => this.onShopAnchorMouseOut(e));
    anchor.on('dragmove', (e) => this.onShopAnchorDragMove(e, shop));
    anchor.on('mousedown touchstart', (e) => this.onShopAnchorMouseDown(e, shop));
    anchor.on('dragend', (e) => this.onShopAnchorDragEnd(e, shop));
    anchor.on('click', (e) => this.onShopAnchorClick(e, shop));
  }

  showShopAnchors(shop) {
    if (!shop) return null;
    const anchors = shop.findOne(`.${this.floorService.o.shop.nameAnchors}`);
    anchors.show();
  }

  hideShopAnchors(shop) {
    if (!shop) return null;
    const anchors = shop.findOne(`.${this.floorService.o.shop.nameAnchors}`);

    if (anchors)
      anchors.hide();
  }

  // TODO rename with the same names
  updateShopPoint(anchor, shop) {
    const shopShape = shop.findOne(`.${this.floorService.o.shop.nameSymbol}`);
    const anchorCord = anchor.getClientRect({relativeTo: shop});
    const pointIndex = anchor.getAttr('_anchorIndex');
    const points = shopShape.points();

    anchor.x(anchor.x() - this.floorService.o.shop.anchorRadius);
    anchor.y(anchor.y() - this.floorService.o.shop.anchorRadius);

    points[pointIndex] = anchorCord.x;
    points[pointIndex + 1] = anchorCord.y;

    shopShape.points(points);
  }

  // Anchors actions
  onShopAnchorMouseOver(e) {
    e.currentTarget.strokeWidth(2);
    this.floorService.setCursor('pointer');
    this.stage.batchDraw();
  }

  onShopAnchorMouseOut(e) {
    e.currentTarget.strokeWidth(1);
    this.floorService.removeCursor();
    this.stage.batchDraw();
  }

  onShopAnchorDragMove(e, shop) {
    this.updateShopPoint(e.currentTarget, shop);
    // this.floorService.recenterShopText(shop);
    this.stage.batchDraw();
  }

  onShopAnchorMouseDown(e, shop) {
    shop.draggable(false);
    e.currentTarget.moveToTop();
  }

  onShopAnchorDragEnd(e, shop) {
    shop.draggable(true);
    this.stage.batchDraw();
  }

  onShopAnchorClick(e, shop) {
    this.deleteAnchor(e, shop);
    this.stage.batchDraw();
  }

  showAddNewAnchor(shop) {
    const shopShape = shop.findOne(`.${this.floorService.o.shop.nameSymbol}`);
    const points = [...shopShape.points()];

    const anchors = shop.findOne(`.${this.floorService.o.shop.nameAnchors}`);

    const mouseX = (points[0] + points[2]) / 2,
      mouseY = (points[1] + points[3]) / 2;

    points.splice(2, 0, mouseX, mouseY);
    shopShape.points(points);
    anchors.destroy();

    const newAnchors = this.floorService.createAnchors(points, {visible: true}) as any;
    newAnchors.children.forEach((item) => this.setAnchorHandlers(item, shop));
    shop.add(newAnchors);

    this.stage.batchDraw();
  }

  deleteAnchor(e, shop) {
    if (this.activeAction.action !== 'deletePoint') return null;

    const anchor = e.currentTarget;
    const shopShape = shop.findOne(`.${this.floorService.o.shop.nameSymbol}`);
    const anchors = shop.findOne(`.${this.floorService.o.shop.nameAnchors}`);
    const points = [...shopShape.points()];

    const pointIndex = anchor.getAttr('_anchorIndex');

    points.splice(pointIndex, 2);
    anchors.destroy();

    shopShape.points(points);

    const newAnchors = this.floorService.createAnchors(points, {visible: true}) as any;
    newAnchors.children.forEach((item) => this.setAnchorHandlers(item, shop));
    shop.add(newAnchors);
  }

  // Transformer
  attachTransformer(shop) {
    const shopItem = shop.findOne(`.${this.floorService.o.shop.nameItem}`);
    this.transformer.attachTo(shop);
  }

  detachTransformer() {
    this.transformer.detach();
  }

  // Zoom
  onZoom(scale) {
    const zoom = this.o.defaultZoom === scale ? scale : +(this.zoom + scale).toFixed(2);
    if (zoom > this.o.maxZoom || zoom <= this.o.minZoom) return null;
    this.floorBox.scale({x: zoom, y: zoom});
    this.zoom = zoom;
    // this.centerFloorBox(zoom);
    this.stage.batchDraw();
  }

  getZoomInformer(zoom): string {
    return (zoom * 100).toFixed(2);
  }

  // Text mode
  initTextMode() {
    this.floorService.setCursor('text');
  }

  disableTextMode() {
    this.floorService.removeCursor();
  }

  // Scrollbar
  setScrollBarHandlers(container, shopList) {
    const scrollThumb = container.findOne(`.${this.floorService.o.scrollBar.nameThumb}`);

    scrollThumb.on('dragmove', (e) => {
      if (e.currentTarget.y() <= 7.5) return null;
      const {evt} = e;
      shopList.move({
        y: evt.movementY > 0 ? -e.currentTarget.y() / 31.5 : e.currentTarget.y() / 31.5
      });
    });
  }

  // *** EVENTS
  onShopBoxWheel(e, children, preferH) {
    if (children.children.length <= 0) return null;

    const wheelDistance = this.wheelDistance(e.evt) * 50;
    const childrenNodesCord = children.getClientRect(null);

    if (wheelDistance >= 0) {
      if (childrenNodesCord.y > 0) return null;
    } else if (wheelDistance <= 0) {
      if (-childrenNodesCord.y + preferH > childrenNodesCord.height) return null;
    }

    children.move({
      x: e.evt.deltaX,
      y: wheelDistance
    });

    const scrollThumb = e.currentTarget.findOne(`.${this.floorService.o.scrollBar.nameThumb}`);
    scrollThumb.move({
      y: -preferH * wheelDistance / childrenNodesCord.height
    });

    this.stage.batchDraw();
  }

  onResize(time: number): void {
    if ((time - this.lastTimeDraw) < FRAME_RATE) {
      requestAnimationFrame(this.onResize);
      return;
    }

    this.lastTimeDraw = time;
    this.containerSize = this.getContainerSize();
    this.stage.size(this.containerSize);
    this.stage.batchDraw();
  }

  onCanvasClick(e) {
    if (this.activeAction.action === 'addText') {
      const cursorPosition = this.stage.getPointerPosition();
      this.addTextField(cursorPosition.x, cursorPosition.y, '');
    }
  }

  addTextField(x, y, text) {
    this.renderer.setStyle(this.textEdit.nativeElement, 'display', 'block');
    this.renderer.setStyle(this.textEdit.nativeElement, 'left', `${x}px`);
    this.renderer.setStyle(this.textEdit.nativeElement, 'top', `${y}px`);
    this.textEdit.nativeElement.innerText = text;
    this.textEdit.nativeElement.focus();
  }

  onTextEditBlur() {
    const cordTextEdit = this.textEdit.nativeElement.getBoundingClientRect();
    const cordContainer = this.container.nativeElement.getBoundingClientRect();
    const textContent = this.textEdit.nativeElement.innerText;

    const textX = cordTextEdit.x - cordContainer.x - 1;
    const textY = cordTextEdit.y - cordContainer.y - 1;

    this.renderer.setStyle(this.textEdit.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.textEdit.nativeElement, 'left', `0px`);
    this.renderer.setStyle(this.textEdit.nativeElement, 'top', `0px`);

    if (textContent && textContent.length > 0) {
      const text = this.floorService.getText(
        textContent,
        textX,
        textY,
        {
          name: this.o.nameComment,
          draggable: true,
          fontSize: 12,
          align: 'left',
          lineHeight: 1.4
        });
      text.on('click', this.setTextHandlers.bind(this));
      this.floorBox.add(text);
    }

    this.textEdit.nativeElement.innerText = '';
  }

  setTextHandlers(e) {
    const {currentTarget} = e;

    if (this.activeAction.action === 'addText') {
      this.addTextField(currentTarget.x() - 1, currentTarget.y() - 1, currentTarget.text());
      currentTarget.destroy();
      this.stage.batchDraw();
    }

    if (this.activeAction.action === 'deletePoint') {
      currentTarget.destroy();
      this.stage.batchDraw();
    }

    if (this.activeAction.action === 'moveUp') {
      this.floorService.moveOneLevelUp(currentTarget);
    }

    if (this.activeAction.action === 'moveDown') {
      this.floorService.moveOneLevelDown(currentTarget);
    }
  }

  // Toolbar
  onClickToolbarButton(item: any) {
    this.activeAction = item;
    this.editShopSubject$.next(this.activeShop);
  }

  // *** HELPERS
  wheelDistance(event) {
    let normalized;
    if (event.wheelDelta) {
      normalized = (event.wheelDelta % 120 - 0) === -0 ? event.wheelDelta / 120 : event.wheelDelta / 12;
    } else {
      const rawAmmount = event.deltaY ? event.deltaY : event.detail;
      normalized = -(rawAmmount % 3 ? rawAmmount * 10 : rawAmmount / 3);
    }
    return normalized;
  }

  getContainerSize() {
    return {
      width: window.innerWidth - this.winLeftOffset,
      height: window.innerHeight - this.winTopOffset
    };
  }

  centerFloorBox(zoom) {
    const x = (this.floorBox.width() - this.floorBox.width() * zoom + this.winLeftOffset) / 2;
    const y = (this.floorBox.width() - this.floorBox.width() * zoom - this.winTopOffset) / 2;
    this.floorBox.x(x);
    this.floorBox.y(y);
  }

  onChangeFloor(floor) {
    this.changeFloor.emit(floor.id);
  }

  onSave() {
    this.save.emit(this.stage.toJSON());
  }

  onReset() {
    this.activeShop = null;
    this.reset.emit();
  }

  onLastLoad() {
    this.lastLoad.emit();
  }

  ngOnInit() {
    this.editShopSubject$.pipe(takeUntil(this.destroyed$)).subscribe(this.onEditShop.bind(this));

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', () => this.onResize(DEBOUNCE_TIME), false);
    this.buildingPeriodIsFinalized$ = this.store.pipe(select(buildingCommonData.getIsFinalized));
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
