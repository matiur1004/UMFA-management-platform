export const getStrFromPhysicalAddress = (address) => {
  if (!address) {
    return '';
  }
  const addressLine = [
    address.line1,
    address.line2,
    address.suburb,
    address.city,
    address.province,
    address.country
  ].reduce((acc, str) => str ? acc + str + ', ' : acc, '');

  return addressLine.substring(0, addressLine.length - 2);
};
