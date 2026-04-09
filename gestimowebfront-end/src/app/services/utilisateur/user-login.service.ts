import { Injectable } from '@angular/core';
import { ApiService } from 'src/gs-api/src/services';
import { Router } from '@angular/router';
import { AuthRequestDto } from '../../../gs-api/src/models/auth-request-dto';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {


  constructor(
    private apiServiceGenerale:ApiService,
    privaterouter:Router
  ) { }
  login(authRequestDto:AuthRequestDto){
    return this.apiServiceGenerale.login(authRequestDto)
    .subscribe((data)=>{
      localStorage.setItem('acess_token',JSON.stringify(data));
    },error =>{
      console.log(error);

    })
  }
}
