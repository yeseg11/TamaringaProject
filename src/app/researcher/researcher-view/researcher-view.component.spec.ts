import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherViewComponent } from './researcher-view.component';

describe('ResearcherViewComponent', () => {
  let component: ResearcherViewComponent;
  let fixture: ComponentFixture<ResearcherViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearcherViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
