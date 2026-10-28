/**
 * ============================================================
 * tienda.js — Pastelería Delicia (Bootstrap 6 · Liquid Glass)
 * Integrantes: Anghelina Porras Torres · Jean Piero Huamani Rodriguez
 * ============================================================
 * Conceptos de JavaScript que se usan en este archivo:
 *  - Funciones flecha ........ soles, tarjetaProducto, aplicarDescuento, normalizar
 *  - Parámetro rest .......... sumar(...numeros)
 *  - Parámetros por defecto .. agregar(producto, cantidad = 1), aplicarDescuento(total, porcentaje = 10)
 *  - Closure ................. crearCarrito() guarda "items" en una variable privada
 *  - Recursividad ............ contarUnidades(lista)
 *  - localStorage ............ el carrito y el tema se recuerdan al recargar
 */

// Bootstrap 6 no crea window.bootstrap: sus componentes se IMPORTAN como módulo.
import { Toast, Drawer, Dialog } from "https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js";

/* ============================================================
   1. Datos del catálogo (4 categorías)
   ============================================================ */
const foto = (id, ancho = 640) =>
  `https://images.unsplash.com/photo-${id}?w=${ancho}&q=70&auto=format&fit=crop`;

const productos = [
  // Tortas
  { id: 1,  nombre: "Torta de chocolate",        categoria: "Tortas",  precio: 65,  etiqueta: "Más pedida", descripcion: "Bizcocho húmedo con fudge y ganache. 12 porciones.",        img: "1578985545062-69928b1d9587" },
  { id: 2,  nombre: "Selva negra",               categoria: "Tortas",  precio: 72,  etiqueta: "",           descripcion: "Chocolate, crema chantilly y cerezas al marrasquino.",       img: "1606890737304-57a1ca8a5b62" },
  { id: 3,  nombre: "Torta de fresas",           categoria: "Tortas",  precio: 68,  etiqueta: "",           descripcion: "Vainilla, chantilly y fresas frescas de estación.",          img: "1565958011703-44f9829ba187" },
  { id: 4,  nombre: "Torta arcoíris",            categoria: "Tortas",  precio: 85,  etiqueta: "Nuevo",      descripcion: "Seis capas de colores con buttercream. Ideal para fiestas.", img: "1464349095431-e9a21285b5f3" },
  // Panes
  { id: 5,  nombre: "Croissant de mantequilla",  categoria: "Panes",   precio: 4.5, etiqueta: "",           descripcion: "Hojaldrado y dorado, con mantequilla de verdad.",            img: "1555507036-ab1f4038808a" },
  { id: 6,  nombre: "Pan de masa madre",         categoria: "Panes",   precio: 14,  etiqueta: "",           descripcion: "Fermentación lenta de 24 h. Corteza crujiente.",            img: "1509440159596-0249088772ff" },
  { id: 7,  nombre: "Pan de molde artesanal",    categoria: "Panes",   precio: 9,   etiqueta: "",           descripcion: "Suave y esponjoso, perfecto para tus desayunos.",            img: "1598373182133-52452f7691ef" },
  // Dulces
  { id: 8,  nombre: "Tiramisú",                  categoria: "Dulces",  precio: 12,  etiqueta: "",           descripcion: "Café, mascarpone y cacao en porción individual.",           img: "1571877227200-a0d98ea607e9" },
  { id: 9,  nombre: "Cupcake red velvet",        categoria: "Dulces",  precio: 6,   etiqueta: "",           descripcion: "Con frosting de queso crema y frutos rojos.",               img: "1614707267537-b85aaf00c4b7" },
  { id: 10, nombre: "Donas glaseadas (3 u.)",    categoria: "Dulces",  precio: 10,  etiqueta: "",           descripcion: "Glaseado de chocolate, fresa y chispas de colores.",         img: "1551024601-bec78aea704b" },
  { id: 11, nombre: "Pie de limón",              categoria: "Dulces",  precio: 38,  etiqueta: "Clásico",    descripcion: "Masa sablé, crema de limón y merengue dorado.",             img: "1519915028121-7d3463d20b13" },
  // Salados
  { id: 12, nombre: "Sándwich triple",           categoria: "Salados", precio: 9,   etiqueta: "",           descripcion: "Pollo, palta, tomate y huevo en pan de molde.",             img: "1528735602780-2552fd46c7af" },
  { id: 13, nombre: "Empanaditas de pollo (4 u.)", categoria: "Salados", precio: 12, etiqueta: "",          descripcion: "Masa crocante rellena de pollo y especias.",                img: "1601050690597-df0568f70950" },
  { id: 14, nombre: "Quiche de verduras",        categoria: "Salados", precio: 32,  etiqueta: "Nuevo",      descripcion: "Espinaca, pimiento y queso. 8 porciones.",                  img: "1591985666643-1ecc67616216" },
];

