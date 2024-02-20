interface ValidationErrors {
  isDuplicate: boolean;
}

export const isDuplicate = (array: any[]) => (value: string): ValidationErrors => {

  let isDuplicate = value && array.filter(i => i.serialNumber === value).length > 1;

  return isDuplicate ? {isDuplicate} : null;
};
