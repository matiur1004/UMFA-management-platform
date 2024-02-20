import {allowedFileTypes, getFileExtension, isAllowedFile} from './../utils';
import {Subject} from 'rxjs';
import {ReadingDetailsPopupMode} from '../../shared/models/reading-details-popup.model';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {
  MeterViewModel,
  ReadingDetailsNavigation,
  ReadingDetailsUpdateViewModel,
  ReadingFileInfoType,
  ReadingFileInfoViewModel,
  ReadingsHistoryViewModel,
  shouldDisplayTime
} from './../../shared/models/readings-history.model';
import {NotificationService} from '@app/shared/services';

const maxFileSizeInBytes = 10485760;

@Component({
  selector: 'reading-details-popup',
  templateUrl: './reading-details-popup.component.html',
  styleUrls: ['./reading-details-popup.component.less']
})
export class ReadingDetailsPopupComponent {
  defaultReadingIconUrl = 'assets/images/meter-readings/meter-reading-icon.svg';
  audioPlayback = false;
  newValue = 0;
  newNotes: string;
  isSubmitted = false;
  shouldDisplayTime = shouldDisplayTime;
  readingDetailsPopupMode = ReadingDetailsPopupMode;
  allowedFileTypes = allowedFileTypes.join(', ');
  readingFileInfoType = ReadingFileInfoType;
  readingDetailsUpdateModel: ReadingDetailsUpdateViewModel = new ReadingDetailsUpdateViewModel();
  uploadedPhotoUrl: string | ArrayBuffer;
  downloadFile: Subject<ReadingFileInfoViewModel> = new Subject<ReadingFileInfoViewModel>();
  confirmReading: Subject<ReadingsHistoryViewModel> = new Subject<ReadingsHistoryViewModel>();
  @Input() meter: MeterViewModel;
  @Input() readingsNavigation: ReadingDetailsNavigation;
  @Input() mode: ReadingDetailsPopupMode = ReadingDetailsPopupMode.DetailsOnly;
  @Output() emitReading: EventEmitter<string> = new EventEmitter<string>();
  private audio: any;

  constructor(
    private activeModal: NgbActiveModal,
    private notificationService: NotificationService
  ) {
  }

  private _readingDetails: ReadingsHistoryViewModel;

  public get readingDetails(): ReadingsHistoryViewModel {
    return this._readingDetails;
  }

  @Input()
  public set readingDetails(value: ReadingsHistoryViewModel) {
    this._readingDetails = value;
    this.newNotes = this.readingDetails.notes;
  }

  get hasPhotos(): boolean {
    return this.readingDetails.filesInfo.some(item => item.type === ReadingFileInfoType.Photo) ||
      !!this.readingDetailsUpdateModel?.photosToUpload.length;
  }

  get hasFiles(): boolean {
    return this.readingDetails.filesInfo.some(item => item.type === ReadingFileInfoType.File) ||
      !!this.readingDetailsUpdateModel?.filesToUpload.length;
  }

  get registerName(): string {
    const reading = this.meter.registers.find(r => r.id === this.readingDetails.registerId);
    return reading ? reading.name : '';
  }

  get registerRatio(): number {
    const register = this.meter.registers.find(r => r.id === this.readingDetails.registerId);
    return register ? register.ratio : 1;
  }

  get isDetailsOnlyMode(): boolean {
    return this.mode === ReadingDetailsPopupMode.DetailsOnly;
  }

  get allowMarkAsIncorect(): boolean {
    return this.mode === ReadingDetailsPopupMode.DetailsWithMarkAsIncorrect;
  }

  get isResetMode(): boolean {
    return this.mode === ReadingDetailsPopupMode.Reset;
  }

  get isMarkAsIncorrectMode(): boolean {
    return this.mode === ReadingDetailsPopupMode.MarkAsIncorrect;
  }