const MINIMO_DESCUENTO = 100;
const CLAVE_CARRITO = "carrito-delicia";
const CLAVE_TEMA = "tema-delicia";

/* ============================================================
   2. Funciones de la semana
   ============================================================ */
// Función flecha con return implícito
const soles = (monto) => `S/ ${monto.toFixed(2)}`;

// Parámetro rest: recibe cualquier cantidad de números
const sumar = (...numeros) => numeros.reduce((acumulado, n) => acumulado + n, 0);

// Parámetro por defecto: si no se envía, el descuento es 10 %
const aplicarDescuento = (total, porcentaje = 10) => total - (total * porcentaje) / 100;

// Recursividad: caso base (lista vacía) + llamada a sí misma con el resto
function contarUnidades(lista) {
  if (lista.length === 0) return 0;
  const [primero, ...resto] = lista;
  return primero.cantidad + contarUnidades(resto);
}

// Closure: "items" es PRIVADO; solo se modifica con los métodos que devuelve
function crearCarrito(itemsIniciales = []) {
  let items = itemsIniciales;
  const guardar = () => localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));

  return {
    agregar(producto, cantidad = 1) {           // parámetro por defecto
      const existente = items.find((it) => it.id === producto.id);
      if (existente) existente.cantidad += cantidad;
      else items.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, img: producto.img, cantidad });
      guardar();
    },
    cambiar(id, delta) {
      const item = items.find((it) => it.id === id);
      if (!item) return;
      item.cantidad += delta;
      if (item.cantidad <= 0) items = items.filter((it) => it.id !== id);
      guardar();
    },
    quitar(id) { items = items.filter((it) => it.id !== id); guardar(); },
    vaciar() { items = []; guardar(); },
    lista: () => [...items],
    subtotal: () => sumar(...items.map((it) => it.precio * it.cantidad)),
    unidades: () => contarUnidades(items),
  };
}

// Lee el carrito guardado (solo productos que siguen existiendo, con su precio actual)
function leerCarritoGuardado() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || "[]");
    return datos
      .map((it) => ({ p: productos.find((x) => x.id === it.id), cantidad: Math.floor(it.cantidad) }))
      .filter(({ p, cantidad }) => p && cantidad > 0)
      .map(({ p, cantidad }) => ({ id: p.id, nombre: p.nombre, precio: p.precio, img: p.img, cantidad: Math.min(cantidad, 99) }));
  } catch {
    return [];
  }
}

const carrito = crearCarrito(leerCarritoGuardado());

/* ============================================================
   3. Utilidades del DOM y aviso (Toast)
   ============================================================ */
const $ = (selector) => document.querySelector(selector);
const normalizar = (texto) => texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const toast = Toast.getOrCreateInstance($("#aviso"));
const avisar = (mensaje) => {
  $("#avisoTexto").textContent = mensaje;
  toast.show();
};

/* ============================================================
   4. Catálogo: tarjetas, filtros (Nav pills) y buscador
   ============================================================ */
let categoriaActiva = "Todos";

// Flecha que devuelve el HTML de una tarjeta
const tarjetaProducto = (p, indice = 0) => `
  <div class="col">
    <article class="producto vidrio" style="animation-delay:${Math.min(indice, 8) * 45}ms">
      <div class="producto-foto">
        <img src="${foto(p.img)}" alt="${p.nombre}" loading="lazy" width="640" height="480">
        ${p.etiqueta ? `<span class="etiqueta ${p.etiqueta === "Nuevo" ? "nuevo" : ""}">${p.etiqueta}</span>` : ""}
      </div>
      <div class="producto-cuerpo">
        <span class="producto-categoria">${p.categoria}</span>
        <h3 class="producto-nombre">${p.nombre}</h3>
        <p class="producto-desc">${p.descripcion}</p>
        <div class="producto-pie">
          <span class="precio">${soles(p.precio)}</span>
          <button class="btn-solid theme-primary btn-agregar" type="button" data-id="${p.id}" aria-label="Agregar ${p.nombre} al carrito">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>Agregar
          </button>
        </div>
      </div>
    </article>
  </div>`;

function pintarFiltros() {
  const categorias = ["Todos", ...new Set(productos.map((p) => p.categoria))];
  $("#filtros").innerHTML = categorias.map((cat) => {
    const cuantos = cat === "Todos" ? productos.length : productos.filter((p) => p.categoria === cat).length;
    const activo = cat === categoriaActiva;
    return `<li class="nav-item">
      <button class="nav-link ${activo ? "active" : ""}" type="button" data-cat="${cat}" ${activo ? 'aria-current="true"' : ""}>
        ${cat}<span class="cuenta">${cuantos}</span>
      </button></li>`;
  }).join("");
}

