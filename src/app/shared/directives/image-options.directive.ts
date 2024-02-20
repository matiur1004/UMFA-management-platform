import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {ImageOptions} from '@app/shared/models/image-options';
import {FileExtension} from '@shared-helpers';
import {NotificationService} from '@services';

interface IPosition {
  w: number;
  h: number;
  startX: number;
  startY: number;
}

@Directive({
  selector: '[imageFilter]'
})

export class ImageOptionsDirective {
  @Input() photoName: string;
  @Output() confirmedPhoto: EventEmitter<File> = new EventEmitter<File>();
  @Output() isCropped: EventEmitter<boolean> = new EventEmitter<boolean>();
  private readonly EDITED = '_edited';
  private _imageFile: File | string;
  private readonly OFFSET_POS = 50;
  private dragBL = false;
  private dragTR = false;
  private dragBR = false;
  private dragTL = false;
  private closeEnough = 5;
  private cropEnabled = false;
  private rectPos: IPosition;
  private readonly MAX_HEIGHT = 500;
  private readonly IMAGE_CLASS = 'image-option';
  private readonly MAX_WIDTH = 500;
  private readonly canvas: HTMLCanvasElement;
  private uploadedPhoto: HTMLImageElement;
  private defaultImage: HTMLImageElement;

  constructor(private el: ElementRef, private notificationService: NotificationService) {
    this.canvas = el.nativeElement;
  }

  @Input() set imageFilter(imageFile: File | string) {
    this._imageFile = imageFile;
    if (typeof imageFile === 'string') {
      this.createImage(imageFile);
    } else {
      this.createImageFromFile(imageFile);
    }
  }

  get imageOptions() {
    return this._imageFile;
  }

  get getCanvasContext() {
    return this.canvas.getContext('2d');
  }

  private _brightnessControl: number;

  get brightnessControl() {
    return this._brightnessControl;
  }

  @Input() set brightnessControl(value: number) {
    this._brightnessControl = value;
    if (this.uploadedPhoto) {
      this.onChangeBrightness();
    }
  }

  private static destinationCoords(src: number, dst: number, value: number): number {
    return dst * value / src;
  }

  private static toImageCoords(image: HTMLImageElement, rectPos: IPosition, canvas: HTMLCanvasElement): IPosition {
    return {
      startX: ImageOptionsDirective.destinationCoords(canvas.width, image.width, rectPos.startX),
      startY: ImageOptionsDirective.destinationCoords(canvas.height, image.height, rectPos.startY),
      w: ImageOptionsDirective.destinationCoords(canvas.width, image.width, rectPos.w),
      h: ImageOptionsDirective.destinationCoords(canvas.height, image.height, rectPos.h)
    };
  }

  @HostListener('mousemove', ['$event'])
  mouseMove(event) {
    if (!this.cropEnabled) {
      return;
    }

    const {mouseX, mouseY} = this.getMousePositionFromCanvas(event);

    if (this.dragTL) {
      this.rectPos.w += this.rectPos.startX - mouseX;
      this.rectPos.h += this.rectPos.startY - mouseY;
      this.rectPos.startX = mouseX;
      this.rectPos.startY = mouseY;
    } else if (this.dragTR) {
      this.rectPos.w = Math.abs(this.rectPos.startX - mouseX);
      this.rectPos.h += this.rectPos.startY - mouseY;
      this.rectPos.startY = mouseY;
    } else if (this.dragBL) {
      this.rectPos.w += this.rectPos.startX - mouseX;
      this.rectPos.h = Math.abs(this.rectPos.startY - mouseY);
      this.rectPos.startX = mouseX;
    } else if (this.dragBR) {
      this.rectPos.w = Math.abs(this.rectPos.startX - mouseX);
      this.rectPos.h = Math.abs(this.rectPos.startY - mouseY);
    }
    this.clearCanvas();
    this.drawResizeArea();
  }

  @HostListener('mouseup', [])
  mouseUp() {
    if (!this.cropEnabled) {
      return;
    }

    this.dragTL = false;
    this.dragTR = false;
    this.dragBL = false;
    this.dragBR = false;
  }