  get isEditable(): boolean {
    return this.readingDetails.isEditable;
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  goToInvalidate() {
    this.mode = ReadingDetailsPopupMode.MarkAsIncorrect;
  }

  cancel() {
    if (this.isResetMode) {
      this.activeModal.dismiss();
    } else {
      this.mode = ReadingDetailsPopupMode.DetailsWithMarkAsIncorrect;
      this.isSubmitted = false;
    }
  }

  submit(inputsAreValid: boolean) {
    this.isSubmitted = true;
    if (inputsAreValid) {
      this.readingDetails.confirmed = false;
      this.readingDetails.notes = this.newNotes;
      this.readingDetails.value = this.newValue;
      this.activeModal.close({readingDetails: this.readingDetails});
    }
  }

  confirm() {
    this.readingDetails.confirmed = true;
    this.confirmReading.next(this.readingDetails);
  }

  getAudioRecord(record) {
    if (!this.audio) {
      this.audio = new Audio(record);
    }
  }

  onPlayAudio(record) {
    this.getAudioRecord(record);
    this.audioPlayback = !this.audioPlayback;
    (this.audioPlayback) ? this.audio.play() : this.audio.pause();
  }

  onPrevMeter() {
    this.emitReading.emit(this.readingsNavigation.previousMeterReadingId);
  }

  onNextMeter() {
    this.emitReading.emit(this.readingsNavigation.nextMeterReadingId);
  }

  onChangeReading(readingId: string) {
    this.emitReading.emit(readingId);
  }

  checkIfPhotoExist(photo: File) {
    return this.readingDetailsUpdateModel.photosToUpload.some(p => p.name === photo.name);
  }

  updatePhotoToUpload(photo: File) {
    if (photo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.uploadedPhotoUrl = reader.result;
      };

      reader.readAsDataURL(photo);
      if (!this.checkIfPhotoExist(photo)) {
        this.readingDetailsUpdateModel.photosToUpload = [...this.readingDetailsUpdateModel.photosToUpload, photo];
      } else {
        const idxPhoto = this.readingDetailsUpdateModel.photosToUpload.findIndex(p => p.name === photo.name);
        this.readingDetailsUpdateModel.photosToUpload.splice(idxPhoto, 1, photo);
      }
    }

  }

  updateFilesToUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files) || [];

    let supportedFiles: File[] = files.filter(item => isAllowedFile(allowedFileTypes, item));
    const unsupportedFiles: File[] = files.filter(item => !supportedFiles.includes(item));

    let unsupportedFilesMessage = '';

    if (unsupportedFiles.length) {
      unsupportedFilesMessage = `File extensions ${unsupportedFiles.map(item => getFileExtension(item)).join(', ')} are not supported. `;
    }

    const filesExceedingMaxSize = supportedFiles.filter(item => item.size > maxFileSizeInBytes);

    if (filesExceedingMaxSize.length) {
      supportedFiles = supportedFiles.filter(item => !filesExceedingMaxSize.includes(item));
      unsupportedFilesMessage +=
        `Files ${filesExceedingMaxSize.map(item => item.name)} exceed max file size of ${maxFileSizeInBytes} bytes.`;
    }

    this.readingDetailsUpdateModel.filesToUpload = [...this.readingDetailsUpdateModel.filesToUpload, ...supportedFiles];

    target.value = '';

    if (unsupportedFilesMessage) {
      this.notificationService.error(unsupportedFilesMessage);
    }
  }

  updateDefaultPhoto(fileInfo: ReadingFileInfoViewModel) {
    this.readingDetailsUpdateModel.defaultPhotoId = fileInfo.id;

    const currentDefaultPhoto = this.readingDetails.filesInfo.find(item => item.isDefaultPhoto);

    if (currentDefaultPhoto) {
      currentDefaultPhoto.isDefaultPhoto = false;
    }

    fileInfo.isDefaultPhoto = true;

    this.readingDetails = {
      ...this.readingDetails,
      photoUrl: `${this.readingDetails.baseFileRoute}${fileInfo.fileUrl}`
    };
  }

  deleteExistingFile(fileInfo: ReadingFileInfoViewModel) {
    const fileToDelete = this.readingDetails.filesInfo.find(item => item.id === fileInfo.id);

    if (fileToDelete) {
      const filesInfo = this.readingDetails.filesInfo.filter(item => item.id !== fileToDelete.id);
      let photoUrl = this.readingDetails.photoUrl;

      if (fileToDelete.isDefaultPhoto) {
        const photo = filesInfo.find(item => item.type === ReadingFileInfoType.Photo);

        if (photo) {
          photo.isDefaultPhoto = true;
          photoUrl = `${this.readingDetails.baseFileRoute}${photo.fileUrl}`;
        } else {
          photoUrl = null;
        }
      }

      this.readingDetails = {
        ...this.readingDetails,
        filesInfo: filesInfo,
        photoUrl: photoUrl
      };

      this.uploadedPhotoUrl = null;
      this.readingDetailsUpdateModel.filesToDelete = [...this.readingDetailsUpdateModel.filesToDelete, fileToDelete.id];
    }
  }

  deleteUnsavedFile(file: File) {
    this.readingDetailsUpdateModel.filesToUpload = this.readingDetailsUpdateModel.filesToUpload.filter(item => item !== file);
  }

  download(fileInfo: ReadingFileInfoViewModel) {
    this.downloadFile.next(fileInfo);
  }

  saveDetails() {
    this.readingDetailsUpdateModel.id = this.readingDetails.id;
    this.readingDetailsUpdateModel.notes = this.newNotes;
    this.activeModal.close({readingDetails: this.readingDetails, readingDetailsUpdate: this.readingDetailsUpdateModel});
  }

  changeEditable(editable: boolean) {
    this.readingDetails = {
      ...this.readingDetails,
      isEditable: editable
    }
  }
}
