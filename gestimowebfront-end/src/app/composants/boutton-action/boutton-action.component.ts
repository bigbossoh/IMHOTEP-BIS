import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PageBienImmobilierNewComponent } from 'src/app/pages/bien-immobilier/page-bien-immobilier-new/page-bien-immobilier-new.component';

@Component({
  standalone: false,
  selector: 'app-boutton-action',
  templateUrl: './boutton-action.component.html',
  styleUrls: ['./boutton-action.component.css'],
})
export class BouttonActionComponent implements OnInit {
  @Output()
  clickEvent = new EventEmitter();
  constructor(public dialog: MatDialog) { }
  openDialog(): void {

    this.clickEvent.emit();
  }
  ngOnInit(): void { }

}
