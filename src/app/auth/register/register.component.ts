import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['register.component.css'
  ]
})
export class RegisterComponent implements OnInit {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['Oscar', Validators.required],
    email: ['test100@gmail.com', [Validators.required, Validators.email]],
    password: ['12345', Validators.required],
    password2: ['12345', Validators.required],
    terminos: [true, Validators.required]
  }, {
    validators: this.passwordsIguales('password', 'password2')
  });


  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) { }

  crearUsuario() {
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if (this.registerForm.invalid) {
      return;
    }
    //Realizar el posteo
    this.usuarioService.crearUsuario(this.registerForm.value).subscribe(resp => {
      // console.log('usuario creado')
      //console.log(resp);
      //Navegar al dashboard
      this.router.navigateByUrl('/');
    }, (err) =>
    //console.warn(err.error.msg));
    {
      //Si sucede algun error con sweetAlert
      Swal.fire('Error', err.error.msg, 'error');
    });
  }


  public campoValido(campo: string): boolean {

    if (this.registerForm.get(campo).invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }

  }
  aceptaTerminos() {
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }

  contrasenasNoValidas() {
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;
    if ((pass1 !== pass2) && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {

    return (FormGroup: FormGroup) => {
      const pass1Control = FormGroup.get(pass1Name);
      const pass2Control = FormGroup.get(pass2Name);

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null)
      } else {
        pass2Control.setErrors({ noEsIgual: true })
      }

    }

  }

  ngOnInit(): void {
  }

}
