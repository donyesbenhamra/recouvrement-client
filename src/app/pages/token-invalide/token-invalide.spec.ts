import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenInvalide } from './token-invalide';

describe('TokenInvalide', () => {
  let component: TokenInvalide;
  let fixture: ComponentFixture<TokenInvalide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenInvalide],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenInvalide);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
