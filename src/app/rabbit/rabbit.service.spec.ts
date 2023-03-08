import { TestBed } from '@angular/core/testing';

import { RabbitService } from './rabbit.service';

describe('RabbitService', () => {
  let service: RabbitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RabbitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
