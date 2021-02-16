export class Usuario {

    static fromFirebase( { email, uid, nombre } ){ // propiedades del documento de firebase store.
        return new Usuario(uid, nombre, email )
    }
 
    constructor(
        public uid: string,
        public nombre: string,
        public email: string,
    ){}

}