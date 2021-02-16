import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as ui from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando:boolean = false;
  uiSubs: Subscription;

  constructor(private fb: FormBuilder, 
              private store: Store<AppState>,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {

    this.loginForm = this.fb.group({     
      correo: ['', [ Validators.required, Validators.email ]],
      password: ['', Validators.required],
    })


   this.uiSubs =   this.store.select('ui').subscribe(ui=>{              
                        this.cargando = ui.isLoading;
                        console.log("Cargando.. ");
                     })

  }

  ngOnDestroy(){
    this.uiSubs.unsubscribe(); 
  }


  loginUsuario(){


    if(this.loginForm.invalid) return;

    const { correo, password } = this.loginForm.value;

    this.store.dispatch( ui.isLoading() );

    // Swal.fire({
    //   title:"Espere..",
    //   showConfirmButton:false,
    //   onBeforeOpen: ()=>{
    //     Swal.showLoading()
    //   }      
    // })

 
    this.authService.login(correo, password)
    .then(  credenciales => {
      console.log(credenciales);
      // Swal.close();
      this.store.dispatch( ui.stopLoading() );
      this.router.navigate(['/']);
    })
    .catch(err => {
      this.store.dispatch( ui.stopLoading() );
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
       // footer: '<a href>Why do I have this issue?</a>'
      })

    })
  }


}
