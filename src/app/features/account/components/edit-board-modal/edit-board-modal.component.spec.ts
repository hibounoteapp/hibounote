import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBoardModalComponent } from './edit-board-modal.component';

describe('EditBoardModalComponent', () => {
  let component: EditBoardModalComponent;
  let fixture: ComponentFixture<EditBoardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBoardModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditBoardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
