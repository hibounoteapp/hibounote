import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostMainComponent } from './post-main.component';

describe('PostMainComponent', () => {
  let component: PostMainComponent;
  let fixture: ComponentFixture<PostMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
