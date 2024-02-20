import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {APP_BASE_HREF, DatePipe} from '@angular/common';
import {CustomAttributesFormComponent} from './custom-attributes-form.component';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {RouterModule} from '@angular/router';

describe('CustomAttributesFormComponent', () => {
  let component: CustomAttributesFormComponent;
  let fixture: ComponentFixture<CustomAttributesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgbModule,
        PipesModule,
        WidgetsModule,
        RouterModule.forRoot([])
      ],
      declarations: [SetCustomAttributeBindDialogMockDirective, CustomAttributesFormComponent],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        DatePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAttributesFormComponent);
    component = fixture.componentInstance;
    component.totalOnePhaseAmperage = '100';
    component.totalThreePhasesAmperage = '0';
    component.nodeAttributes = [
      {
        'attributeId': '6e37cf15-26ad-4832-81c2-3521b2bdb666',
        'recommendedValue': '11kv',
        'billingValue': null,
        'value': '11kv',
        'fileUrl': null,
        'comment': null,
        'attribute': {
          'id': '6e37cf15-26ad-4832-81c2-3521b2bdb666',
          'name': 'Voltage',
          'isImportant': true,
          'isSystem': true,
          'isAvailableForTariff': true,
          'canAddPhoto': false,
          'fieldType': 1,
          'unit': {'id': '8f7e98b1-2a33-4c93-a8d9-90b737c4de3b', 'name': 'V'},
          'equipmentGroups': [
            {
              'id': '10dd4a24-59a1-4f42-95a2-7af1ea9cdd3e',
              'name': 'Electricity Meters',
              'supplyType': 0,
              'isSystem': true
            }
          ],
          'unitValues': [220, 400, 0],
          'comboSettings': [
            {
              'id': 'd8be4420-8cac-4eac-9513-14e2d35cc8b1',
              'equipmentAttributeId': '6e37cf15-26ad-4832-81c2-3521b2bdb666',
              'value': '400V'
            },
            {
              'id': '8ed531ca-5a31-46b1-b390-1edf5fb75ab3',
              'equipmentAttributeId': '6e37cf15-26ad-4832-81c2-3521b2bdb666',
              'value': '11KV'
            },
            {
              'id': '2108e7e3-0b6b-45d2-8817-254780ec1a77',
              'equipmentAttributeId': '6e37cf15-26ad-4832-81c2-3521b2bdb666',
              'value': '22KV'
            },
            {
              'id': 'dd94e78a-cc41-4597-842e-278790ea5353',
              'equipmentAttributeId': '6e37cf15-26ad-4832-81c2-3521b2bdb666',
              'value': '33KV'
            },
            {
              'id': '6c97a4a0-5082-45bf-a1de-2ae9f8f4886a',
              'equipmentAttributeId': '6e37cf15-26ad-4832-81c2-3521b2bdb666',
              'value': '66KV'
            },
            {
              'id': '24ed33dd-1a37-43d4-8a5b-364d034d658b',
              'equipmentAttributeId': '6e37cf15-26ad-4832-81c2-3521b2bdb666',
              'value': '132KV'
            },
            {
              'id': 'a3c7d49f-f256-4810-82ec-3825115c8d96',
              'equipmentAttributeId': '6e37cf15-26ad-4832-81c2-3521b2bdb666',
              'value': '400KV'
            },
            {
              'id': 'a9a6aae3-c26e-4440-9476-3ef4eb8b3411',
              'equipmentAttributeId': '6e37cf15-26ad-4832-81c2-3521b2bdb666',
              'value': '220V'
            },
            {
              'id': 'dc1c8712-c155-454b-9923-460980cc9d26',
              'equipmentAttributeId': '6e37cf15-26ad-4832-81c2-3521b2bdb666',
              'value': '1KV'
            }
          ]
        }
      },
      {
        'attributeId': 'b510318c-92d7-43ea-b686-303fc837801b',
        'recommendedValue': '1 phase',
        'billingValue': null,
        'value': '1 phase',
        'fileUrl': null,
        'comment': null,
        'attribute': {
          'id': 'b510318c-92d7-43ea-b686-303fc837801b',
          'name': 'Phase',
          'isImportant': true,
          'isSystem': true,
          'isAvailableForTariff': true,
          'canAddPhoto': false,
          'fieldType': 1,
          'unit': null,
          'equipmentGroups': [
            {
              'id': 'fb4eca82-2028-46b4-870c-44cc3acfbcf4',
              'name': 'Electricity Breakers',
              'supplyType': 0,
              'isSystem': true
            },
            {
              'id': '10dd4a24-59a1-4f42-95a2-7af1ea9cdd3e',
              'name': 'Electricity Meters',
              'supplyType': 0,
              'isSystem': true
            }
          ],
          'unitValues': [0],
          'comboSettings': [
            {
              'id': '14e80995-8ffe-4964-ae12-3e7161e87ecf',
              'equipmentAttributeId': 'b510318c-92d7-43ea-b686-303fc837801b',
              'value': '1 Phase'
            },
            {
              'id': 'db24feaf-61c9-4c41-8bf9-9c4290fade5d',
              'equipmentAttributeId': 'b510318c-92d7-43ea-b686-303fc837801b',
              'value': '2 Phases'
            },
            {
              'id': 'efa8f1a3-e482-437a-834c-be9cc47f3831',
              'equipmentAttributeId': 'b510318c-92d7-43ea-b686-303fc837801b',
              'value': '3 Phases'
            }
          ]
        }
      },
      {
        'attributeId': '32f44e32-3f9f-469e-b057-60c0daf36e76',
        'recommendedValue': '100',
        'billingValue': null,
        'value': '100',
        'fileUrl': null,
        'comment': null,
        'attribute': {
          'id': '32f44e32-3f9f-469e-b057-60c0daf36e76',
          'name': 'CB size',
          'isImportant': true,
          'isSystem': true,
          'isAvailableForTariff': true,
          'canAddPhoto': true,
          'fieldType': 0,
          'unit': {'id': 'b5dd7c74-2b25-4dac-b928-c8a81ed63aaf', 'name': 'A'},
          'equipmentGroups': [
            {
              'id': 'fb4eca82-2028-46b4-870c-44cc3acfbcf4',
              'name': 'Electricity Breakers',
              'supplyType': 0,
              'isSystem': true
            },
            {
              'id': '10dd4a24-59a1-4f42-95a2-7af1ea9cdd3e',
              'name': 'Electricity Meters',
              'supplyType': 0,
              'isSystem': true
            }
          ],
          'unitValues': [100, 213, 1, 12, 15, 0, 5, 10],
          'comboSettings': []
        }
      },
      {
        'attributeId': '01b6313c-6430-4aa5-9379-1ee01b0fee31',
        'recommendedValue': '100',
        'billingValue': null,
        'value': '100',
        'fileUrl': null,
        'comment': null,
        'attribute': {
          'id': '01b6313c-6430-4aa5-9379-1ee01b0fee31',
          'name': 'Total CB size',
          'isImportant': true,
          'isSystem': true,
          'isAvailableForTariff': true,
          'canAddPhoto': true,
          'fieldType': 0,
          'unit': {'id': 'b5dd7c74-2b25-4dac-b928-c8a81ed63aaf', 'name': 'A'},
          'equipmentGroups': [
            {
              'id': '10dd4a24-59a1-4f42-95a2-7af1ea9cdd3e',
              'name': 'Electricity Meters',
              'supplyType': 0,
              'isSystem': true
            }
          ],
          'unitValues': [1, 20, 5, 100, 0],
          'comboSettings': []
        }
      },
      {
        'attributeId': 'a25ee1c1-d4f7-4980-b055-b6ad430b2ae5',
        'recommendedValue': '1100.00',
        'billingValue': null,
        'value': '1100.00',
        'fileUrl': null,
        'comment': null,
        'attribute': {
          'id': 'a25ee1c1-d4f7-4980-b055-b6ad430b2ae5',
          'name': 'Notified Maximum Demand',
          'isImportant': true,
          'isSystem': true,
          'isAvailableForTariff': true,
          'canAddPhoto': false,
          'fieldType': 0,
          'unit': {'id': '836fc172-2f4f-4cc5-b15b-8417b864fb21', 'name': 'kVA'},
          'equipmentGroups': [
            {
              'id': '10dd4a24-59a1-4f42-95a2-7af1ea9cdd3e',
              'name': 'Electricity Meters',
              'supplyType': 0,
              'isSystem': true
            }
          ],
          'unitValues': [100, 0],
          'comboSettings': []
        }
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('scenary 1. set max demand and reset it', () => {
    const maximumDemand = component.maxDemand;

    checkAttributes(component, {
      phase: ['1 phase', null],
      cbSize: ['100', null],
      totalCbSize: ['100', null],
      voltage: ['11kv', null],
      maxDemand: ['1100.00', null]
    });

    // Set maximum demand
    component.onCustomizeField(maximumDemand, {
      attributeName: 'notified maximum demand',
      comment: 'qwe123',
      file: null,
      value: 200
    });

    checkAttributes(component, {
      phase: ['1 phase', null],
      cbSize: ['100', 18.181818181818183],
      totalCbSize: ['100', 18.181818181818183],
      voltage: ['11kv', null],
      maxDemand: ['1100.00', 200]
    });

    component.onResetField(maximumDemand);

    checkAttributes(component, {
      phase: ['1 phase', null],
      cbSize: ['100', null],
      totalCbSize: ['100', null],
      voltage: ['11kv', null],
      maxDemand: ['1100.00', null]
    });

  });

  it('scenary 2. set max demand and phase', () => {
    const phase = component.phase;
    const maximumDemand = component.maxDemand;

    checkAttributes(component, {
      phase: ['1 phase', null],
      cbSize: ['100', null],
      totalCbSize: ['100', null],
      voltage: ['11kv', null],
      maxDemand: ['1100.00', null]
    });

    // Set maximum demand
    component.onCustomizeField(maximumDemand, {
      attributeName: 'notified maximum demand',
      comment: 'qwe123',
      file: null,
      value: 300
    });

    checkAttributes(component, {
      phase: ['1 phase', null],
      cbSize: ['100', 27.272727272727273],
      totalCbSize: ['100', 27.272727272727273],
      voltage: ['11kv', null],
      maxDemand: ['1100.00', 300]
    });


    // Set phase
    component.onCustomizeField(phase, {
      attributeName: 'phase',
      comment: 'qwe123',
      file: null,
      value: '3 phases'
    });

    checkAttributes(component, {
      phase: ['1 phase', '3 phases'],
      cbSize: ['100', 27.272727272727273],
      totalCbSize: ['100', 81.81818181818181],
      voltage: ['11kv', null],
      maxDemand: ['1100.00', 54.57272727272727]
    });

    component.onResetField(maximumDemand);

    checkAttributes(component, {
      phase: ['1 phase', null],
      cbSize: ['100', null],
      totalCbSize: ['100', null],
      voltage: ['11kv', null],
      maxDemand: ['1100.00', null]
    });
  });

  it('scenary 3. set max demand and voltage', () => {
    const voltage = component.voltage;
    const maximumDemand = component.maxDemand;

    checkAttributes(component, {
      phase: ['1 phase', null],
      cbSize: ['100', null],
      totalCbSize: ['100', null],
      voltage: ['11kv', null],
      maxDemand: ['1100.00', null]
    });

    // Set maximum demand
    component.onCustomizeField(maximumDemand, {
      attributeName: 'notified maximum demand',
      comment: 'qwe123',
      file: null,
      value: 500
    });

    checkAttributes(component, {
      phase: ['1 phase', null],
      cbSize: ['100', 45.45454545454545],
      totalCbSize: ['100', 45.45454545454545],
      voltage: ['11kv', null],
      maxDemand: ['1100.00', 500]
    });

    // Set voltage
    component.onCustomizeField(voltage, {
      attributeName: 'voltage',
      comment: 'qwe123',
      file: null,
      value: '220V'
    });

    checkAttributes(component, {
      phase: ['1 phase', null],
      cbSize: ['100', 45.45454545454545],
      totalCbSize: ['100', 45.45454545454545],
      voltage: ['11kv', '220V'],
      maxDemand: ['1100.00', 10]
    });

  });
});

