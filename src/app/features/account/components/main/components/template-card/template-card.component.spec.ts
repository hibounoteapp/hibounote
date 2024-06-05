import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateCardComponent } from './template-card.component';

describe('TemplateCardComponent', () => {
  let component: TemplateCardComponent;
  let fixture: ComponentFixture<TemplateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
