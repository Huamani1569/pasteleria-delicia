# Pastelería Delicia · Tienda en línea

Tienda en línea de una pastelería hecha con **Bootstrap 6** y JavaScript puro. El diseño sigue el estilo **Liquid Glass** de Apple: paneles translúcidos con desenfoque, reflejos que siguen al puntero, botones tipo cápsula y modo claro/oscuro.

**Demo en vivo:** https://pasteleria-delicia-huamani-porras.vercel.app

## Integrantes

- Anghelina Porras Torres
- Jean Piero Huamani Rodriguez

Universidad Continental · Desarrollo de Aplicaciones Móviles · Semana 11

## Funcionalidades

- Catálogo de 14 productos en 4 categorías (Tortas, Panes, Dulces, Salados).
- Filtros por categoría con *Nav pills* y buscador sin tildes ni mayúsculas.
- Carrito en un *Drawer* con *List group*: sumar, restar, quitar y vaciar.
- **10 % de descuento** automático cuando el subtotal pasa de S/ 100, con barra de progreso.
- Aviso con *Toast* al agregar productos.
- Confirmación del pedido con *Dialog*.
- Formulario de **torta personalizada** con validación y *Alert*.
- El carrito y el tema se guardan en `localStorage`.
- Diseño responsive (celular, tablet y escritorio) y modo oscuro.

## Conceptos de JavaScript

| Concepto | Dónde |
|---|---|
| Funciones flecha | `soles`, `tarjetaProducto`, `aplicarDescuento` |
| Parámetro rest | `sumar(...numeros)` |
| Parámetros por defecto | `agregar(producto, cantidad = 1)`, `aplicarDescuento(total, porcentaje = 10)` |
| Closure | `crearCarrito()` guarda `items` en una variable privada |
| Recursividad | `contarUnidades(lista)` |

## Estructura

```
index.html        → estructura con componentes de Bootstrap 6
css/estilos.css   → paleta de la marca (--bs-primary-*) y material Liquid Glass
js/tienda.js      → catálogo, carrito, filtros, formulario y tema
img/favicon.svg   → logo
```

## Cómo ejecutarlo

Es un sitio estático: basta con abrir `index.html` con Live Server (VS Code) o desplegarlo en Vercel importando este repositorio (sin configuración extra).

Fotos de productos: [Unsplash](https://unsplash.com).
