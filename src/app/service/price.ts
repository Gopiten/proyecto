import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

// Definimos la interfaz de la respuesta esperada de la API
interface DolarBlueResponse {
  compra: number;
  venta: number;
  fecha: string;
}

// Marcamos el servicio como disponible para toda la app
@Injectable({
  providedIn: 'root'
})

export class Price {
  constructor(private http: HttpClient) {}

  // Función para obtener el tipo de cambio del dólar blue
  obtenerTipoCambio() {
    const url = `https://dolarapi.com/v1/dolares/blue`;
    
    // Realiza la petición GET y transforma la respuesta para devolver solo el valor de venta
    return this.http.get<DolarBlueResponse>(url).pipe(
      map(res => res.venta || 0) // Si por alguna razón no hay valor, devuelve 0
    );
  }
}