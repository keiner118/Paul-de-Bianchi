const productos = [
    { id: 1, nombre: "Camiseta Pro-Run", precio: 18990, desc: "Ropa deportiva de alta tecnología.", img: "img/camiseta.jpg" },
    { id: 2, nombre: "Camiseta Master Blue", precio: 15990, desc: "Ropa deportiva elasticada.", img: "img/camiseta2.jpg" },
    { id: 3, nombre: "Buzo SAMEX", precio: 44990, desc: "Buzo deportivo negro SAMEX", img: "img/buzo.jpg" },
    { id: 4, nombre: "Calzas de Compresión", precio: 25990, desc: "Soporte muscular avanzado.", img: "img/calzas.jpg" },
    { id: 5, nombre: "Zapatillas CRUSEC", precio: 49990, desc: "Zapatillas negras hombre deportivas CRUSEC.", img: "img/zapatillas.jpg" },
    { id: 6, nombre: "Zapatillas CRUSEC", precio: 49990, desc: "Zapatillas rosadas mujer deportivas CRUSEC.", img: "img/zapatillas2.jpg" },
    { id: 7, nombre: "Pesas circulares", precio: 34990, desc: "Equipo de entrenamiento profesional de 20 kg.", img: "img/pesas.jpg" },
    { id: 8, nombre: "Kit pesas", precio: 79990, desc: "Kit de 5 pesas de 5, 10, 15, 20 y 25 kgs", img: "img/kitpesas.jpg" },
    { id: 9, nombre: "Bolso Puma", precio: 39990, desc: "Bolso deportivo negro hombre", img: "img/bolso.jpg" },
    { id: 10, nombre: "Kit pesas", precio: 39990, desc: "Bolso deportivo rosado mujer", img: "img/bolso2.jpg" }
];

// Dibujar los productos en pantalla
const renderTienda = () => {
    const grid = document.getElementById("productos-grid");
    if (!grid) return;
    
    grid.innerHTML = productos.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <p>${p.desc}</p>
            <p><strong>$${p.precio}</strong></p>
            <button onclick="agregarAlCarrito(${p.id})" class="btn-primary">Agregar al carrito</button>
        </div>
    `).join("");
};

// Operaciones del Session Storage
const agregarAlCarrito = (id) => {
    const p = productos.find(x => x.id === id);
    let cart = JSON.parse(sessionStorage.getItem("sporty_cart")) || [];
    cart.push(p);
    sessionStorage.setItem("sporty_cart", JSON.stringify(cart));
    actualizarCarritoUI();
};

const eliminarDelCarrito = (index) => {
    let cart = JSON.parse(sessionStorage.getItem("sporty_cart")) || [];
    cart.splice(index, 1);
    sessionStorage.setItem("sporty_cart", JSON.stringify(cart));
    actualizarCarritoUI();
};

// Refrescar el resumen del carrito
const actualizarCarritoUI = () => {
    const cart = JSON.parse(sessionStorage.getItem("sporty_cart")) || [];
    const lista = document.getElementById("items-carrito");
    const totalElement = document.getElementById("total-compra");
    
    if (!lista || !totalElement) return;

    let total = 0;
    lista.innerHTML = cart.map((item, index) => {
        total += item.precio;
        return `<div class="cart-item">
            <span>${item.nombre} - $${item.precio}</span>
            <button onclick="eliminarDelCarrito(${index})" class="btn-danger">X</button>
        </div>`;
    }).join("");
    
    totalElement.textContent = `Total: $${total}`;
};

// Transiciones de interfaz
const btnIrPago = document.getElementById("ir-pago");
if (btnIrPago) {
    btnIrPago.onclick = () => {
        document.getElementById("pago-seccion").classList.toggle("hidden");
    };
}

// Validaciones de seguridad de formulario
const formPago = document.getElementById("form-pago");
if (formPago) {
    formPago.onsubmit = (e) => {
        e.preventDefault();
        
        const email = document.getElementById("correo").value;
        const fono = document.getElementById("telefono").value;

        // Expresiones regulares para control de formato
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const fonoValido = /^[0-9]{9}$/.test(fono);

        if (!emailValido) return alert("Email inválido. Debe contener @ y dominio.");
        if (!fonoValido) return alert("Teléfono inválido. Ingrese 9 dígitos numéricos.");

        // Ocultar tienda y mostrar confirmación
        document.getElementById("tienda").classList.add("hidden");
        document.getElementById("carrito-seccion").classList.add("hidden");
        document.getElementById("pago-seccion").classList.add("hidden");
        document.getElementById("confirmacion-seccion").classList.remove("hidden");
        
        sessionStorage.removeItem("sporty_cart");
    };
}

// Escuchador de carga
window.addEventListener("load", () => {
    renderTienda();
    actualizarCarritoUI();
});