function checkAttributes(component, expectParams) {
  expect(expectParams.phase[0]).toEqual(component.phase.recommendedValue);
  expect(expectParams.phase[1]).toEqual(component.phase.billingValue);

  expect(expectParams.cbSize[0]).toEqual(component.cbSize.recommendedValue);
  expect(expectParams.cbSize[1]).toEqual(component.cbSize.billingValue);

  expect(expectParams.totalCbSize[0]).toEqual(component.totalCbSize.recommendedValue);
  expect(expectParams.totalCbSize[1]).toEqual(component.totalCbSize.billingValue);

  expect(expectParams.voltage[0]).toEqual(component.voltage.recommendedValue);
  expect(expectParams.voltage[1]).toEqual(component.voltage.billingValue);

  expect(expectParams.maxDemand[0]).toEqual(component.maxDemand.recommendedValue);
  expect(expectParams.maxDemand[1]).toEqual(component.maxDemand.billingValue);
}


@Directive({
  selector: '[set-custom-attribute-bind-dialog]'
})
class SetCustomAttributeBindDialogMockDirective {
  @Output() confirmAction: EventEmitter<any> = new EventEmitter<any>();
  @Input('set-custom-attribute-bind-dialog') attribute: any;

  constructor() {
  }

  @HostListener('click', ['$event']) onClick() {
  }
}
