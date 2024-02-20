import {SupplyToViewModel, SupplyType} from '@models';

export const getSuppliesTo = (supplies: SupplyToViewModel[], supplyType: SupplyType) => {
  return supplies.map(s => {
    return {
      id: s.id,
      name: s.name,
      supplyTypes: s.supplyTypes.filter(t => t.supplyType === supplyType)
    };
  });
};

export const updateDropdownData = (tempObj: any, dataNamesArray: number[], dataArray: any[], dataId: string, dataName: string = 'id') => {
  if (dataArray.length && !dataId) {
    tempObj[dataNamesArray[0]] = dataArray,
      tempObj[dataNamesArray[1]] = dataArray.find(item => item[dataName] === dataArray[0][dataName]);
  } else {
    tempObj[dataNamesArray[0]] = dataArray,
      tempObj[dataNamesArray[1]] = dataArray.find(item => item[dataName] === dataId);
  }

  return tempObj;
};
