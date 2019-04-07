import { TestBed } from '@angular/core/testing';

import { LineupsService } from './lineups.service';

describe('LineupsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LineupsService = TestBed.get(LineupsService);
    expect(service).toBeTruthy();
  });
});
