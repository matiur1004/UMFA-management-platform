import {getTariffFormState} from './common.selectors';
import {getTariffFormSelectors} from 'app/shared/tariffs/store/selectors/tariff-form.selectors';
import {getUnitsOfMeasurement} from 'app/admin/shared/common-data/store/selectors';

const tariffFormSelectors = getTariffFormSelectors(getTariffFormState, getUnitsOfMeasurement);

export const getTariffForm = tariffFormSelectors.getTariffForm;
export const getChargingTypes = tariffFormSelectors.getChargingTypes;
export const getTariffFormSupplyType = tariffFormSelectors.getTariffFormSupplyType;
export const getTariffFormLineItems = tariffFormSelectors.getTariffFormLineItems;
export const getFilteredUnitsOfMeasurement = tariffFormSelectors.getFilteredUnitsOfMeasurement;

