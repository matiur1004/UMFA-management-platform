import {getTariffFormState} from './building-tariffs.selectors';
import {getTariffFormSelectors} from 'app/shared/tariffs/store/selectors/tariff-form.selectors';
import {getUnitsOfMeasurement} from '../../../shared/store/selectors/common-data.selectors';

const tariffFormSelectors = getTariffFormSelectors(getTariffFormState, getUnitsOfMeasurement);

export const getTariffForm = tariffFormSelectors.getTariffForm;
export const getChargingTypes = tariffFormSelectors.getChargingTypes;
export const getTariffFormSupplyType = tariffFormSelectors.getTariffFormSupplyType;
export const getTariffFormLineItems = tariffFormSelectors.getTariffFormLineItems;
export const getFilteredUnitsOfMeasurement = tariffFormSelectors.getFilteredUnitsOfMeasurement;
export const getAllUnitsOfMeasurements = tariffFormSelectors.getAllUnitsOfMeasurements;
export const getAmrUnitsOfMeasurements = tariffFormSelectors.getAllAMRUnits;


