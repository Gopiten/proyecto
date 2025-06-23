import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../service/product';

@Pipe({
  name: 'filterProduct',
  standalone: true
})

export class FilterProductPipe implements PipeTransform {

  // Método que transforma la lista de productos en base a un texto de búsqueda
  transform(products: Product[], texto: string): Product[] {
    // Si no hay productos o no se escribió texto, devolvemos la lista original
    if (!products || !texto) return products;

    // Convertimos el texto de búsqueda a minúsculas para hacer una comparación sin mayúsculas
    texto = texto.toLowerCase();

    // Filtramos los productos por nombre o categoría que contenga el texto ingresado
    return products.filter(product =>
      product.nombre.toLowerCase().includes(texto) || // Coincide con el nombre
      product.categoria.toLowerCase().includes(texto) // O coincide con la categoría
    );
  }
}