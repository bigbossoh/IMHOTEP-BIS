import { PageImmeubleNewComponent } from './../../pages/bien-immobilier/page-immeuble-new/page-immeuble-new.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-action-button-immeuble',
  templateUrl: './action-button-immeuble.component.html',
  styleUrls: ['./action-button-immeuble.component.css'],
})
export class ActionButtonImmeubleComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  openDialog() {
    const dialogref = this.dialog.open(PageImmeubleNewComponent, {
      width:'70%'

    });
  }

  ngOnInit(): void {}
}
