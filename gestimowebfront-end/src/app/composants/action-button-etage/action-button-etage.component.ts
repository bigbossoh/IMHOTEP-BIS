import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEtageNewComponent } from '../../pages/bien-immobilier/page-etage-new/page-etage-new.component';

@Component({
  standalone: false,
  selector: 'app-action-button-etage',
  templateUrl: './action-button-etage.component.html',
  styleUrls: ['./action-button-etage.component.css']
})
export class ActionButtonEtageComponent implements OnInit {

  constructor(public dialog:MatDialog) { }
  openDialog() {
    const dialogref=this.dialog.open(PageEtageNewComponent,{})
  }
  ngOnInit(): void {
  }

}
