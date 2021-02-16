import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as ui from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando:boolean = false;
  uiSubs: Subscription;

  constructor( private fb: FormBuilder, 
               private store: Store<AppState>,
               private authService: AuthService,
               private router: Router ) { }

  ngOnInit() {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
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



  crearUsuario(){

    if(this.registroForm.invalid) return;

    const { nombre, correo, password } = this.registroForm.value;

    ///loading
    this.store.dispatch( ui.isLoading() );
   
    // Swal.fire({
    //   title:"Espere..",
    //   showConfirmButton:false,
    //   onBeforeOpen: ()=>{
    //     Swal.showLoading()
    //   }      
    // })

    this.authService.crearUsuario(nombre, correo, password)
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

    // console.log(this.registroForm.valid);
    // console.log(this.registroForm.value);
  }

}
