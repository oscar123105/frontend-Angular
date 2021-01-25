import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interfaces';
import { environment } from '../../environments/environment.prod';
import { LoginForm } from '../interfaces/login-form.interfaces';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
declare const gapi: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public auth2: any;

  constructor(private http: HttpClient, private router:Router, private ngZone: NgZone) {
    this.googleInit();
   }
//para desconectarse de logout sign -in  con google

googleInit(){
return new Promise<void>(resolve =>{
  gapi.load('auth2', () => {
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    this.auth2 = gapi.auth2.init({
      client_id: '1059419458990-1fghi57ahv1ufqmqscpp4jtcmoshptho.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
     
    });
    resolve();    
  });

})


}


//borrar el token 
  logout(){
    localStorage.removeItem('token');
    this.auth2.signOut().then(()=> {

      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login');
        console.log('User signed out.');
      })
     
    });
  }


  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
      map(resp => true),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
    //console.log('Creando usuario');
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }

  loginUsuario(formData: LoginForm) {
    //console.log('Creando usuario');
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }

  loginGoogle(token) {
    //console.log('Creando usuario');
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }
}
