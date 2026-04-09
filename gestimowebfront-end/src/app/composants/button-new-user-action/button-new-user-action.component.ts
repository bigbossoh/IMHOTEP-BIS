import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageNewUtilisateurComponent } from 'src/app/pages/utilisateurs/page-new-utilisateur/page-new-utilisateur.component';

@Component({
  standalone: false,
  selector: 'app-button-new-user-action',
  templateUrl: './button-new-user-action.component.html',
  styleUrls: ['./button-new-user-action.component.css']
})
export class ButtonNewUserActionComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openDialog(){
    //new
    this.dialog.open(PageNewUtilisateurComponent, {
      width:'50%'

    }).afterClosed().subscribe(
      val=>{
        if(val==='Enregistrer'){
          //this.getAllProduct();
        }
      }
    );
  }

}
