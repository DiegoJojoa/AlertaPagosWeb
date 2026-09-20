import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PosponerDialog } from './posponer-dialog';

function crearFixture(): ComponentFixture<PosponerDialog> {
  TestBed.configureTestingModule({ imports: [PosponerDialog] });
  const fixture = TestBed.createComponent(PosponerDialog);
  fixture.detectChanges();
  return fixture;
}

describe('PosponerDialog', () => {
  it('should preselect "En 1 hora" by default', () => {
    const fixture = crearFixture();
    const compiled = fixture.nativeElement as HTMLElement;

    const radios = Array.from(compiled.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    expect(radios.find((r) => r.checked)?.value).toBe('1-hora');
  });

  it('should update the selected option when another row is clicked', () => {
    const fixture = crearFixture();
    const compiled = fixture.nativeElement as HTMLElement;

    const radios = Array.from(compiled.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    const diaRadio = radios.find((r) => r.value === '1-dia')!;
    diaRadio.click();
    fixture.detectChanges();

    expect(diaRadio.checked).toBe(true);
    expect(radios.find((r) => r.value === '1-hora')?.checked).toBe(false);
  });

  it('should emit the selected option when confirmed', () => {
    const fixture = crearFixture();
    const compiled = fixture.nativeElement as HTMLElement;
    const emitted: string[] = [];
    fixture.componentInstance.confirmed.subscribe((opcion) => emitted.push(opcion));

    const radios = Array.from(compiled.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    radios.find((r) => r.value === 'no-recordar')!.click();
    fixture.detectChanges();
    compiled.querySelector<HTMLButtonElement>('.btn-primary')?.click();

    expect(emitted).toEqual(['no-recordar']);
  });

  it('should emit cancelled when the cancel button is clicked', () => {
    const fixture = crearFixture();
    let cancelled = false;
    fixture.componentInstance.cancelled.subscribe(() => (cancelled = true));

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('.btn-outlined')
      ?.click();

    expect(cancelled).toBe(true);
  });

  it('should disable the radios and actions while loading', () => {
    const fixture = crearFixture();
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector<HTMLInputElement>('input[type="radio"]')?.disabled).toBe(true);
    expect(compiled.querySelector<HTMLButtonElement>('.btn-primary')?.disabled).toBe(true);
  });

  it('should show the error message when present', () => {
    const fixture = crearFixture();
    fixture.componentRef.setInput('errorMessage', 'No se pudo posponer el recordatorio.');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.confirm-dialog__error')?.textContent).toContain(
      'No se pudo posponer el recordatorio.',
    );
  });
});
