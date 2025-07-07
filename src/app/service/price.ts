import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

interface DolarBlueResponse {
  compra: number;
  venta: number;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})

export class Price {
  constructor(private http: HttpClient) {}

  obtenerTipoCambio() {
    const url = `https://dolarapi.com/v1/dolares/blue`;
    
    return this.http.get<DolarBlueResponse>(url).pipe(
      map(res => res.venta || 0)
    );
  }
}