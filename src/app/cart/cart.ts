import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../app/service/cart';
import { Product } from '../../app/service/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})

export class CartComponent {
  
  products: (Product & { cantidad: number })[] = [];
  
  constructor(private cartService: CartService, private router: Router) {
    this.products = this.cartService.obtenerProducts();
  }

  eliminar(id: number) {
    this.cartService.eliminarProduct(id);
    this.products = this.cartService.obtenerProducts();
  }

  actualizarCantidad(id: number, event: Event) {
    const cantidad = +(event.target as HTMLInputElement).value;
    if (cantidad > 0) {
      this.cartService.actualizarCantidad(id, cantidad);
    }
  }

  generarBill() {
    this.router.navigate(['/bill']);
  }
}