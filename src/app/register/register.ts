import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class RegisterComponent implements OnInit {

  registroForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordr: ['', Validators.required]
    }, {
      validators: this.passwordsIguales('password', 'passwordr')
    });
  }

  passwordsIguales(pass: string, passr: string) {
    return (formGroup: FormGroup) => {
      const passControl = formGroup.controls[pass];
      const passrControl = formGroup.controls[passr];

      if (passControl.value !== passrControl.value) {
        passrControl.setErrors({ noCoinciden: true });
      } else {
        passrControl.setErrors(null);
      }
    };
  }

  registrar() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      alert('Por favor, corrija los errores del formulario.');
      return;
    }

    const { nombre, email, password } = this.registroForm.value;

    const dataRegistro = { nombre, email, password };

    localStorage.setItem('usuarioRegistrado', JSON.stringify(dataRegistro));

    alert('Usuario registrado localmente');

    this.registroForm.reset();
  }
}