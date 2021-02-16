import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( public auth: AngularFireAuth,
               private firestore: AngularFirestore ) { }

  initAuthListener(){
    this.auth.authState.subscribe( user => {
      // console.log(user)
      console.log(user?.uid)
      console.log(user?.email)
    })
  }


  crearUsuario(nombre:string, email:string, password: string){
    // console.log(nombre, email, password)

    //devuelve una promise
   return this.auth.createUserWithEmailAndPassword(email, password)
      .then( ({ user }) => {

        const newUser = new Usuario( user.uid ,nombre, user.email )

        return this.firestore.doc<Usuario>(`${user.uid}/usuario`).set( {...newUser });          
      })

  }

  login(email:string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);  
  }

  logout() {
   return this.auth.signOut();  
  }


  isAuth(){
    return this.auth.authState.pipe(
      map( fuser => fuser !== null )
    )
  }


}
