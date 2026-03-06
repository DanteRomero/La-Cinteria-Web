const grupo = document.body.dataset.grupo;
const NUMERO_WHATSAPP = "5491100000000";



fetch("../data/productos.json")
.then(response => response.json())
.then(data => {

    const producto = data.productos.find(p => p.grupo === grupo);
    if(!producto) return;

    // ===== PRECIO =====
    document.getElementById("precioProducto").textContent =
        "Precio: $" + producto.precio;

    document.getElementById("ancho").textContent =
        producto.ancho;

    // ===== SLIDER =====
    const slidesContainer = document.getElementById("slides");
    const dotsContainer = document.getElementById("dots");

    producto.colores.forEach((color, index) => {

        // imagen
        const img = document.createElement("img");
        img.src = color.imagen;
        img.classList.add("slide");

        if(index === 0){
            img.classList.add("active");
        }

        slidesContainer.appendChild(img);

        // circulito
        const dot = document.createElement("span");
        dot.classList.add("dot");
        dot.style.backgroundColor = color.color;

        dot.onclick = () => irSlide(index);

        dotsContainer.appendChild(dot);

    });

});

let currentSlide = 0;

function irSlide(n){

    const slides = document.querySelectorAll(".slide");

    slides.forEach(slide => slide.classList.remove("active"));

    slides[n].classList.add("active");

    currentSlide = n;
}