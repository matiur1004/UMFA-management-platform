import {Inject, Injectable, Optional} from '@angular/core';

import Konva from 'konva';
import {DOCUMENT} from '@angular/common';

@Injectable()
export class FloorPlanService {

  public o = {
    fill: '#fff',
    grabCursor: 'grab',
    floorBox: {
      name: 'floorBox',
      nameTransformer: 'transformer',
      nameCanvas: 'floorBoxCanvas',
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1
    },
    box: {
      strokeWidth: 1,
      stroke: '#e1e1e1',
      fill: '#fafbfd'
    },
    shop: {
      name: 'shop',
      nameEditableShop: 'shopEdit',
      nameSymbol: 'shopSymbol',
      nameEditBtn: 'editShopBtn',
      nameAnchors: 'shopAnchors',
      nameItem: 'shopItem',
      nameAddAnchor: 'shopAddAnchor',
      fill: '#e6e7e8',
      strokeWidth: 2,
      stroke: '#19233c',
      minSidePx: 50,
      maxSidePx: 500,
      anchorRadius: 6
    },
    shopBox: {
      name: 'shopBox',
      nameShopList: 'shopList',
      fill: '#fafbfd',
      padding: 30
    },
    fontOptions: {
      fontSize: 14,
      fontFamily: 'Arial',
      align: 'center'
    },
    scrollBar: {
      name: 'scrollBar',
      nameThumb: 'scrollThumb',
      minThumbHeight: 30,
      width: 15,
    }
  };

  constructor(
    @Inject(DOCUMENT) public document: Document,
    @Inject('options') @Optional() public options?: any
  ) {
    this.o = {...this.o, ...options};
  }

  // *** BOXES ***
  createShopBox(width: number, height: number) {
    const shopBox = new Konva.Group({
      name: this.o.shopBox.name,
      width: width
    });

    const box = new Konva.Rect({
      height: height,
      width: width,
      fill: this.o.box.fill
    });

    const shopBoxBorder = new Konva.Rect({
      x: width,
      y: 0,
      height: height,
      width: this.o.box.strokeWidth,
      fill: this.o.box.stroke
    });

    const scrollBar = this.createScrollBar(width, 0, height);

    shopBox.add(box);
    shopBox.add(scrollBar);
    shopBox.add(shopBoxBorder);

    return shopBox;
  }

  createFloorBox(width: number, height: number) {
    const box = new Konva.Group({
      x: 0,
      y: 0,
      width,
      height,
      name: this.o.floorBox.name,
      draggable: true
    });

    const boxBg = new Konva.Rect({
      name: this.o.floorBox.nameCanvas,
      height,
      width,
      fill: this.o.floorBox.fill,
      stroke: this.o.floorBox.stroke,
      strokeWidth: this.o.floorBox.strokeWidth
    });

    box.add(boxBg);
    return box;
  }

  createShopList() {
    return new Konva.Group({
      name: this.o.shopBox.nameShopList
    });
  }

  recalculateShopBox(shopList, containerHeight) {
    let h = this.o.shopBox.padding;

    shopList.children.forEach((shop) => {
      const shopCord = shop.getClientRect(null);

      const x = this.o.shopBox.padding;
      const y = h;

      h += shopCord.height + this.o.shopBox.padding;

      shop.x(x);
      shop.y(y);
    });

    const cordShopList = shopList.getClientRect(null);

    if (shopList.y() < 0 && cordShopList.height < containerHeight) {
      shopList.y(0);
    }
  }

  // *** SHOPS ***
  createShop(shopData, options: any = {}, isEditable = false) {
    const shopW = options.width || 100;
    const shopH = options.height || 100;

    const shop = new Konva.Group({
      name: this.o.shop.name,
      id: shopData.id,
      draggable: true
    });

    const shopItem = new Konva.Group({
      name: this.o.shop.nameItem
    });

    const shopShape = this.createShopSymbol(0, 0, shopW, shopH, options);
    const shopName = this.getText(shopData.name, 0, shopH / 2 - 10, {width: shopW});

    shopItem.add(shopShape);
    shopItem.add(shopName);
    shop.add(shopItem);

    if (isEditable) {
      const anchors = this.createAnchors(shopShape.points());
      shop.add(anchors);

      const addAnchor = this.createAddAnchor();
      shop.add(addAnchor);
    }

    shop.setAttr('_shopData', shopData);
    shop.setAttr('_isEditable', isEditable);

    return shop;
  }

