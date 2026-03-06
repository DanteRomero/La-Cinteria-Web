
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚠️  REEMPLAZÁ este número con el tuyo real
// Formato: código país + código área + número (sin +, sin 0, sin 15)
// Ejemplo Argentina: 5491112345678
const NUMERO_WHATSAPP = "5491100000000";
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Estado global
let productos = [];
let productoActivo = null;
let colorSeleccionado = "";
let fotoIndex = 0;
let talle = "";
let hebilla = "";
// Leer paso desde URL
const grupo = document.body.dataset.grupo;
const pasoNum = parseFloat(document.body.dataset.grupo);
const slides = document.getElementById("slides");
const dots = document.getElementById("dots");
// ── Cargar productos ──────────────────────────────
fetch("../data/productos.json")
.then(res => res.json())
.then(data => {

    productos = data.productos.filter(p => parseFloat(p.grupo) === pasoNum);

    if(productos.length === 0) return;

    productoActivo = productos[0];

    colorSeleccionado = productoActivo.colores[0].nombre;

    actualizarUI();

});

// ── Actualizar UI según estado ─────────────────────
function actualizarUI() {
    const colores = productoActivo.colores;

    // TEXTO PRODUCTO 
    document.getElementById("prodNombre").textContent = productoActivo.nombre;
    document.getElementById("precioProducto").innerHTML = "<strong>Precio:</strong> $" + productoActivo.precio;
    document.getElementById("prodAncho").textContent = productoActivo.paso + " cm";
    

    // IMAGEN
    slides.innerHTML = `
    <img src="${productoActivo.fotos[colorSeleccionado][0]}" class="slide active">
    `;

    // DOTS (uno por color)
    dots.innerHTML = colores.map(c => `
    <span 
        class="dot ${c.nombre === colorSeleccionado ? 'activo' : ''}"
        style="background:${c.hex}"
        onclick="cambiarColor('${c.nombre}')"
    ></span>
    `).join("");
}
// ── Acciones carrusel ──────────────────────────────
function anteriorFoto() {
    const total = (productoActivo?.fotos[colorSeleccionado] || []).length;
    fotoIndex = (fotoIndex - 1 + total) % total;
    actualizarUI();
}
function siguienteFoto() {
    const total = (productoActivo?.fotos[colorSeleccionado] || []).length;
    fotoIndex = (fotoIndex + 1) % total;
    actualizarUI();
}
function setFoto(i) {
    fotoIndex = i;
    actualizarUI();
}
// ── Cambiar color ──────────────────────────────────
function cambiarColor(color){
  colorSeleccionado = color;
  actualizarUI();
}
// ── Cambiar producto ───────────────────────────────
function cambiarProducto(grupo) {
    productoActivo = productos.find(p => p.grupo === grupo);
    colorSeleccionado = productoActivo.colores[0].nombre;
    hebilla = "";
    fotoIndex = 0;
    renderPagina();
}
// ── Modal ──────────────────────────────────────────
function abrirModal() {
    // Validar talle y hebilla antes de abrir
    const errT = document.getElementById("err_talle");
    const errH = document.getElementById("err_hebilla");
    let ok = true;
    if (!talle) {
    if (errT) errT.textContent = "Ingresá tu talle";
    ok = false;
    } else {
    if (errT) errT.textContent = "";
    }
    if (!hebilla) {
    if (errH) errH.textContent = "Seleccioná la hebilla";
    ok = false;
    } else {
    if (errH) errH.textContent = "";
    }
    if (!ok) return;
    // Resumen
    document.getElementById("pedidoResumen").innerHTML = `
    <p><strong>Tu pedido:</strong></p>
    <p>${productoActivo.nombre} • ${pasoNum} cm • ${colorSeleccionado} • Hebilla ${hebilla} • Talle ${talle} cm</p>
    <p class="resumen-precio">$${productoActivo.precio.toLocaleString("es-AR")}</p>
    `;
    document.getElementById("modal").style.display = "flex";
    document.body.style.overflow = "hidden";
}
document.getElementById("cerrarModal").onclick = () => {
    document.getElementById("modal").style.display = "none";
    document.body.style.overflow = "";
};
document.getElementById("modal").addEventListener("click", function(e) {
    if (e.target === this) {
    this.style.display = "none";
    document.body.style.overflow = "";
    }
});

// ── Validar y enviar WhatsApp ──────────────────────
document.getElementById("btnEnviar").onclick = () => {
    const campos = {
    nombre:   document.getElementById("f_nombre").value.trim(),
    dni:      document.getElementById("f_dni").value.trim(),
    telefono: document.getElementById("f_telefono").value.trim(),
    calle:    document.getElementById("f_calle").value.trim(),
    numero:   document.getElementById("f_numero").value.trim(),
    piso:     document.getElementById("f_piso").value.trim(),
    localidad:document.getElementById("f_localidad").value.trim(),
    provincia:document.getElementById("f_provincia").value.trim(),
    cp:       document.getElementById("f_cp").value.trim(),
    };
    let valido = true;
    const requeridos = ["nombre","dni","telefono","calle","numero","localidad","provincia","cp"];
    requeridos.forEach(k => {
    const err = document.getElementById(`err_${k}`);
    if (!campos[k]) {
        if (err) err.textContent = "Requerido";
        valido = false;
    } else {
        if (err) err.textContent = "";
    }
    });
    const avisoTA = document.getElementById("avisoTalleHebilla");
    if (!talle || !hebilla) {
    avisoTA.style.display = "block";
    valido = false;
    } else {
    avisoTA.style.display = "none";
    }
    if (!valido) return;
    const msg = encodeURIComponent(
    `🛍️ *NUEVO PEDIDO - La Cintería*\n\n` +
    `*Cinto:* ${productoActivo.nombre} paso ${productoActivo.paso} cm\n` +
    `*Color:* ${colorSeleccionado}\n` +
    `*Precio:* $${productoActivo.precio.toLocaleString("es-AR")}\n` +
    `*Ancho:* ${productoActivo.paso} cm\n` +
    `*Talle:* ${talle} cm\n` +
    `*Hebilla:* ${hebilla}\n\n` +
    `📦 *Datos de envío (Correo Argentino):*\n` +
    `*Nombre:* ${campos.nombre}\n` +
    `*DNI:* ${campos.dni}\n` +
    `*Teléfono:* ${campos.telefono}\n` +
    `*Dirección:* ${campos.calle} ${campos.numero}${campos.piso ? ` Piso/Depto: ${campos.piso}` : ""}\n` +
    `*Localidad:* ${campos.localidad}\n` +
    `*Provincia:* ${campos.provincia}\n` +
    `*Código Postal:* ${campos.cp}`
    );
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msg}`, "_blank");
};