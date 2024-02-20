import {
  BuildingPackageDetailViewModel,
  BuildingPackageViewModel
} from "app/branch/buildings/building-services/shared/models";

export class BuildingServicesViewModel {
  packages = new Array<BuildingPackageViewModel>();
  packageDetails: BuildingPackageDetailViewModel;
}
