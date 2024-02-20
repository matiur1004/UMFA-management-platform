import {CalculateProportionPipe} from './calculate-proportion.pipe';
import {SplitType, UnitType} from '@models';


describe('CalculateProportionPipe', () => {

  it('create an instance', () => {
    const pipe = new CalculateProportionPipe();
    expect(pipe).toBeTruthy();
  });

  it('Split Type - Proportional, for 6 shops', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 62,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: 0,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 62,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 52,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 662,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 592,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 112,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 342,
          "tenantName": "CoolTenant",
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": true,
      "splitType": SplitType.Proportional
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '3.40';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Proportional, for one shops', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 62,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: 0,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 62,
          "tenantName": "CoolTenant",
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": true,
      "splitType": SplitType.Proportional
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '100.00';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Proportional, for one CommonArea', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 562,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.CommonArea,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 562,
          "tenantName": "CoolTenant",
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": true,
      "splitType": SplitType.Proportional
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '100.00';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Proportional, for 3 CommonAreas', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 52,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.CommonArea,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 52,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 82,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 62,
          "tenantName": "CoolTenant",
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": true,
      "splitType": SplitType.Proportional
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '26.53';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Proportional, for CommonAreas and Shops', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 52,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 52,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 82,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 62,
          "tenantName": "CoolTenant",
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": true,
      "splitType": SplitType.Proportional
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '26.53';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Proportional, for "includeVacant": false', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 52,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 52,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 82,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 62,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 162,
          "tenantName": null,
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": false,
      "includeNotLiable": true,
      "splitType": SplitType.Proportional
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '17.57';

    expect(expectResult).toEqual(actualResult);
  });


  it('Split Type - Proportional, for "includeNotLiable" false', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 52,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 52,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 82,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 62,
          "tenantName": 'CoolTenant',
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 92,
          "tenantName": 'CoolTenant',
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 162,
          "tenantName": null,
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": false,
      "splitType": SplitType.Proportional
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '14.13';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Proportional, for Decimal areas', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 52.16,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 52.16,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 82.32,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 62.198,
          "tenantName": 'CoolTenant',
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 92.1548,
          "tenantName": 'CoolTenant',
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 162.1214,
          "tenantName": null,
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": true,
      "splitType": SplitType.Proportional
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '11.57';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Proportional, for huge areas', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 52112457,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 52112457,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 8245678,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 45678974,
          "tenantName": 'CoolTenant',
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 13248984,
          "tenantName": 'CoolTenant',
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 123456798,
          "tenantName": null,
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": true,
      "splitType": SplitType.Proportional
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '21.47';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Proportional, for Area === zero', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 0,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 0,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 0,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 0,
          "tenantName": 'CoolTenant',
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 0,
          "tenantName": 'CoolTenant',
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 0,
          "tenantName": null,
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": true,
      "splitType": SplitType.Proportional
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '0.00';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Equal, for 4 Shops&CA with decimal areas', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 52.021,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 52.021,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 68.01,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 92.05,
          "tenantName": 'CoolTenant',
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 56.66,
          "tenantName": 'CoolTenant',
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 245.23,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 154.889,
          "tenantName": null,
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": true,
      "splitType": SplitType.Equal
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '16.67';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Equal, for "includeVacant" false', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 52.021,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 52.021,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 68.01,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 92.05,
          "tenantName": 'CoolTenant',
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 56.66,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 245.23,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 154.889,
          "tenantName": null,
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": false,
      "includeNotLiable": true,
      "splitType": SplitType.Equal
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '25.00';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Equal, for "includeNotLiable" false', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 52.021,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 52.021,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 68.01,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 92.05,
          "tenantName": 'CoolTenant',
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 56.66,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 245.23,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 154.889,
          "tenantName": null,
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": false,
      "splitType": SplitType.Equal
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '100.00';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Equal, for "includeNotLiable" false with CA', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 52.021,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 52.021,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 68.01,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 92.05,
          "tenantName": 'CoolTenant',
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 56.66,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": true,
          "meterIds": [],
          "allocationShare": null,
          "area": 245.23,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 154.889,
          "tenantName": null,
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": false,
      "splitType": SplitType.Equal
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '50.00';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Equal, for "includeNotLiable" false. All units are not liable', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 52.021,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 52.021,
          "tenantName": "CoolTenant",
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 68.01,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 92.05,
          "tenantName": 'CoolTenant',
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 56.66,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 245.23,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.CommonArea,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 154.889,
          "tenantName": null,
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": false,
      "splitType": SplitType.Equal
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '0.00';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Equal, for "includeVacant" false. All units are vacant', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 52.021,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 52.021,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 68.01,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 92.05,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 56.66,
          "tenantName": null,
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": false,
      "includeNotLiable": true,
      "splitType": SplitType.Equal
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '0.00';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Custom, for 4 shops & 2 CA', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: 50,
      area: 52.021,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 50,
          "area": 52.021,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 50,
          "area": 68.01,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 50,
          "area": 92.05,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 50,
          "area": 56.66,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 92.05,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 56.66,
          "tenantName": null,
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": true,
      "splitType": SplitType.Custom,
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '25.00';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Custom, for custom values with decimals', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: 0.12154,
      area: 52.021,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 0.12154,
          "area": 52.021,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 0.1248898,
          "area": 68.01,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 0.789456,
          "area": 92.05,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 0.8784,
          "area": 56.66,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 11.0234,
          "area": 92.05,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 12.55,
          "area": 56.66,
          "tenantName": null,
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": true,
      "splitType": SplitType.Custom,
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '0.48';

    expect(expectResult).toEqual(actualResult);
  });


  it('Split Type - Custom, for custom values === zero', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: 0,
      area: 52.021,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 0,
          "area": 52.021,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 0,
          "area": 68.01,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 0,
          "area": 92.05,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 0,
          "area": 56.66,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 0,
          "area": 92.05,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 0,
          "area": 56.66,
          "tenantName": null,
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": true,
      "splitType": SplitType.Custom,
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '0.00';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Custom, for custom values === null', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: null,
      area: 52.021,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 52.021,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 68.01,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 92.05,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 56.66,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 92.05,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": null,
          "area": 56.66,
          "tenantName": null,
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": true,
      "splitType": SplitType.Custom,
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '0.00';

    expect(expectResult).toEqual(actualResult);
  });

  it('Split Type - Custom, for custom values < 0', () => {
    const pipe = new CalculateProportionPipe();
    const unit = {
      allocationShare: -11,
      area: 52.021,
      isLiable: true,
      tenantName: "CoolTenant",
      unitType: UnitType.Shop,
      usage: 0
    };
    const node = {
      "nodeType": 1,
      "allocatedUnits": [
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": -11,
          "area": 52.021,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": -45,
          "area": 68.01,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": -44,
          "area": 92.05,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 26,
          "area": 56.66,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": 11,
          "area": 92.05,
          "tenantName": null,
          "usage": 0
        },
        {
          "unitType": UnitType.Shop,
          "isLiable": false,
          "meterIds": [],
          "allocationShare": -5,
          "area": 56.66,
          "tenantName": null,
          "usage": 0
        },
      ],
      "ownersLiability": true,
      "includeVacant": true,
      "includeNotLiable": true,
      "splitType": SplitType.Custom,
    }

    let expectResult = (pipe.transform(unit, (node as any))).toFixed(2);
    let actualResult = '16.18';

    expect(expectResult).toEqual(actualResult);
  });

});

