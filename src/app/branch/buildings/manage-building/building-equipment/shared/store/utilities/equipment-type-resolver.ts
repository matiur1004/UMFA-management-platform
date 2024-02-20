const electricityBreakersEquipGroup = 'electricity breakers';
const electricityMetersEquipGroup = 'electricity meters';
const amrComboValue = 'amr';

export const isBreaker = (form) => {
  return form.equipmentGroup.name && form.equipmentGroup.name.toLocaleLowerCase() === electricityBreakersEquipGroup;
};

export const isAmrMeter = (form) => {
  return !!form.attributes.find(item => item.value && item.value.toString().toLocaleLowerCase() === amrComboValue);
};

export const isAmrIntegrationAllowed = (form) => {
  return form.equipmentGroup.name && isAmrMeter(form) && form.equipmentGroup.name.toLocaleLowerCase() === electricityMetersEquipGroup;
};


