import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../app/service/product';
import { Price } from '../../app/service/price';
import { CartService } from '../service/cart';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-bill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bill.html',
  styleUrls: ['./bill.css']
})

export class BillComponent implements OnInit {

  // Recibe productos seleccionados desde otro componente
  @Input() productosSeleccionados: (Product & { cantidad: number })[] = [];

  // Emite un evento cuando se confirma la compra
  @Output() compraConfirmada = new EventEmitter<void>();

  // Tipo de cambio inicializado con valor por defecto
  tipoCambioUSD: number = 350;

  // Nombre del usuario para mostrar en la factura
  nombreUsuario: string = '';

  constructor(private price: Price, private cartService: CartService, private router: Router) {}

  // Al iniciar el componente
  ngOnInit(): void {
    // Obtenemos los productos del carrito
    this.productosSeleccionados = this.cartService.obtenerProducts();

    // Consultamos el tipo de cambio desde la API del BCRA
    this.price.obtenerTipoCambio().subscribe(valor => {
      this.tipoCambioUSD = valor;
    });

    // Obtenemos el nombre del usuario desde localStorage
    const sesion = localStorage.getItem('dataSesion');
    if (sesion) {
      const usuario = JSON.parse(sesion);
      this.nombreUsuario = usuario.nombre || usuario.email;
    }
  }

  // Calcula el total en pesos argentinos
  obtenerTotalARS(): number {
    return this.productosSeleccionados.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  }

  // Calcula el total en dólares según el tipo de cambio actual
  obtenerTotalUSD(): number {
    return this.obtenerTotalARS() / this.tipoCambioUSD;
  }

  // Confirma la compra y genera el PDF
  confirmarCompra(): void {
    this.generarPDF(() => {
      this.cartService.limpiarCart(); // Vaciamos el carrito
      alert('¡Compra realizada con éxito!');
      this.router.navigate(['/product']); // Volvemos a la vista de productos
    });
  }

  // Genera un archivo PDF con los detalles de la compra
  generarPDF(callback: () => void): void {
    const doc = new jsPDF(); // Crea el documento PDF
    
    // Título
    doc.setFontSize(18);
    doc.text('Factura de Compra', 14, 20);
    doc.setFontSize(12);
    doc.text(`Cliente: ${this.nombreUsuario}`, 14, 30);

    // Preparamos las filas de la tabla
    const rows = this.productosSeleccionados.map(p => [
      p.nombre,
      p.cantidad,
      `$${p.precio}`,
      `$${p.precio * p.cantidad}`,
      this.tipoCambioUSD > 0
      ? `$${(p.precio * p.cantidad / this.tipoCambioUSD).toFixed(2)}`
      : 'Cargando...'
    ]);

    // Dibujamos la tabla en el PDF
    autoTable(doc, {
      head: [['Producto', 'Cantidad', 'Precio Unitario (ARS)', 'Total (ARS)', 'Total (USD)']],
      body: rows,
      startY: 40,
      theme: 'grid'
    });

    // Calculamos la posición final para el total
    const finalY = (doc as any).lastAutoTable?.finalY || 40;

    // Mostramos los totales
    const totalARS = this.obtenerTotalARS().toFixed(2);
    const totalUSD = this.obtenerTotalUSD().toFixed(2);
    doc.text(`Total en ARS: $${totalARS}`, 14, finalY + 10);
    doc.text(`Total en USD: $${totalUSD}`, 14, finalY + 20);
    
    // Nombre del archivo con fecha actual
    const ahora = new Date();
    const fechaStr = ahora.toISOString().slice(0,10);
    const nombreArchivo = `factura_${fechaStr}.pdf`;

    // Guardamos el PDF
    doc.save(nombreArchivo);

    // Llamamos al callback para continuar con el flujo
    setTimeout(() => callback(), 500);
  }

}