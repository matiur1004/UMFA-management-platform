import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable()
export class DataService {

  private userDataSubject = new Subject<any>();

  constructor() {
  }

  public userUpdated(): void {
    this.userDataSubject.next(true);
  }

  getUserObservable(): Subject<any> {
    return this.userDataSubject;
  }

}
