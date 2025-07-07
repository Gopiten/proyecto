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
  products: Product[] = [];
  filter: string = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cargarProducts();
  }

  cargarProducts(): void {
    this.products = this.productService.obtenerProducts();
  }

  eliminarProduct(id: number): void {
    if (confirm('¿Estás seguro de que querés eliminar este producto?')) {
      this.productService.eliminarProduct(id);
      this.cargarProducts();
    }
  }

  editarProduct(product: Product): void {
    localStorage.setItem('productEditar', JSON.stringify(product));
    this.router.navigate(['/product/new']);
  }

  agregarAlCart(product: Product): void {
    this.cartService.agregarProduct(product);
    alert(`${product.nombre} fue agregado al carrito.`);
  }
}