  @HostListener('mousedown', ['$event'])
  mouseDown(event: MouseEvent) {
    if (!this.cropEnabled) {
      return;
    }

    const {mouseX, mouseY} = this.getMousePositionFromCanvas(event);

    // if there isn't a rect yet
    if (this.checkCloseEnough(mouseX, this.rectPos.startX) && this.checkCloseEnough(mouseY, this.rectPos.startY)) {
      this.dragTL = true;
    } else if (this.checkCloseEnough(mouseX, this.rectPos.startX + this.rectPos.w) && this.checkCloseEnough(mouseY, this.rectPos.startY)) {
      this.dragTR = true;
    } else if (this.checkCloseEnough(mouseX, this.rectPos.startX) && this.checkCloseEnough(mouseY, this.rectPos.startY + this.rectPos.h)) {
      this.dragBL = true;
    } else if (this.checkCloseEnough(mouseX, this.rectPos.startX + this.rectPos.w)
      && this.checkCloseEnough(mouseY, this.rectPos.startY + this.rectPos.h)) {
      this.dragBR = true;
    }

    this.clearCanvas();
    this.drawResizeArea();
  }

  @HostListener('document:click', ['$event'])
  onClick($event) {
    let targetElement = $event.target;
    let elementClassList = targetElement.classList as DOMTokenList;

    if (!elementClassList.contains(this.IMAGE_CLASS)) {
      targetElement = targetElement.parentElement;
      elementClassList = targetElement?.classList;
    }

    if (elementClassList && elementClassList.contains(this.IMAGE_CLASS)) {
      const dataSet = parseInt(targetElement.dataset.name, 16);

      switch (dataSet) {
        case ImageOptions.inversion:
          this.cropEnabled ? this.notificationService.info('Please crop image') : this.onChangeInversionImage();
          break;
        case ImageOptions.crop:
          if (this.cropEnabled) {
            this.cropEnabled = false;
            const ctx = this.getCanvasContext;
            ctx.drawImage(this.uploadedPhoto, 0, 0, this.canvas.width, this.canvas.height);
            return;
          }
          this.cropEnabled = true;
          this.isCropped.emit(this.cropEnabled);
          this.drawResizeArea();

          break;
        case ImageOptions.brightness:
          if (this.cropEnabled) {
            this.notificationService.info('Please crop image');
          }
          break;
        case ImageOptions.rotate:
          this.cropEnabled ? this.notificationService.info('Please crop image') : this.onChangeRotationImage();

          break;
        case ImageOptions.confirm:
          this.onSaveImage();
          break;
        case ImageOptions.reset:
          this.onReset();
          break;
        case ImageOptions.download:
          this.cropEnabled ? this.notificationService.info('Please crop image') : this.onDownloadImage();
          break;
      }
    }
  }

