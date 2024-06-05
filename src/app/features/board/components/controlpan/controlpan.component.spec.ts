import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlpanComponent } from './controlpan.component';

describe('ControlpanComponent', () => {
  let component: ControlpanComponent;
  let fixture: ComponentFixture<ControlpanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlpanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControlpanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
