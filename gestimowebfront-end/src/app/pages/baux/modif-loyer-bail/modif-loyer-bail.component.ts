import { ModifierBailActions } from './../../../ngrx/baux/baux.actions';
import { Store } from '@ngrx/store';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../page-baux/page-baux.component';
import { Observable } from 'rxjs';
import { BauxState } from 'src/app/ngrx/baux/baux.reducer';
import { map } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-modif-loyer-bail',
  templateUrl: './modif-loyer-bail.component.html',
  styleUrls: ['./modif-loyer-bail.component.css'],
})
export class ModifLoyerBailComponent implements OnInit {
  submitted = false;
  bauxState$: Observable<BauxState> | null = null;
  formGroup?: UntypedFormGroup;
  v_data: any;
  v_bien: any = '';
  v_loyer = 0;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<ModifLoyerBailComponent>,
    private store: Store<any>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.v_data = this.data.id;
    this.v_bien = `${this.getDisplayValue(this.v_data?.utilisateurOperation, 'Locataire')} / ${
      this.getDisplayValue(this.v_data?.codeAbrvBienImmobilier, 'Bien')
    }`;
    this.v_loyer = Number(this.v_data?.nouveauMontantLoyer ?? 0);
    const dateDebut = this.normalizeDateInput(this.v_data?.dateDebut);
    const dateFin = this.normalizeDateInput(this.v_data?.dateFin);
    this.formGroup = this.fb.group({
      idBail: [this.v_data.id],
      idAgence: [this.v_data.idAgence],
      nombreMoisCaution: [this.v_data.nbreMoisCautionBail],
      nouveauMontantLoyer: [this.v_loyer, Validators.required],
      ancienMontantLoyer: [this.v_loyer],
      dateDebuBail: [dateDebut],
      dateDePriseEncompte: [''],
      dateFin: [dateFin],
    });
  }

  get contractLabel(): string {
    return (
      this.getDisplayValue(this.v_data?.designationBail) ||
      this.getDisplayValue(this.v_data?.abrvCodeBail) ||
      'Bail'
    );
  }

  get currentRent(): number {
    return this.toAmount(this.v_loyer);
  }

  get nextRent(): number {
    return this.toAmount(this.formGroup?.get('nouveauMontantLoyer')?.value);
  }

  get rentDelta(): number {
    return this.nextRent - this.currentRent;
  }

  get cautionMonths(): number {
    const value = Number(this.formGroup?.get('nombreMoisCaution')?.value ?? 0);
    return Number.isFinite(value) ? value : 0;
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup?.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  formatAmount(value: number | null | undefined): string {
    const amount = this.toAmount(value);
    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSaveForm() {
    this.submitted = true;
    if (this.formGroup?.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.store.dispatch(new ModifierBailActions(this.formGroup?.value));
    this.bauxState$ = this.store.pipe(map((state) => state.bauxState));
    this.dialogRef.close();
  }

  private toAmount(value: unknown): number {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private normalizeDateInput(value: unknown): string {
    if (!value) {
      return '';
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toISOString().slice(0, 10);
    }

    const rawValue = String(value).trim();
    if (!rawValue) {
      return '';
    }

    const isoMatch = rawValue.match(/^\d{4}-\d{2}-\d{2}/);
    if (isoMatch) {
      return isoMatch[0];
    }

    const parsed = Date.parse(rawValue);
    if (Number.isNaN(parsed)) {
      return '';
    }

    return new Date(parsed).toISOString().slice(0, 10);
  }

  private getDisplayValue(value: unknown, fallback = ''): string {
    const sanitized = String(value ?? '')
      .replace(/\bnull\b/gi, ' ')
      .replace(/\s*\/\s*/g, '/')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\/+|\/+$/g, '')
      .trim();

    return sanitized || fallback;
  }
}
