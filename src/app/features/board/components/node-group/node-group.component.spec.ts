import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeGroupComponent } from './node-group.component';

describe('NodeGroupComponent', () => {
  let component: NodeGroupComponent;
  let fixture: ComponentFixture<NodeGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NodeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
