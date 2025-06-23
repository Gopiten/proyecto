import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductService, Product } from '../service/product';
import { CommonModule } from '@angular/common';
import { CartService } from '../service/cart';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})

export class ProductListComponent implements OnInit {

  productForm!: FormGroup; // Formulario reactivo para el producto
  modoEdicion: boolean = false; // Modo edición (true si estamos editando un producto)

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}

  // Se ejecuta al iniciar el componente
  ngOnInit(): void {
    // Creamos el formulario con validaciones
    this.productForm = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      categoria: ['', Validators.required],
      imagen: ['']
    });

    // Si hay un producto guardado para edición, lo cargamos en el formulario
    const productGuardado = localStorage.getItem('productEditar');
    if (productGuardado) {
      const product: Product = JSON.parse(productGuardado);
      this.modoEdicion = true;
      this.productForm.patchValue(product); // Cargamos datos en el formulario
      localStorage.removeItem('productEditar');
    }
  }

  // Guardar o actualizar un producto
  guardar(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched(); // Marca todos los campos para mostrar errores
      alert('Por favor complete correctamente todos los campos obligatorios');
      return;
    }

    const product: Product = this.productForm.value;

    if (this.modoEdicion) {
      this.productService.actualizarProduct(product); // Actualiza producto
      alert('Producto actualizado correctamente');
    } else {
      this.productService.agregarProduct(product); // Agrega nuevo producto
      alert('Producto agregado correctamente');
    }

    this.router.navigate(['/product']); // Vuelve a la lista de productos
  }

  // Agrega el producto al carrito
  agregarAlCart(product: Product) {
    this.cartService.agregarProduct(product);
  }

  // Botón cancelar que vuelve a la vista de productos
  cancelar(): void {
    this.router.navigate(['/product']);
  }

  // Maneja la subida de imagen desde archivo local y lo convierte en base64
  onFileSelected(event: any): void {
    const archivo = event.target.files[0]; // Obtenemos el archivo subido
    if (archivo) {
      const lector = new FileReader(); // Creamos el lector de archivos
      lector.onload = () => {
        const imagenBase64 = lector.result as string; // Convertimos en base64
        this.productForm.patchValue({ imagen: imagenBase64 }); // Cargamos en el formulario
      };
      lector.readAsDataURL(archivo); // Leemos el archivo como data URL
    }
  }
}