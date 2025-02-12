import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PocketComponent } from './pocket.component';

describe('PocketComponent', () => {
  let component: PocketComponent;
  let fixture: ComponentFixture<PocketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PocketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
