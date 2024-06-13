import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiesPopupComponent } from './cookies-popup.component';

describe('CookiesPopupComponent', () => {
  let component: CookiesPopupComponent;
  let fixture: ComponentFixture<CookiesPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookiesPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CookiesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
