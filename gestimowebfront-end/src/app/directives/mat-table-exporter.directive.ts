import { Directive, ElementRef } from '@angular/core';
import { saveAs } from 'file-saver';

interface ExportOptions {
  fileName?: string;
}

@Directive({
  standalone: false,
  selector: '[matTableExporter]',
  exportAs: 'matTableExporter',
})
export class MatTableExporterDirective {
  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  exportTable(_format: string = 'xlsx', options: ExportOptions = {}): void {
    const rows = this.extractRows();
    if (!rows.length) {
      return;
    }

    const csvContent = rows
      .map((row) => row.map((cell) => this.escapeCsv(cell)).join(','))
      .join('\n');

    const fileName = (options.fileName || 'export').trim().replace(/\s+/g, '_');
    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });

    saveAs(blob, `${fileName}.csv`);
  }

  private extractRows(): string[][] {
    const host = this.elementRef.nativeElement;
    const rowNodes = host.querySelectorAll(
      'mat-header-row, mat-row, tr, .mat-mdc-header-row, .mat-mdc-row'
    );

    return Array.from(rowNodes)
      .map((row) =>
        Array.from(
          row.querySelectorAll(
            'mat-header-cell, mat-cell, th, td, .mat-mdc-header-cell, .mat-mdc-cell'
          )
        )
          .map((cell) => (cell.textContent || '').replace(/\s+/g, ' ').trim())
          .filter((cell) => cell.length > 0)
      )
      .filter((row) => row.length > 0);
  }

  private escapeCsv(value: string): string {
    if (value.includes('"') || value.includes(',') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
