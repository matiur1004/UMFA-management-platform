import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as fromNode from '../../shared/store/reducers';
import * as fromStore from '../../shared/store/reducers';
import * as selectors from '../../../shared/store/selectors/common-data.selectors';
import {NodeSetsService} from '../../shared/node-sets.service';
import {NodeSetsViewModel} from '../../shared/models';
import {HistoryViewModel} from '@models';
import {PopupCommentComponent} from 'app/popups/popup.comment/popup.comment.component';
import {BranchManagerService} from '@services';
import * as commonDataActions from '../../../shared/store/actions/common-data.action';

@Component({
  selector: 'page-create-node-set',
  templateUrl: './page-create-node-set.component.html',
  styleUrls: ['./page-create-node-set.component.less']
})
export class PageCreateNodeSetComponent implements OnInit, OnDestroy {
  model: any[];
  branchId: string;
  buildingId$: Subscription;
  buildingId: string;
  selectedVersion: HistoryViewModel;

  constructor(
    private store: Store<fromNode.State>,
    private router: Router,
    private nodeSetsService: NodeSetsService,
    private branchManager: BranchManagerService,
    private modalService: NgbModal,
    private readonly store$: Store<fromStore.State>) {
  }

  ngOnInit() {
    this.buildingId$ = this.store.pipe(select(selectors.getBuildingId)).subscribe(id => this.buildingId = id);
    this.store.pipe(select(selectors.getSelectedHistoryLog)).subscribe(version => this.selectedVersion = version);
    this.branchId = this.branchManager.getBranchId();
  }

  ngOnDestroy() {
    this.buildingId$ && this.buildingId$.unsubscribe();
  }

  openSavePopup() {
    const modalRef = this.modalService.open(PopupCommentComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.componentInstance.date = new Date();
    modalRef.componentInstance.comment = 'Created new Set';

    return modalRef;
  }

  onFormSubmitted(ev: NodeSetsViewModel) {
    const modalRef = this.openSavePopup();
    modalRef.result.then(({comment, date, actionType}) => {
      const params = {
        entity: ev,
        id: this.selectedVersion.id,
        comment: comment,
        action: actionType,
        majorVersion: 1
      };
      if (date) {
        params['versionDate'] = new Date(date);
      }

      this.nodeSetsService.createNodeSet(this.buildingId, params).subscribe(res => {
        const setId = res.entity;
        this.store$.dispatch(new commonDataActions.CreateItemUpdateUrlVersionAction({
          versionDate: res.current.versionDate,
          itemId: setId
        }));
        this.store$.dispatch(new commonDataActions.HistoryChange(res.current.id));
        this.store$.dispatch(new commonDataActions.GetHistoryWithVersionId(res.current.id));
      });
    }, () => {
    });
  }

  onCancel() {
    this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.selectedVersion.versionDay, 'equipment', 'nodes']);
  }
}
