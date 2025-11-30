/* =========================================
   ARCHIVO: js/miScript.js
   CONTENIDO: Completo y Corregido
   ========================================= */

// --- CONSTANTES Y DATOS MOCK ---

//constante con los productos que tenemos localmente
const PRODUCTOS = [
  { id: 1, name: "Consola PS4 Death Stranding", category: "consolas", price: 4200.00, desc: "Consola playstation 4 edicion especial death stranding", image: "./images/dsps4.png" },
  { id: 2, name: "Si el amor es una isla", category: "libros", price: 350.50, desc: "Edición de tapa dura con ilustraciones.", image: "./images/amorisla.jpg" },
  { id: 3, name: "Kit de Inicio para Amigurumis", category: "crochet", price: 349.99, desc: "Incluye 5 colores de lana, agujas y patrón.", image: "./images/kitcrochet.jpg" },
  { id: 4, name: "Figura Coleccionable: Higgs Monaghan", category: "coleccionables", price: 7345.00, desc: "Edición limitada de Higgs Monaghan.", image: "./images/higgsfigure.png" },
  { id: 5, name: "Controlador Inalámbrico 2077", category: "videojuegos", price: 2499.90, desc: "Diseño ergonómico para largas sesiones de juego.", image: "./images/cyberpunkcontrol.jpg" }, 
  { id: 6, name: "Tejer sin Límites: Patrones Modernos", category: "libros", price: 220.00, desc: "Libro de patrones de nivel intermedio.", image: "./images/librocrochet.png" },
  { id: 7, name: "Mochis sabor taro", category: "snacks", price: 50.50, desc: "Un bocado exotico y dulce para tus tardes de peliculas.", image: "./images/mochis.jpg" },
  { id: 8, name: "Libros de harry potter", category: "libros", price: 50.50, desc: "La serie completa de los libros de esta magica aventura", image: "./images/PotterBooks.jpg" },
  { id: 9, name: "Funko pop de Takemura", category: "coleccionables", price: 50.50, desc: "Figura coleccionable del personaje Takemura.", image: "./images/takemurafunko.png" },
  { id: 10, name: "Pockys cookies and cream", category: "snacks", price: 50.50, desc: "Dulces bocadillos de galleta cubiertos de cookies and cream.", image: "./images/PockyCC.png" },
  { id: 11, name: "Buldak carbonara", category: "snacks", price: 50.50, desc: "Ramen delicioso y picante sabor carbonara.", image: "./images/carbonara.jpg" },
  { id: 12, name: "Xenomorph doll", category: "coleccionables", price: 700.00, desc: "Monster high skullector alien.", image: "./images/alienmh.png" },
  { id: 13, name: "Consola SNES Classic Edition", category: "consolas", price: 1200.00, desc: "Mini-consola con 21 juegos clásicos preinstalados.", image: "./images/snes.png" },
  { id: 14, name: "Lana Merino Extra Suave (Rojo)", category: "crochet", price: 150.00, desc: "Madeja de lana merino de 100g, ideal para proyectos delicados.", image: "./images/lana.png" },
  { id: 15, name: "El Señor de los Anillos: La Comunidad del Anillo", category: "libros", price: 499.00, desc: "Primera parte de la épica saga de J.R.R. Tolkien.", image: "./images/lotr.png" },
  { id: 16, name: "Peluche Coleccionable de Pikachu", category: "coleccionables", price: 650.00, desc: "Peluche grande y suave de la mascota icónica de Pokémon.", image: "./images/pikachu.png" },
  { id: 17, name: "Barrita de Matcha y Arroz Inflado", category: "snacks", price: 35.00, desc: "Snack energético japonés con té matcha.", image: "./images/matcha_bar.png"}
];

const RAWG_API_KEY = "440d1bf1d0fc4b8ab796d650dce689bb"; 
//placeholder para juegos sin imagen
const PLACEHOLDER_IMAGE = "https://placehold.co/300x180?text=No+Image";

// CARGAR DATOS
let USUARIOS_REGISTRADOS = JSON.parse(localStorage.getItem('registeredUsers')) || [];
let CARRITO = JSON.parse(localStorage.getItem('myCart')) || [];


// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI(); 

    const path = window.location.pathname;

    // --- INDEX ---
    if (path.includes('index.html') || path.endsWith('/')) {
        fetchRAWGProducts().then(() => renderFeaturedProducts());
    }

    // --- CATALOGO ---
    if (path.includes('catalogo.html')) {
        fetchRAWGProducts().then(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            const catFilter = urlParams.get('cat');

            if (productId) {
                renderProductDetail(productId);
            } else {
                const cView = document.getElementById('catalogo-view');
                if(cView) cView.classList.remove('d-none');
                
                if(catFilter) {
                    const sel = document.getElementById('filter-category');
                    if(sel) sel.value = catFilter;
                }
                applyFilters();
            }
        });
    }

    // --- CARRITO ---
    if (path.includes('carrito.html')) {
        renderCartPage();
    }

    // --- LOGIN ---
    //detectar el formulario de login y registro
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        const regForm = document.getElementById('register-form');
        if(regForm) regForm.addEventListener('submit', handleRegister);
        
        // Botones para alternar entre login y registro
        document.getElementById('show-register-btn').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-form-container').classList.add('d-none');
            document.getElementById('register-form-container').classList.remove('d-none');
            clearSystemMessage();
        });
        document.getElementById('show-login-btn').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('register-form-container').classList.add('d-none');
            document.getElementById('login-form-container').classList.remove('d-none');
            clearSystemMessage();
        });
    }

    // --- PERFIL ---
    // Redirigir a login si no está autenticado
    if (path.includes('perfil.html')) {
        if (localStorage.getItem('isLoggedIn') !== 'true') window.location.href = 'login.html';
    }
    
    // --- LOGOUT MODAL LISTENER ---
    // Confirmar cierre de sesión
    const btnConfirmLogout = document.getElementById("confirm-logout");
    if (btnConfirmLogout) {
        btnConfirmLogout.addEventListener("click", () => {
            handleLogout();
        });
    }
});


// =========================================
//  LÓGICA DEL CARRITO
// =========================================

// Agregar producto al carrito
function addToCart(id) {
    const prod = PRODUCTOS.find(p => String(p.id) === String(id));
    if (!prod) return;

    // Verificar si ya existe
    const existe = CARRITO.find(item => String(item.id) === String(id));
    
    if (existe) {
        // NO SUMAMOS CANTIDAD, SOLO AVISAMOS
        showAuthMessage(`¡"${prod.name}" ya está en tu carrito!`, 'warning');
        setTimeout(() => clearSystemMessage(), 2000);
    } else {
        // AGREGAR PRODUCTO (Cantidad fija: 1)
        CARRITO.push({ ...prod, qty: 1 });
        localStorage.setItem('myCart', JSON.stringify(CARRITO));
        
        // Mensaje de éxito
        const feedback = document.getElementById('cart-feedback');
        if(feedback) {
            // Mensaje específico en la página de detalles
            feedback.textContent = `¡"${prod.name}" añadido!`;
            feedback.classList.remove('d-none');
            setTimeout(() => feedback.classList.add('d-none'), 2000);
        } else {
            // Mensaje global si no hay feedback específico
            showAuthMessage(`Agregado: ${prod.name}`, 'success');
            setTimeout(() => clearSystemMessage(), 1500);
        }
    }
}

