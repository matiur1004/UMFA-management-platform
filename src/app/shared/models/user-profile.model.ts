import {UserProfileUserViewModel} from "./user.model";

export class UserProfileViewModel {
  id: string;
  name: string;
  description: string;
  isAllDataSelected: boolean;
  clients: string[] = new Array<string>();
  clientPortfolios: string[] = new Array<string>();
  buildings: string[] = new Array<string>();
  users: UserProfileUserViewModel[] = new Array<UserProfileUserViewModel>();
}
