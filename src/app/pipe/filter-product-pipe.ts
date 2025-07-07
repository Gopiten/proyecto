import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../service/product';

@Pipe({
  name: 'filterProduct',
  standalone: true
})

export class FilterProductPipe implements PipeTransform {

  transform(products: Product[], texto: string): Product[] {
    if (!products || !texto) return products;

    texto = texto.toLowerCase();

    return products.filter(product =>
      product.nombre.toLowerCase().includes(texto) ||
      product.categoria.toLowerCase().includes(texto)
    );
  }
}