import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, 
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {

    this.loginForm = this.fb.group({     
      correo: ['', [ Validators.required, Validators.email ]],
      password: ['', Validators.required],
    })
  }


  loginUsuario(){


    if(this.loginForm.invalid) return;

    const { correo, password } = this.loginForm.value;

    Swal.fire({
      title:"Espere..",
      showConfirmButton:false,
      onBeforeOpen: ()=>{
        Swal.showLoading()
      }      
    })

 
    this.authService.login(correo, password)
    .then(  credenciales => {
      console.log(credenciales);
      Swal.close();
      this.router.navigate(['/']);
    })
    .catch(err => {

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
       // footer: '<a href>Why do I have this issue?</a>'
      })

    })
  }


}
