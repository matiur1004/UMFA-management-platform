export class AddressViewModel {
  id: string = null;
  line1: string = null;
  line2: string = null;
  suburb: string = null;
  city: string = null;
  code: string = null;
  province: string = null;
  country: string = "South Africa";
  description: string = "Address Description (Type of Address for example Home, Work etc)";
  longitude: number = 0;
  latitude: number = 0;
  isEdit: boolean;
}
