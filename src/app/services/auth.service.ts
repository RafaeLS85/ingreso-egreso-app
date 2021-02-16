import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {


  userSubs: Subscription;

  constructor( public auth: AngularFireAuth,
               private firestore: AngularFirestore,
               private store: Store<AppState> ) { }

  initAuthListener(){
    this.auth.authState.subscribe( user => {
     
      // console.log(user?.uid)
      // console.log(user?.email)


      if( user ){

       this.userSubs = this.firestore.doc(`${user.uid}/usuario`).valueChanges()
                        .subscribe((firestoreUser:any) => {
                          console.log(firestoreUser);
                          //se debe crear un nuevo objeto con la clase usuario con el contenido de firestoreUser...
                          const user = Usuario.fromFirebase(firestoreUser);
                          this.store.dispatch(authActions.setUser({ user }))
                        })
            
      }else{
        //no existe el usuario.
        this.userSubs?.unsubscribe();
        this.store.dispatch( authActions.unSetUser() );
    
      }





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
