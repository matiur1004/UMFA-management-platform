export class LocationViewModel {
  id: string | null;
  name: string;
  description: string;
  sequenceNumber: number;
  buildingId: string;
  numberOfUnits: number;
  numberOfEquipment: number;
  meters: any[] = [];
}
