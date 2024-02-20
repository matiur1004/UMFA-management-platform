import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'set-of-nodes-list',
  templateUrl: './set-of-nodes-list.component.html',
  styleUrls: ['./set-of-nodes-list.component.less']
})
export class SetOfNodesListComponent implements OnInit {
  @Input() model: any;
  @Input() branchId: string;
  @Input() buildingId: string;
  @Input() versionDay: string;
  @Input() buildingPeriodIsFinalized: boolean;
  @Output() onDeleteNodeSet: EventEmitter<string> = new EventEmitter<string>();

  
  
  constructor(
    private router: Router,
  ) {
  }

  ngOnInit() {
  }

  onDelete(id: string) {
    this.onDeleteNodeSet.emit(id);
  }

  onAddSet() {
    if(this.buildingPeriodIsFinalized) return false;
    this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.versionDay, 'equipment', 'nodes', 'set', 'new']);
  }
}
