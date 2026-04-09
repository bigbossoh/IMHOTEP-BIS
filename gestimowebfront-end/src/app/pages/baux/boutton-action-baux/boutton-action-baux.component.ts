import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageBauxNewComponent } from '../page-baux-new/page-baux-new.component';

@Component({
  standalone: false,
  selector: 'app-boutton-action-baux',
  templateUrl: './boutton-action-baux.component.html',
  styleUrls: ['./boutton-action-baux.component.css'],
})
export class BouttonActionBauxComponent implements OnInit {
  @Output() bauxEmmitter: EventEmitter<any> = new EventEmitter();
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialolRef = this.dialog.open(PageBauxNewComponent, {
      width: '50%',
    });
    dialolRef.afterClosed().subscribe(() => {
     
      this.bauxEmmitter.emit('SAVE_BAUX');
    });
  }

  ngOnInit(): void {}
}
