import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageNewUtilisateurComponent } from '../page-new-utilisateur/page-new-utilisateur.component';

@Component({
  standalone: false,
  selector: 'app-button-action-utlisateur',
  templateUrl: './button-action-utlisateur.component.html',
  styleUrls: ['./button-action-utlisateur.component.css']
})
export class ButtonActionUtlisateurComponent implements OnInit {

  @Output() utilisateurEmmitter: EventEmitter<any> = new EventEmitter();
  constructor(public dialog: MatDialog) { }
  openDialog(): void {
    const dialolRef = this.dialog.open(PageNewUtilisateurComponent, {
      width: '1200px',

    });
    dialolRef.afterClosed().subscribe(() => {
     
      this.utilisateurEmmitter.emit("SAVE_USER")
    });
  }

  ngOnInit(): void {
  }

}
