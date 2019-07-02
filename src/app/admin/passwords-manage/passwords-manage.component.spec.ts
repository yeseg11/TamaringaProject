import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordsManageComponent } from './passwords-manage.component';

describe('PasswordsManageComponent', () => {
  let component: PasswordsManageComponent;
  let fixture: ComponentFixture<PasswordsManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordsManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
