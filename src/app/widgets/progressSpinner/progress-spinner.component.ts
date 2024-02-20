import {Component, OnDestroy, OnInit} from "@angular/core";
import {ProgressSpinnerService} from "@services";
import {Subscription} from "rxjs";

@Component({
  selector: "progress-spinner",
  templateUrl: "./progress-spinner.component.html",
  styleUrls: ["./progress-spinner.component.less"]
})
export class ProgressSpinnerComponent implements OnInit, OnDestroy {
  public isHidden = true;
  private progressSubscription$: Subscription;
  private timeout;

  constructor(private progressSpinnerService: ProgressSpinnerService) {
  }

  ngOnInit() {
    this.progressSubscription$ = this.progressSpinnerService.getObservable().subscribe((status) => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.isHidden = status;
      }, 0);
    });
  }

  ngOnDestroy() {
    this.progressSubscription$ && this.progressSubscription$.unsubscribe();
  }
}
