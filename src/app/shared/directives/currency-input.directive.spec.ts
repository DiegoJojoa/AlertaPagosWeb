import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CurrencyInputDirective } from './currency-input.directive';

@Component({
  imports: [ReactiveFormsModule, CurrencyInputDirective],
  template: `<input type="text" [formControl]="control" appCurrencyInput />`,
})
class TestHost {
  readonly control = new FormControl<number | null>(null);
}

describe('CurrencyInputDirective', () => {
  async function crearFixture(): Promise<{
    fixture: ComponentFixture<TestHost>;
    input: HTMLInputElement;
  }> {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;
    return { fixture, input };
  }

  it('should format digits typed by the user with thousands separators', async () => {
    const { input } = await crearFixture();

    input.value = '120000';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('120.000');
  });

  it('should update the underlying FormControl with the plain numeric value', async () => {
    const { fixture, input } = await crearFixture();

    input.value = '54000';
    input.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.control.value).toBe(54000);
  });

  it('should strip non-digit characters as the user types', async () => {
    const { input } = await crearFixture();

    input.value = '12a0b0';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('1.200');
  });

  it('should render an empty value as an empty string', async () => {
    const { input } = await crearFixture();

    input.value = '1000';
    input.dispatchEvent(new Event('input'));
    input.value = '';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('');
  });

  it('should format a value written programmatically through the FormControl', async () => {
    const { fixture, input } = await crearFixture();

    fixture.componentInstance.control.setValue(1250000);
    fixture.detectChanges();

    expect(input.value).toBe('1.250.000');
  });
});
