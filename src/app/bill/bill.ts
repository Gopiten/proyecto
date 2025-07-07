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

  @Input() productosSeleccionados: (Product & { cantidad: number })[] = [];

  @Output() compraConfirmada = new EventEmitter<void>();

  tipoCambioUSD: number = 350;

  nombreUsuario: string = '';

  constructor(private price: Price, private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.productosSeleccionados = this.cartService.obtenerProducts();

    this.price.obtenerTipoCambio().subscribe(valor => {
      this.tipoCambioUSD = valor;
    });

    const sesion = localStorage.getItem('dataSesion');
    if (sesion) {
      const usuario = JSON.parse(sesion);
      this.nombreUsuario = usuario.nombre || usuario.email;
    }
  }

  obtenerTotalARS(): number {
    return this.productosSeleccionados.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  }

  obtenerTotalUSD(): number {
    return this.obtenerTotalARS() / this.tipoCambioUSD;
  }

  confirmarCompra(): void {
    this.generarPDF(() => {
      this.cartService.limpiarCart();
      alert('¡Compra realizada con éxito!');
      this.router.navigate(['/product']);
    });
  }

  generarPDF(callback: () => void): void {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor('#0d6efd');
    doc.setFont('helvetica', 'bold');
    doc.text('Factura de Compra', 14, 22);

    doc.setFontSize(12);
    doc.setTextColor('#212529');
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${this.nombreUsuario}`, 14, 32);

    const rows = this.productosSeleccionados.map(p => [
      p.nombre,
      p.cantidad.toString(),
      `$${p.precio.toFixed(2)}`,
      `$${(p.precio * p.cantidad).toFixed(2)}`,
      this.tipoCambioUSD > 0
        ? `$${(p.precio * p.cantidad / this.tipoCambioUSD).toFixed(2)}`
        : 'Cargando...'
    ]);

    autoTable(doc, {
      head: [['Producto', 'Cantidad', 'Precio Unitario (ARS)', 'Total (ARS)', 'Total (USD)']],
      body: rows,
      startY: 40,
      theme: 'grid',
      headStyles: {
        fillColor: '#e9ecef',
        textColor: '#212529',
        fontStyle: 'bold',
        fontSize: 12,
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 11,
        textColor: '#212529',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: '#f8f9fa'
      },
      columnStyles: {
        0: { halign: 'left' }
      },
      styles: {
        cellPadding: 4,
        lineColor: '#dee2e6',
        lineWidth: 0.1
      }
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 40;

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#0d6efd');
    doc.text(`Total en ARS: $${this.obtenerTotalARS().toFixed(2)}`, 14, finalY + 15);
    doc.text(`Total en USD: $${this.obtenerTotalUSD().toFixed(2)}`, 14, finalY + 25);

    const ahora = new Date();
    const fechaStr = ahora.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#6c757d');
    doc.text(`Emitido: ${fechaStr}`, doc.internal.pageSize.getWidth() - 60, finalY + 35);

    const nombreArchivo = `factura_${ahora.toISOString().slice(0, 10)}.pdf`;

    doc.save(nombreArchivo);

    setTimeout(() => callback(), 1500);
  }
}