// Renderizar la página del carrito 
function renderCartPage() {
    const emptyView = document.getElementById('cart-empty-view');
    const itemsView = document.getElementById('cart-items-view');
    const tbody = document.getElementById('cart-table-body');
    
    // Si el carrito está vacío
    if (CARRITO.length === 0) {
        emptyView.classList.remove('d-none');
        itemsView.classList.add('d-none');
        return;
    }

    // Si hay items en el carrito
    emptyView.classList.add('d-none');
    itemsView.classList.remove('d-none');
    tbody.innerHTML = '';
    
    let totalGlobal = 0;

    // Recorrer los items del carrito
    CARRITO.forEach(item => {
        const precio = item.price; 
        totalGlobal += precio;

        // Agregar fila a la tabla
        tbody.innerHTML += `
            <tr>
                <td class="ps-4">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" class="rounded me-3" style="width: 50px; height: 50px; object-fit: cover;">
                        <div>
                            <p class="mb-0 fw-bold text-dark text-truncate" style="max-width: 250px;">${item.name}</p>
                            <small class="text-muted">${item.category}</small>
                        </div>
                    </div>
                </td>
                <td class="fw-bold">$${precio.toFixed(2)}</td>
                <td class="pe-4 text-end">
                    <button class="btn btn-link text-danger p-0" onclick="removeFromCart('${item.id}')">
                        <i class="bi bi-trash-fill fs-5"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    // Actualizar totales
    document.getElementById('cart-subtotal').textContent = `$${totalGlobal.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${totalGlobal.toFixed(2)}`;
}

// Eliminar producto del carrito
function removeFromCart(id) {
    CARRITO = CARRITO.filter(i => String(i.id) !== String(id));
    localStorage.setItem('myCart', JSON.stringify(CARRITO));
    renderCartPage();
}

// Finalizar compra
function checkout() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        // Usuario no autenticado
        showAuthMessage('Debes iniciar sesión para finalizar.', 'warning');
        setTimeout(() => window.location.href = 'login.html', 2000);
        return;
    }
    // Compra exitosa
    showAuthMessage('¡Compra realizada con éxito! Gracias.', 'success');
    CARRITO = [];
    localStorage.removeItem('myCart');
    setTimeout(() => window.location.href = 'index.html', 2000);
}


// =========================================
//  AUTH HELPERS 
// =========================================

// Mostrar mensajes de autenticación
function showAuthMessage(mensaje, tipo) {
    const msgDiv = document.getElementById('system-message');
    if (msgDiv) {
        msgDiv.textContent = mensaje;
        msgDiv.className = `alert alert-${tipo} mb-3 shadow-sm fixed-top end-0 mt-5 me-4 p-3`; 
        msgDiv.classList.remove('d-none');
    }
}
// Limpiar mensaje del sistema
function clearSystemMessage() {
    const msgDiv = document.getElementById('system-message');
    if (msgDiv) msgDiv.classList.add('d-none');
}

// Manejar login
function handleLogin(e) {
    // Prevenir envío del formulario
    e.preventDefault();
    // Obtener credenciales
    const email = document.getElementById('login-username').value;
    const pass = document.getElementById('login-password').value;
    const user = USUARIOS_REGISTRADOS.find(u => u.email === email && u.password === pass);

    // Si el usuario existe
    if (user) {
        // Guardar estado en localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        // Mensaje de bienvenida
        showAuthMessage(`Hola de nuevo, ${user.name}! Redirigiendo...`, 'success');
        // Redirigir después de 1.5 segundos
        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    } else {
        // Credenciales incorrectas
        showAuthMessage('Correo o contraseña incorrectos.', 'danger');
    }
}

function handleRegister(e) {
    // Prevenir envío del formulario
    e.preventDefault();
    // Obtener datos del formulario
    const email = document.getElementById('register-username').value;
    const pass = document.getElementById('register-password').value;
    // Verificar si el email ya está registrado
    if (USUARIOS_REGISTRADOS.find(u => u.email === email)) {
        showAuthMessage('Email ya registrado.', 'warning');
        return;
    }
    // Registrar nuevo usuario
    const nombre = email.split('@')[0]; // Nombre por defecto
    USUARIOS_REGISTRADOS.push({ email, password: pass, name: nombre }); // Agregar usuario
    localStorage.setItem('registeredUsers', JSON.stringify(USUARIOS_REGISTRADOS)); // Guardar en localStorage
    // Mensaje de éxito y redirigir a login
    showAuthMessage('¡Registrado!', 'success');
    document.getElementById('register-form').reset();
    setTimeout(() => {
        // Volver al formulario de login
        document.getElementById('register-form-container').classList.add('d-none');
        document.getElementById('login-form-container').classList.remove('d-none');
        clearSystemMessage();
    }, 2000); // Esperar 2 segundos antes de cambiar
}

// Manejar logout
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');// Limpiar estado de autenticación con los datos 
    window.location.href = 'index.html'; // Redirigir al inicio
}

function updateAuthUI() { // Actualizar la UI según el estado de autenticación para mostrar o ocultar lo de perfil
    const isLog = localStorage.getItem('isLoggedIn') === 'true';
    const name = localStorage.getItem('userName') || 'Invitado';
    const loggedInDiv = document.getElementById('auth-links-logged-in');
    const loggedOutDiv = document.getElementById('auth-links-logged-out');
    const navPerfil = document.getElementById('nav-perfil');

    if(loggedInDiv) {
        if(isLog) {
            // Si el usuario esta logueado muestrar saludo y opciones de perfil
            loggedInDiv.classList.remove('d-none');
            if(loggedOutDiv) loggedOutDiv.classList.add('d-none');
            const greeting = document.getElementById('user-greeting');
            if(greeting) greeting.textContent = `Hola, ${name}`;
            if(navPerfil) navPerfil.classList.remove('d-none');
        } else {
            // Si no esta logueado mostrar opciones de login/registro
            loggedInDiv.classList.add('d-none');
            if(loggedOutDiv) loggedOutDiv.classList.remove('d-none');
            if(navPerfil) navPerfil.classList.add('d-none');
        }
    }
}


// =========================================
//  CATALOGO Y PRODUCTOS
// =========================================

// Obtener productos desde la API RAWG
async function fetchRAWGProducts() {
    if (PRODUCTOS.length > 20) return;

    const URL = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=8&ordering=-released`;

    try {
        const res = await fetch(URL);
        const data = await res.json();

        // Estas son nuestras imagenes locales para algunos juegos (los que no fueron encontrados bien por la API)
        const misImagenes = {
            "Play Drift Boss game online": "./images/driftboss.png",
            "White Heaven":   "./images/whiteheaven.jpg",
            "TianXia":        "./images/tianxia.jpg",
            "The Drowning":   "./images/drowning.jpg",
            "Stalin vs. Martians 3": "./images/stalin.jpeg",
            "test test game": "./images/ttg.jpg"
        };

        // Mapear los juegos obtenidos a nuestro formato de producto
        const nuevos = data.results.map(game => ({
            id: `RAWG-${game.id}`,
            name: game.name,
            category: "videojuegos",
            price: 59.99,
            desc: `Lanzamiento: ${game.released}`,
            image: misImagenes[game.name] || game.background_image || PLACEHOLDER_IMAGE
        }));

        // Agregar los nuevos productos al array global
        PRODUCTOS.push(...nuevos);
    } catch (e) { console.error("Error API", e); }
}

function createProductCard(p) {
    // Crear la tarjeta HTML para los productos
    return `
      <div class="col">
        <div class="card h-100 shadow-sm border-0">
          <img src="${p.image}" class="card-img-top" style="height: 180px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <span class="small text-primary text-uppercase fw-semibold">${p.category}</span>
            <h5 class="card-title fw-bold text-dark text-truncate mt-1">${p.name}</h5>
            <p class="fs-4 fw-extrabold text-success mt-2">$${p.price.toFixed(2)}</p>
            <a href="catalogo.html?id=${p.id}" class="btn btn-primary btn-sm mt-auto fw-medium">Ver Detalles</a>
          </div>
        </div>
      </div>
    `;
}

// Renderizar productos destacados en el index (destacados para ti)
function renderFeaturedProducts() {
    const container = document.getElementById('featured-products-container');
    if (container) container.innerHTML = PRODUCTOS.slice(0, 4).map(createProductCard).join('');
}

// Aplicar filtros y ordenamientos en el catálogo (cuando quieras ordenar por categoria o orden)
function applyFilters() {
    const catSelect = document.getElementById('filter-category');
    const sortSelect = document.getElementById('filter-sort');
    const container = document.getElementById('products-container');
    
    // Validar elementos
    if(!catSelect || !container) return;
    const cat = catSelect.value;
    const sort = sortSelect.value;
    
    // Filtrar y ordenar productos
    let filtered = PRODUCTOS.filter(p => cat === 'todos' ? true : p.category === cat);
    if (sort === 'asc') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'desc') filtered.sort((a, b) => b.price - a.price);

    container.innerHTML = filtered.map(createProductCard).join('') || '<p class="text-center w-100 p-4">Sin resultados.</p>';
}


// Renderizar vista de detalle de producto
function renderProductDetail(id) {
    const p = PRODUCTOS.find(prod => String(prod.id) === String(id));
    // Si no se encuentra el producto, redirigir al catálogo
    if (!p) { window.location.href = 'catalogo.html'; return; }

    const catalogoView = document.getElementById('catalogo-view');
    const detalleView = document.getElementById('detalle-view');
    if(catalogoView) catalogoView.classList.add('d-none');
    if(detalleView) detalleView.classList.remove('d-none');


    // Rellenar detalles del producto con toda la informacion y sus datos
    document.getElementById('detalle-image').src = p.image;
    document.getElementById('detalle-title').textContent = p.name;
    document.getElementById('detalle-category').textContent = p.category;
    document.getElementById('detalle-price').textContent = `$${p.price.toFixed(2)}`;
    document.getElementById('detalle-description').textContent = p.desc;
    
    const apiInfoDiv = document.getElementById('detalle-api-info');
    if(apiInfoDiv) {
        if(String(p.id).startsWith('RAWG')) {
            apiInfoDiv.innerHTML = '<strong>Fuente:</strong> API Externa (RAWG). Precio estimado.';
        } else {
            apiInfoDiv.textContent = 'Producto original de The Happy Shelf. Envío inmediato.';
        }
    }
    
    // Configurar botón de agregar al carrito
    const btnCart = document.getElementById('add-to-cart');
    const newBtn = btnCart.cloneNode(true); 
    btnCart.parentNode.replaceChild(newBtn, btnCart);
    newBtn.addEventListener('click', () => addToCart(p.id));
}

// Cerrar vista de detalle y volver al catálogo
function closeDetailView() {
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);
    document.getElementById('detalle-view').classList.add('d-none');
    document.getElementById('catalogo-view').classList.remove('d-none');
    applyFilters(); 
}