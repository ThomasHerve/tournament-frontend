import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRabbitComponent } from './test-rabbit.component';

describe('TestRabbitComponent', () => {
  let component: TestRabbitComponent;
  let fixture: ComponentFixture<TestRabbitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestRabbitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestRabbitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
