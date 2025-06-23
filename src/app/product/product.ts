import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../app/service/product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../service/cart';
import { FilterProductPipe } from '../pipe/filter-product-pipe';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule, FilterProductPipe],
  templateUrl: './product.html',
  styleUrls: ['./product.css']
})

export class ProductComponent implements OnInit {
  products: Product[] = []; // Lista de productos a mostrar
  filter: string = ''; // Texto para el filtro de búsqueda

  constructor(
    private productService: ProductService,
    private router: Router,
    public cartService: CartService
  ) {}

  // Método que se ejecuta cuando se inicia el componente
  ngOnInit(): void {
    this.cargarProducts(); // Cargamos los productos desde el servicio
  }

  // Obtiene la lista de productos desde el servicio
  cargarProducts(): void {
    this.products = this.productService.obtenerProducts();
  }

  // Elimina un producto tras confirmación del usuario
  eliminarProduct(id: number): void {
    if (confirm('¿Estás seguro de que querés eliminar este producto?')) {
      this.productService.eliminarProduct(id);
      this.cargarProducts();
    }
  }

  // Redirige al formulario de edición, guardando el producto a editar en localStorage
  editarProduct(product: Product): void {
    localStorage.setItem('productEditar', JSON.stringify(product));
    this.router.navigate(['/product/new']);
  }

  // Agrega el producto al carrito
  agregarAlCart(product: Product): void {
    this.cartService.agregarProduct(product);
    alert(`${product.nombre} fue agregado al carrito.`);
  }
}