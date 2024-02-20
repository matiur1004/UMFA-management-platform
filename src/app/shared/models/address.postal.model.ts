export class AddressPostalViewModel {
  id: string = null;
  line1: string = null;
  line2: string = null;
  suburb: string = null;
  city: string = null;
  code: string = null;
  province: string = null;
  country: string = "South Africa";
  description: string = "Postal Address";
  longitude: number = 0;
  latitude: number = 0;
  isEdit: boolean;
}
