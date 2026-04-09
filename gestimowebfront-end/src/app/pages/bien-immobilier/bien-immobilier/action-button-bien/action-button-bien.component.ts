import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PageBienImmobilierNewComponent } from '../../page-bien-immobilier-new/page-bien-immobilier-new.component';

@Component({
  standalone: false,
  selector: 'app-action-button-bien',
  templateUrl: './action-button-bien.component.html',
  styleUrls: ['./action-button-bien.component.css']
})
export class ActionButtonBienComponent implements OnInit {

  @Output() bienImmobilierEmmiter: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog) { }
  openDialog(): void {
    const dialolRef = this.dialog.open(PageBienImmobilierNewComponent, {
      //  width: '1024px',
    });
    dialolRef.afterClosed().subscribe(() => {
      this.bienImmobilierEmmiter.emit("SAVE_BIENS")
    });
  }
  ngOnInit(): void { }
  bouttonNouveauClick(): void {
    // this.clickEvent.emit();
  }

}
