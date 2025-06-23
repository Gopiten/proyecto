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

  // Formulario reactivo para el registro
  registroForm!: FormGroup;

  // Inyección del FormBuilder para crear el formulario
  constructor(private fb: FormBuilder) { }

  // Se ejecuta cuando se inicia el componente
  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordr: ['', Validators.required]
    }, {
      // Validación personalizada: verifica que las contraseñas coincidan
      validators: this.passwordsIguales('password', 'passwordr')
    });
  }

  // Función para validar que dos campos tengan el mismo valor (contraseñas)
  passwordsIguales(pass: string, passr: string) {
    return (formGroup: FormGroup) => {
      const passControl = formGroup.controls[pass];
      const passrControl = formGroup.controls[passr];

      if (passControl.value !== passrControl.value) {
        passrControl.setErrors({ noCoinciden: true });
      } else {
        // Si coinciden, se limpia el error
        passrControl.setErrors(null);
      }
    };
  }

  // Función que se ejecuta al hacer clic en "Registrar"
  registrar() {
     // Si el formulario no es válido, se muestran los errores y se cancela
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      alert('Por favor, corrija los errores del formulario.');
      return;
    }

    // Extraemos los valores del formulario
    const { nombre, email, password } = this.registroForm.value;

    // Creamos el objeto de registro
    const dataRegistro = { nombre, email, password };

    // Guardamos el usuario en localStorage
    localStorage.setItem('usuarioRegistrado', JSON.stringify(dataRegistro));

    alert('Usuario registrado localmente');

    // Limpiamos el formulario
    this.registroForm.reset();
  }
}