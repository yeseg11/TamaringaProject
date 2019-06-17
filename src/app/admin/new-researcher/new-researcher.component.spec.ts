import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewResearcherComponent } from './new-researcher.component';

describe('NewResearcherComponent', () => {
  let component: NewResearcherComponent;
  let fixture: ComponentFixture<NewResearcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewResearcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewResearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
