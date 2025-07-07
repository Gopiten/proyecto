import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
  console.log("LoginComponent cargado");

  this.loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  const yaEstaEnLogin = this.router.url === '/login' || this.router.url === '';

  if (localStorage.getItem('logueado') === 'true' && !yaEstaEnLogin) {
    this.router.navigate(['/product']);
  }
}

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      alert("Datos incorrectos, intente nuevamente");
      return;
    }

    const { name, email, password } = this.loginForm.value;

    const userData = localStorage.getItem('usuarioRegistrado');
    if (userData) {
      const usuario = JSON.parse(userData);

      if ((usuario.email === email || usuario.name === name) && usuario.password === password) {
        alert("Bienvenido al sistema");

        localStorage.setItem('logueado', 'true');
        localStorage.setItem('dataSesion', JSON.stringify(usuario));
        this.router.navigate(['/product']);
      } else {
        alert("Credenciales incorrectas");
      }
    } else {
      alert("No hay usuarios registrados");
    }
  }
}