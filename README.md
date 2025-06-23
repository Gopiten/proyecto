📋 Aplicación Web de Facturación y Control de Stock
Este repositorio contiene una aplicación desarrollada en Angular, diseñada para facilitar la administración de productos y la emisión de facturas en pesos argentinos (ARS) o dólares estadounidenses (USD). La conversión se realiza automáticamente en base a la cotización oficial obtenida desde la API del BCRA.

🧰 Stack Tecnológico
Angular (Framework principal)

TypeScript

HTML & CSS

LocalStorage para almacenamiento persistente en el navegador

API externa del BCRA para tipo de cambio

✨ Características destacadas
Registro y acceso de usuarios sin autenticación externa (usando almacenamiento local)

Gestión completa de productos: alta, edición y eliminación

Añadir artículos al carrito de compras

Generación de factura en moneda local o extranjera

Conversión automática con la tasa de cambio actualizada

Validaciones de formularios para evitar errores de entrada

📂 Almacenamiento de datos
La aplicación no se conecta a ningún servidor externo ni base de datos.
Toda la información es gestionada en el lado del cliente mediante LocalStorage, lo que permite pruebas rápidas sin necesidad de configuración adicional.