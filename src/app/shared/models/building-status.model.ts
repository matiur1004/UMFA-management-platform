export enum BuildingStatus {
    Pending,
    Validated,
    InActive,
}
export const BuildingStatusText = {
    [BuildingStatus.Pending]: 'Pending',
    [BuildingStatus.Validated]: 'Validated',
    [BuildingStatus.InActive]: 'In-Active'
  };
export const BuildingStatusDropdownItems = [
    {name: BuildingStatusText[BuildingStatus.Pending], value: BuildingStatus.Pending},
    {name: BuildingStatusText[BuildingStatus.Validated], value: BuildingStatus.Validated},
    {name: BuildingStatusText[BuildingStatus.InActive], value: BuildingStatus.InActive},
];