  drawImageInCanvas(event: Event) {
    if (!this.defaultImage) {
      this.defaultImage = event.currentTarget as HTMLImageElement;
    }
    this.uploadedPhoto = <HTMLImageElement>event.currentTarget;

    if (!this.cropEnabled) {
      this.canvas.width = this.MAX_WIDTH;
      this.canvas.height = this.MAX_HEIGHT;
      const ctx = this.getCanvasContext;
      ctx.drawImage(
        this.uploadedPhoto,
        0,
        0,
        this.uploadedPhoto.width,
        this.uploadedPhoto.height,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.rectPos = {
        startX: this.OFFSET_POS,
        startY: this.OFFSET_POS,
        w: this.canvas.width - this.OFFSET_POS - this.OFFSET_POS,
        h: this.canvas.height - this.OFFSET_POS - this.OFFSET_POS
      };
    }
    this.cropEnabled = false;
    this.isCropped.emit(this.cropEnabled);
  }

  private getMousePositionFromCanvas(event: MouseEvent) {
    const canvasPos = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / canvasPos.width;
    const scaleY = this.canvas.height / canvasPos.height;
    const mouseX = (event.clientX - canvasPos.left) * scaleX;
    const mouseY = (event.clientY - canvasPos.top) * scaleY;

    return {mouseX, mouseY};
  }

  private checkCloseEnough(p1: number, p2: number): boolean {
    return Math.abs(p1 - p2) < this.closeEnough;
  }

  private createImage(fr: any | string) {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = (event: Event) => this.drawImageInCanvas(event);
    if (typeof fr === 'string') {
      image.src = fr;
    } else {
      image.src = fr.currentTarget.result;
    }

  }

  private createImageFromFile(file: File) {

    if (file) {
      const reader = new FileReader();

      reader.onload = this.createImage.bind(this);

      reader.readAsDataURL(file);
    }
  }

  private onChangeInversionImage() {
    this.cropEnabled = false;
    this.isCropped.emit(this.cropEnabled);
    const ctx = this.getCanvasContext;
    ctx.globalCompositeOperation = 'difference';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.onSaveImage();
  }

  private onChangeBrightness() {
    this.cropEnabled = false;
    this.isCropped.emit(this.cropEnabled);
    const ctx = this.getCanvasContext;
    ctx.filter = `brightness(${this.brightnessControl + 100}%)`;
    ctx.drawImage(this.uploadedPhoto, 0, 0, this.canvas.width, this.canvas.height);
  }

  private onDownloadImage() {
    this.cropEnabled = false;
    this.isCropped.emit(this.cropEnabled);
    const dataUrl = this.canvas.toDataURL();
    const link = document.createElement('a');
    link.setAttribute('href', dataUrl);
    const photoName = typeof this.imageOptions === 'string' ? this.photoName : this.imageOptions.name;
    link.setAttribute('download', photoName);
    link.style.display = 'none';
    link.click();
    link.remove();
  }

  private onChangeRotationImage() {
    this.cropEnabled = false;
    this.isCropped.emit(this.cropEnabled);
    const ctx = this.getCanvasContext;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fill();
    ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    ctx.fill();
    ctx.rotate(Math.PI / 2);
    ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
    ctx.fill();
    ctx.drawImage(this.uploadedPhoto, 0, 0, this.canvas.width, this.canvas.height);
    this.onSaveImage();
  }

  private onSaveImage() {
    if (this.cropEnabled) {
      const ctx = this.getCanvasContext;
      const frame = ImageOptionsDirective.toImageCoords(this.uploadedPhoto, this.rectPos, this.canvas);
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const templateUploadedPhoto = this.uploadedPhoto;
      ctx.drawImage(templateUploadedPhoto, frame.startX, frame.startY, frame.w, frame.h, 0, 0, this.canvas.width, this.canvas.height);
    }

    const file = this.getCopyFile();
    this.confirmedPhoto.emit(file);
    this.createImageFromFile(file);
  }

  private onReset() {
    this.cropEnabled = false;
    this.isCropped.emit(this.cropEnabled);
    const ctx = this.getCanvasContext;
    this.clearCanvas();
    this.uploadedPhoto = this.defaultImage;
    ctx.drawImage(this.uploadedPhoto, 0, 0, this.uploadedPhoto.width, this.uploadedPhoto.height, 0, 0, this.canvas.width, this.canvas.height);
    this.onSaveImage();
  }

  private drawResizeArea() {
    const ctx = this.getCanvasContext;
    ctx.drawImage(this.uploadedPhoto, 0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = 'rgba(225,225,225, 0.3)';
    ctx.fillRect(this.rectPos.startX, this.rectPos.startY, this.rectPos.w, this.rectPos.h);
    this.drawHandles();
  }

  private clearCanvas(): void {
    const ctx = this.getCanvasContext;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawCircle(x: number, y: number, radius: number) {
    const ctx = this.getCanvasContext;
    ctx.fillStyle = '#00aeef';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  private drawHandles() {
    this.drawCircle(this.rectPos.startX, this.rectPos.startY, this.closeEnough);
    this.drawCircle(this.rectPos.startX + this.rectPos.w, this.rectPos.startY, this.closeEnough);
    this.drawCircle(this.rectPos.startX + this.rectPos.w, this.rectPos.startY + this.rectPos.h, this.closeEnough);
    this.drawCircle(this.rectPos.startX, this.rectPos.startY + this.rectPos.h, this.closeEnough);
  }

  private getCopyFile() {
    const dataUrl = this.canvas.toDataURL();
    const fileWithoutExt = typeof this.imageOptions === 'string'
      ? FileExtension.getFileName(this.photoName)
      : FileExtension.getFileName(this.imageOptions.name);

    const fileExt = typeof this.imageOptions === 'string'
      ? FileExtension.getFileExtenion(this.photoName)
      : FileExtension.getFileExtenion(this.imageOptions.name);
    const fileName = !fileWithoutExt.includes(this.EDITED) ? fileWithoutExt + this.EDITED + '.' + fileExt : fileWithoutExt + '.' + fileExt;

    return FileExtension.dataURLtoFile(dataUrl, fileName);
  }
}
