export const allowedImageTypes: string[] = [
  '.png',
  '.jpg',
  '.jpeg',
  '.tiff'
];


export const allowedFileTypes: string[] = [
  '.doc',
  '.docx',
  '.txt',
  '.rtf',
  '.html',
  '.xml',
  '.xls',
  '.xlsx',
  '.csv',
  '.pdf',
  '.msg',
  '.eml',
  '.emlx',
  '.mp3',
  '.wav'
];

export const getFileExtension = (file: File): string => {
  const extensionWithoutPeriod = file?.name?.split('.').pop();

  return extensionWithoutPeriod ? `.${extensionWithoutPeriod}` : null;
};

export const isAllowedFile = (allowedTypes: string[], file: File): boolean => {
  return allowedTypes.some(item => item.includes(getFileExtension(file)));
};