function pintarProductos() {
  const termino = normalizar($("#buscar").value.trim());
  const visibles = productos.filter((p) => {
    const enCategoria = categoriaActiva === "Todos" || p.categoria === categoriaActiva;
    const enTexto = !termino || normalizar(`${p.nombre} ${p.descripcion} ${p.categoria}`).includes(termino);
    return enCategoria && enTexto;
  });

  $("#productos").innerHTML = visibles.map(tarjetaProducto).join("");
  $("#sinResultados").hidden = visibles.length > 0;

  const plural = visibles.length === 1 ? "producto" : "productos";
  $("#resultado").textContent =
    `${visibles.length} ${plural}` +
    (categoriaActiva !== "Todos" ? ` en ${categoriaActiva}` : "") +
    (termino ? ` para “${$("#buscar").value.trim()}”` : "");

  // Si una foto no carga, se muestra el nombre sobre el degradado
  $("#productos").querySelectorAll(".producto-foto img").forEach((img) => {
    img.addEventListener("error", () => {
      const respaldo = document.createElement("span");
      respaldo.className = "respaldo";
      respaldo.textContent = img.alt;
      img.replaceWith(respaldo);
    }, { once: true });
  });
}

$("#filtros").addEventListener("click", (e) => {
  const boton = e.target.closest("[data-cat]");
  if (!boton) return;
  categoriaActiva = boton.dataset.cat;
  pintarFiltros();
  pintarProductos();
});

$("#buscar").addEventListener("input", pintarProductos);

$("#productos").addEventListener("click", (e) => {
  const boton = e.target.closest("[data-id]");
  if (!boton) return;
  const producto = productos.find((p) => p.id === Number(boton.dataset.id));
  carrito.agregar(producto);                      // usa cantidad = 1 por defecto
  pintarCarrito();
  avisar(`${producto.nombre} agregado al carrito.`);
});

/* ============================================================
   5. Carrito: Drawer + List group + descuento del 10 %
   ============================================================ */
function calcularTotales() {
  const subtotal = carrito.subtotal();
  const conDescuento = subtotal > MINIMO_DESCUENTO;
  const total = conDescuento ? aplicarDescuento(subtotal) : subtotal;
  return { subtotal, conDescuento, descuento: subtotal - total, total };
}

function pintarCarrito() {
  const items = carrito.lista();
  const lista = $("#listaCarrito");

  lista.innerHTML = items.length === 0
    ? `<li class="list-group-item carrito-vacio">Tu carrito está vacío.<br>¡Agrega algo rico!</li>`
    : items.map((it) => `
      <li class="list-group-item">
        <img class="mini" src="${foto(it.img, 120)}" alt="">
        <div class="item-info">
          <strong>${it.nombre}</strong>
          <small>${soles(it.precio)} c/u · ${soles(it.precio * it.cantidad)}</small>
        </div>
        <div class="cantidad">
          <button type="button" data-menos="${it.id}" aria-label="Quitar uno de ${it.nombre}">−</button>
          <span>${it.cantidad}</span>
          <button type="button" data-mas="${it.id}" aria-label="Agregar uno de ${it.nombre}">+</button>
        </div>
        <button type="button" class="btn-close" data-quitar="${it.id}" aria-label="Eliminar ${it.nombre}"></button>
      </li>`).join("");

  const { subtotal, conDescuento, descuento, total } = calcularTotales();
  $("#subtotal").textContent = soles(subtotal);
  $("#descuento").textContent = `− ${soles(descuento)}`;
  $("#filaDescuento").hidden = !conDescuento;
  $("#total").textContent = soles(total);
  $("#barraProgreso").style.width = `${Math.min(100, (subtotal / MINIMO_DESCUENTO) * 100)}%`;
  $("#mensajeDescuento").textContent = !items.length
    ? `Compras mayores a ${soles(MINIMO_DESCUENTO)} tienen 10 % de descuento.`
    : conDescuento
      ? "¡Listo! Se aplicó tu 10 % de descuento."
      : `Te faltan ${soles(MINIMO_DESCUENTO - subtotal + 0.01)} para el 10 % de descuento.`;

  const contador = $("#contador");
  contador.textContent = carrito.unidades();       // recursivo
  contador.classList.remove("rebote");
  void contador.offsetWidth;                        // reinicia la animación
  contador.classList.add("rebote");

  $("#finalizar").disabled = items.length === 0;
  $("#vaciar").disabled = items.length === 0;
}

