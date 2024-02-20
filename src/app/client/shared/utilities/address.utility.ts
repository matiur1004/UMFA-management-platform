import {AddressViewModel} from "@models";

export const getAddress = (addresses: AddressViewModel[]) => {
  const delimiter = ', ';
  if (addresses.length) {
    const address = addresses[0];
    return address.line1 + delimiter + (address.line2 ? address.line2 + delimiter : '') +
      (address.suburb ? address.suburb + delimiter : '') + address.city + delimiter +
      (address.province ? address.province + delimiter : '') + address.country;
  } else {
    return '';
  }
};