  createShopSymbol(x, y, shopW: number, shopH: number, options: any) {
    return new Konva.Line({
      name: this.o.shop.nameSymbol,
      points: [x, y, x + shopW, y, x + shopW, y + shopH, x, y + shopH],
      fill: this.o.shop.fill,
      stroke: this.o.shop.stroke,
      strokeWidth: this.o.shop.strokeWidth,
      closed: true,
      tension: 0,
      ...options
    });
  }

  createAnchors(points, options = {}) {
    const anchors = new Konva.Group({
      name: this.o.shop.nameAnchors,
      visible: false,
      ...options
    });

    points.forEach((p, i) => {
      if (i % 2 !== 0) return null;
      const x = points[i], y = points[i + 1];
      const anchor = this.createAnchor(x, y, i);
      anchors.add(anchor);
    });

    anchors.moveToTop();

    return anchors;
  }

  createAnchor(x, y, i) {
    const ar = this.o.shop.anchorRadius;
    const anchor = new Konva.Circle({
      x,
      y,
      radius: ar,
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      draggable: true
    });

    anchor.setAttr('_anchorIndex', i);
    return anchor;
  }

  createAddAnchor() {
    const addAnchor = new Konva.Group({
      visible: false,
      name: this.o.shop.nameAddAnchor
    });

    const anchor = new Konva.Circle({
      x: 0,
      y: 0,
      radius: this.o.shop.anchorRadius,
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1
    });

    const text = this.getText('+', 2, -2);

    addAnchor.add(anchor);
    addAnchor.add(text);
    return addAnchor;
  }

  createTransformer() {
    const transformer = new Konva.Transformer({
      name: this.o.floorBox.nameTransformer,
      keepRatio: false,
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    });
    transformer.ignoreStroke(true);

    return transformer;
  }

  createScrollBar(x, y, height) {
    const barWidth = this.o.scrollBar.width;
    const scrollBar = new Konva.Group({
      name: this.o.scrollBar.name,
      x: x - barWidth, y
    });

    const scrollTrack = new Konva.Rect({
      width: barWidth,
      height,
      fill: '#fff'
    });

    const scrollThumb = new Konva.Line({
      name: this.o.scrollBar.nameThumb,
      x: barWidth / 2,
      y: 7.5,
      points: [0, 0, 0, 0],
      stroke: '#c1cad4',
      strokeWidth: barWidth / 2,
      lineCap: 'round',
      lineJoin: 'round',
      draggable: true
    });

    scrollBar.add(scrollTrack);
    scrollBar.add(scrollThumb);

    return scrollBar;
  }

  recenterShopText(shop) {
    const cordShop = shop.findOne(`.${this.o.shop.nameSymbol}`).getClientRect(null);
    const y = cordShop.height / 2 - 10;
    const text = shop.findOne('Text');
    text.y(y);
    text.width(cordShop.width);
  }

  getThumbHeight(height, scrollHeight) {
    const barWidth = this.o.scrollBar.width;
    const minThumbHeight = this.o.scrollBar.minThumbHeight;
    const calcThumbHeight = height * height / scrollHeight - barWidth * 2;

    return calcThumbHeight < minThumbHeight ? minThumbHeight : calcThumbHeight;
  }

  recalculateScrollBar(container, height, scrollHeight) {
    const barWidth = this.o.scrollBar.width;
    const scrollThumb = container.findOne(`.${this.o.scrollBar.nameThumb}`);

    if (height > scrollHeight) {
      scrollThumb.hide();
    }

    const thumbHeight = this.getThumbHeight(height, scrollHeight);

    scrollThumb.dragBoundFunc(function (pos) {
      const newY = pos.y <= barWidth / 2
        ? barWidth / 2
        : pos.y >= height - thumbHeight - barWidth / 2
          ? height - thumbHeight - barWidth / 2
          : pos.y;
      return {
        x: this.absolutePosition().x,
        y: newY
      };
    });

    scrollThumb.points([0, 0, 0, thumbHeight]);
  }

  // *** HELPERS ***
  getText(text: string, x: number, y: number, options = {}) {
    return new Konva.Text({
      x,
      y,
      text,
      ...this.o.fontOptions,
      ...options
    });
  }

  // Move
  moveOneLevelUp(el) {
    el.moveUp();
  }

  moveOneLevelDown(el) {
    el.moveDown();
  }

  setCursor(cursor) {
    this.document.body.style.cursor = cursor;
  }

  removeCursor() {
    this.document.body.style.cursor = 'default';
  }

  findItemByNameType(nodes, name, type) {
    return nodes.findOne(node => node.getType() === type && node.name() === name);
  }

  findItemByType(nodes, classType) {
    return nodes.findOne(node => node instanceof classType);
  }
}
