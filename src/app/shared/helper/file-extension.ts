export class FileExtension {
  public static dataURLtoFile(dataUrl, filename) {
    if (dataUrl) {
      let arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type: mime});
    }

    return null;
  }

  public static getFileName(photoName: string) {
    return photoName.slice(0, photoName.indexOf(FileExtension.getFileExtenion(photoName)) - 1);
  }

  public static bytesToSize(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
      return '0 Byte';
    }
    let num = Math.floor(Math.log(bytes) / Math.log(1024));
    const i = parseInt(num.toString());
    num = Math.round(bytes / Math.pow(1024, i));
    return num.toString() + ' ' + sizes[i];
  }

  public static getFileExtenion(fileName: string) {
    return fileName.slice((Math.max(0, fileName.lastIndexOf('.')) || Infinity) + 1);
  }
}

