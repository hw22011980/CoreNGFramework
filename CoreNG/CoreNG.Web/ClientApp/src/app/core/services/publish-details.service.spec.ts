import { TestBed } from '@angular/core/testing';

import { PublishDetailsService } from './publish-details.service';

describe('SendSelectedItemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PublishDetailsService = TestBed.get(PublishDetailsService);
    expect(service).toBeTruthy();
  });
});
