import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NationalTenantViewModel} from '@models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NationalTenantsService} from '@services';
import {FileExtension} from 'app/shared/helper/file-extension';
import {DeleteDialogComponent} from 'app/widgets/delete-dialog/delete-dialog.component';
import {ImgModalComponent} from 'app/widgets/img-modal/img-modal.component';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, take, tap} from 'rxjs/operators';
import {CreateNationalTenantComponent} from '../create-national-tenant/create-national-tenant.component';

@Component({
  selector: 'app-national-tenant-table',
  templateUrl: './national-tenant-table.component.html',
  styleUrls: ['./national-tenant-table.component.less']
})
export class NationalTenantTableComponent implements OnInit, OnDestroy {
  filteredNationalTenants: NationalTenantViewModel[];
  private searchTermsSubject = new Subject<string>();
  private currentSearchText = '';

  constructor(
    private nationalTenantService: NationalTenantsService,
    private modalService: NgbModal
  ) {
  }

  private _model: NationalTenantViewModel[];

  public get model() {
    return this._model;
  }

  @Input()
  public set model(model: NationalTenantViewModel[]) {
    this._model = model;
    this.filteredNationalTenants = model;
  }

  ngOnInit() {
    this.searchTermsSubject
      .pipe(
        // wait 300ms after each keystroke before considering the term
        debounceTime(300),

        // ignore new term if same as previous term
        distinctUntilChanged(),

        // switch to new search observable each time the term changes
        tap((term: string) => {
          this.currentSearchText = term;

          this.filterNationalTenant(term);
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.searchTermsSubject.unsubscribe();
  }

  search(term: string): void {
    this.searchTermsSubject.next(term);
  }

  filterNationalTenant(text: string) {
    if (this.filteredNationalTenants) {
      this.filteredNationalTenants = this.model.filter(
        t => !!t.name.match(new RegExp(text, 'i'))
      );
    }
  }

  addNationalTenant() {
    const modalRef = this.modalService.open(CreateNationalTenantComponent, {
      backdrop: 'static'
    });
    modalRef.result.then(
      result => {
        this.model.push(result);

        this.filterNationalTenant(this.currentSearchText);
      },
      () => {
      }
    );
  }

  updateNationalTenant(nt: NationalTenantViewModel) {
    if (nt.id) {
      this.nationalTenantService.update(nt).subscribe();
    }
  }

  removeNationalTenant(nt: NationalTenantViewModel) {
    const modalRef = this.modalService.open(DeleteDialogComponent);
    modalRef.result.then(
      () => {
        const index = this.model.indexOf(nt);
        if (index !== -1) {
          this.nationalTenantService.delete(nt.id).subscribe(() => {
            this.model.splice(index, 1);

            this.filterNationalTenant(this.currentSearchText);
          });
        }
      },
      () => {
      }
    );
  }

  onOpenLogo(nationalTenant) {
    const modalRef = this.modalService.open(ImgModalComponent);
    modalRef.componentInstance.url = nationalTenant.logoUrl;
    modalRef.componentInstance.isReadonlyImage = false;
    modalRef.result.then(
      result => {
        const file = FileExtension.dataURLtoFile(
          result,
          'national-tenant-image' + '.png'
        );

        if (file) {
          this.nationalTenantService
            .uploadLogo(file, nationalTenant.id)
            .pipe(take(1))
            .subscribe(url => {
              nationalTenant.logoUrl = url;
            });
        }
      },
      () => {
      }
    );
  }
}