$("#listaCarrito").addEventListener("click", (e) => {
  const mas = e.target.closest("[data-mas]");
  const menos = e.target.closest("[data-menos]");
  const quitar = e.target.closest("[data-quitar]");
  if (mas) carrito.cambiar(Number(mas.dataset.mas), 1);
  if (menos) carrito.cambiar(Number(menos.dataset.menos), -1);
  if (quitar) carrito.quitar(Number(quitar.dataset.quitar));
  if (mas || menos || quitar) pintarCarrito();
});

$("#vaciar").addEventListener("click", () => {
  carrito.vaciar();
  pintarCarrito();
  avisar("Carrito vacío.");
});

// Finalizar: cierra el carrito y abre el Dialog con el resumen
$("#finalizar").addEventListener("click", async () => {
  const items = carrito.lista();
  if (!items.length) return;
  const { conDescuento, descuento, total } = calcularTotales();
  $("#resumenConfirmar").innerHTML =
    items.map((it) => `<li class="list-group-item fila"><span>${it.cantidad} × ${it.nombre}</span><span>${soles(it.precio * it.cantidad)}</span></li>`).join("") +
    (conDescuento ? `<li class="list-group-item fila descuento"><span>Descuento 10 %</span><span>− ${soles(descuento)}</span></li>` : "");
  $("#totalConfirmar").textContent = soles(total);
  await Drawer.getOrCreateInstance($("#carrito")).hide();   // en v6, hide() devuelve una promesa
  Dialog.getOrCreateInstance($("#confirmar")).show();
});

$("#btnConfirmar").addEventListener("click", () => {
  const { total } = calcularTotales();
  const unidades = carrito.unidades();
  carrito.vaciar();
  pintarCarrito();
  Dialog.getOrCreateInstance($("#confirmar")).hide();
  avisar(`Pedido confirmado: ${unidades} ${unidades === 1 ? "producto" : "productos"} por ${soles(total)}. ¡Gracias!`);
});

/* ============================================================
   6. Torta personalizada: Form + Alert
   ============================================================ */
const hoyMas = (dias = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
};
$("#fecha").min = hoyMas(2);                       // mínimo 48 horas de anticipación

$("#formPedido").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  form.classList.add("validado");

  if (!form.checkValidity()) {
    $("#alertaPedido").innerHTML = `<div class="alert theme-danger" role="alert">Revisa los campos marcados: nombre (mín. 3 letras), celular de 9 dígitos que empiece en 9, sabor, tamaño y fecha (desde ${hoyMas(2).split("-").reverse().join("/")}).</div>`;
    form.querySelector(":invalid")?.focus();
    return;
  }

  const datos = Object.fromEntries(new FormData(form));
  const fecha = datos.fecha.split("-").reverse().join("/");
  $("#alertaPedido").innerHTML = `<div class="alert theme-success" role="alert"><strong>¡Gracias, ${datos.nombre.split(" ")[0]}!</strong> Recibimos tu pedido de torta de ${datos.sabor.toLowerCase()} (${datos.porciones} porciones) para el ${fecha}. Te escribiremos al ${datos.celular}.</div>`;
  avisar("Pedido especial enviado.");
  form.reset();
  form.classList.remove("validado");
});

/* ============================================================
   7. Menú del celular, modo oscuro y reflejo del vidrio
   ============================================================ */
document.querySelectorAll("[data-cerrar-menu]").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    const menu = $("#menu");
    if (menu.open) Drawer.getOrCreateInstance(menu).hide();
  });
});

const aplicarTema = (tema = "light") => {
  document.documentElement.setAttribute("data-bs-theme", tema);
  $('meta[name="theme-color"]').content = tema === "dark" ? "#0e0b10" : "#fbf3f0";
  $("#btnTema").setAttribute("aria-label", tema === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
};
const temaGuardado = localStorage.getItem(CLAVE_TEMA)
  ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
aplicarTema(temaGuardado);

$("#btnTema").addEventListener("click", () => {
  const nuevo = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
  localStorage.setItem(CLAVE_TEMA, nuevo);
  aplicarTema(nuevo);
});

// El brillo del vidrio sigue al puntero (efecto Liquid Glass)
document.addEventListener("pointermove", (e) => {
  const panel = e.target.closest?.(".vidrio");
  if (!panel) return;
  const r = panel.getBoundingClientRect();
  panel.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
  panel.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
}, { passive: true });

/* ============================================================
   8. Inicio
   ============================================================ */
$("#anio").textContent = new Date().getFullYear();
pintarFiltros();
pintarProductos();
pintarCarrito();
