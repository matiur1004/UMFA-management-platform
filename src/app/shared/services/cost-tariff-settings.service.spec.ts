import {TestBed} from '@angular/core/testing';

import {CostTariffSettingsService} from './cost-tariff-settings.service';

describe('CostTariffSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CostTariffSettingsService = TestBed.get(CostTariffSettingsService);
    expect(service).toBeTruthy();
  });
});
