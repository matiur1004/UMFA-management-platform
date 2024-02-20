import {Component, ElementRef, Input, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {EquipmentsIconsGenerator} from '../../equipments-icons-generator.service';
import {EquipmentTreeModel} from '@models';

declare let vis;

@Component({
  selector: 'equipments-diagrame',
  templateUrl: './equipments-diagrame.component.html',
  styleUrls: ['./equipments-diagrame.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class EquipmentsDiagrameComponent implements OnDestroy {
  @ViewChild('equipmentsDiagrame', {static: true}) container: ElementRef;
  @ViewChild('tooltip', {static: false}) tooltip: ElementRef;
  public selectedEquipment;
  private edgeLength = 10;
  private diagrame: any;

  constructor(private iconGenerator: EquipmentsIconsGenerator) {
  }

  @Input() set data(val: EquipmentTreeModel[]) {
    if (val) {
      const equipmentsList = val;
      const nodes = this.getDiagramNodes(equipmentsList);
      const edges = this.getDiagramEdges(equipmentsList);
      const data = {
        nodes: nodes,
        edges: edges
      };
      const options = {
        layout: {
          hierarchical: {
            enabled: true,
            sortMethod: 'directed',
            levelSeparation: 120,
          }
        },
        interaction: {hover: true},
        manipulation: {
          enabled: false
        },
        edges: {
          smooth: {
            type: 'corner'
          },
          arrows: {to: false},
          hoverWidth: 0.5,
          selectionWidth: 1
        },
        nodes: {},
        physics: {
          enabled: true
        }
      };

      if (!this.diagrame) {
        this.diagrame = new vis.Network(this.container.nativeElement, data, options);
      } else {
        this.diagrame.setData(data);
      }

      this.focusOnHighlightedEquipment(equipmentsList);
      this.bindTooltipEvents(equipmentsList);
    }
  }

  ngOnDestroy() {
    if (this.diagrame) {
      this.diagrame.destroy();
      this.diagrame = null;
    }
  }

  getDiagramNodes(equipmentsList: any[]) {
    const nodes = [];
    equipmentsList.forEach((el, i) => {
      if (!nodes.some(n => n.id === el.meterId)) {
        const dontHasParent = this.dontHasParentForView(el, equipmentsList);
        let node = {
          id: el.meterId,
          image: this.iconGenerator.generate(el),
          shape: 'image',
          font: {
            size: 5,
            multi: 'html',
            align: 'shift-left',
            vadjust: -14,
            strokeWidth: 3,
            strokeColor: '#F5F6FA',
            bold: {size: 6, color: '#365986'}
          }
        };

        if (el.shops && el.shops.length) {
          node['label'] = el.shops.map(el => el.name + ' - ' + (el.tenant ? el.tenant.name : '')).join('\n');
        }
        if (el.commonAreas && el.commonAreas.length) {
          node['label'] = (node['label'] ? node['label'] + '\n' : '') + el.commonAreas.map(el => el.name).join('\n');
        }
        if (dontHasParent && el.parentLocation) {
          node['label'] = (node['label'] ? node['label'] + '\n' : '') + '<b>Feeds From: ' + el.parentLocation.locationName + '</b>';
        }

        nodes.push(node);

      }
    });
    return nodes;
  }

  dontHasParentForView(el: EquipmentTreeModel, equipmentsList: EquipmentTreeModel[]): boolean {
    let status = false;
    if (el.parentMeters && el.parentMeters.length && equipmentsList.every(equipment => el.parentMeters.indexOf(equipment.meterId) === -1)) {
      status = true;
    }
    return status;
  }

  getDiagramEdges(equipmentsList: any[]) {
    const edges = [];
    equipmentsList.forEach(el => {
      if (Array.isArray(el.parentMeters)) {
        el.parentMeters.forEach(pId => {
          edges.push({
            from: pId,
            to: el.meterId,
            length: this.edgeLength,
            color: {color: 'rgba(0, 0, 0, 0.7)', highlight: '#4fb0d4'}
          });
        });
      } else {
        edges.push({
          from: el.parentMeters,
          to: el.meterId,
          length: this.edgeLength,
          color: {color: 'rgba(0, 0, 0, 0.7)', highlight: '#4fb0d4'}
        });
      }
    });

    return edges;
  }

  getFirstHighlightedEquipment(equipmentsList: any[]) {
    return equipmentsList.find(el => el.highlight);
  }

  focusOnHighlightedEquipment(equipmentsList: any[]) {
    const firstselectedEquipment = this.getFirstHighlightedEquipment(equipmentsList);
    if (firstselectedEquipment && firstselectedEquipment.meterId) {
      setTimeout(() => {
        this.diagrame.fit({
          nodes: [firstselectedEquipment.meterId],
          animation: {
            duration: 500,
            easingFunction: 'linear'
          }
        });
      }, 150);
    }
  }

  bindTooltipEvents(equipmentsList: any[]) {
    this.diagrame.on('hoverNode', (params) => {
      equipmentsList.forEach(el => {
        if (el.meterId === params.node) {
          this.selectedEquipment = el;
        }
      });
      this.tooltip['open']();
    });
    this.diagrame.on('blurNode', () => {
      this.selectedEquipment = null;
      this.tooltip['close']();
    });
  }
}
