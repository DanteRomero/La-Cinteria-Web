const params = new URLSearchParams(window.location.search);
const pasoSeleccionado = params.get("paso");

fetch("data/productos.json")
.then(r => r.json())
.then(productos => {

    const filtrados = productos.filter(p => p.paso == pasoSeleccionado);

    document.getElementById("tituloGrupo").innerText =
    "Cintos paso " + pasoSeleccionado + " cm";

    const cont = document.getElementById("productos");

    filtrados.forEach(p => {
    cont.innerHTML += `
        <div class="product-card">
        <img src="${p.imagen}">
        <p>${p.nombre}</p>
        <p>$${p.precio}</p>
        </div>
    `;
    });

});