import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLicenceComponent } from './add-Licence.component';

describe('AddUserComponent', () => {
  let component: AddLicenceComponent;
  let fixture: ComponentFixture<AddLicenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLicenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
