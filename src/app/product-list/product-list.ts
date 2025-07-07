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

  productForm!: FormGroup;
  modoEdicion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      categoria: ['', Validators.required],
      imagen: ['']
    });

    const productGuardado = localStorage.getItem('productEditar');
    if (productGuardado) {
      const product: Product = JSON.parse(productGuardado);
      this.modoEdicion = true;
      this.productForm.patchValue(product);
      localStorage.removeItem('productEditar');
    }
  }

  guardar(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      alert('Por favor complete correctamente todos los campos obligatorios');
      return;
    }

    const product: Product = this.productForm.value;

    if (this.modoEdicion) {
      this.productService.actualizarProduct(product);
      alert('Producto actualizado correctamente');
    } else {
      this.productService.agregarProduct(product);
      alert('Producto agregado correctamente');
    }

    this.router.navigate(['/product']);
  }

  agregarAlCart(product: Product) {
    this.cartService.agregarProduct(product);
  }

  cancelar(): void {
    this.router.navigate(['/product']);
  }

  onFileSelected(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onload = () => {
        const imagenBase64 = lector.result as string;
        this.productForm.patchValue({ imagen: imagenBase64 });
      };
      lector.readAsDataURL(archivo);
    }
  }
}