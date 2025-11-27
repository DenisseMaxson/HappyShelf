// --- CONSTANTES Y DATOS MOCK ---

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
const PLACEHOLDER_IMAGE = "https://placehold.co/300x180?text=No+Image";

// Cargar usuarios de localStorage o iniciar vacío
let USUARIOS_REGISTRADOS = JSON.parse(localStorage.getItem('registeredUsers')) || [];


// --- INICIALIZACIÓN Y DETECCIÓN DE PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI(); 

    const path = window.location.pathname;

    // --- LÓGICA PARA INDEX.HTML (INICIO) ---
    if (path.includes('index.html') || path.endsWith('/')) {
        // Cargar productos externos solo para tener variedad
        fetchRAWGProducts().then(() => renderFeaturedProducts());
    }

    // --- LÓGICA PARA CATALOGO.HTML ---
    if (path.includes('catalogo.html')) {
        fetchRAWGProducts().then(() => {
            // Revisar parámetros URL (ej: catalogo.html?id=1)
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            const catFilter = urlParams.get('cat');

            if (productId) {
                // Si hay ID en la URL, mostrar vista detalle
                renderProductDetail(productId);
            } else {
                // Si no, mostrar vista grilla normal
                const catalogoView = document.getElementById('catalogo-view');
                const detalleView = document.getElementById('detalle-view');
                
                if(catalogoView) catalogoView.classList.remove('d-none');
                if(detalleView) detalleView.classList.add('d-none');
                
                // Si viene del carrusel con filtro
                if(catFilter) {
                    const select = document.getElementById('filter-category');
                    if(select) { select.value = catFilter; }
                }
                applyFilters();
            }
        });
    }

    // --- LÓGICA PARA LOGIN.HTML ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // Escuchar envío del Login
        loginForm.addEventListener('submit', handleLogin);
        
        // Escuchar envío del Registro
        const registerForm = document.getElementById('register-form');
        if(registerForm) registerForm.addEventListener('submit', handleRegister);
        
        // Alternar entre Login y Registro
        document.getElementById('show-register-btn').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-form-container').classList.add('d-none');
            document.getElementById('register-form-container').classList.remove('d-none');
            clearSystemMessage(); // Limpiar mensajes viejos
        });
        
        document.getElementById('show-login-btn').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('register-form-container').classList.add('d-none');
            document.getElementById('login-form-container').classList.remove('d-none');
            clearSystemMessage();
        });
    }

    // --- LÓGICA PARA PERFIL.HTML ---
    if (path.includes('perfil.html')) {
        // Redirección de seguridad si no está logueado
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
        }
    }
});

//  FUNCIONES DE AUTENTICACIÓN 

function showAuthMessage(mensaje, tipo) {
    const msgDiv = document.getElementById('system-message');
    if (msgDiv) {
        msgDiv.textContent = mensaje;
        // Tipos: 'success' (verde), 'danger' (rojo), 'warning' (amarillo)
        msgDiv.className = `alert alert-${tipo} mb-3 shadow-sm`; 
        msgDiv.classList.remove('d-none');
    }
}

// Helper para limpiar mensaje
function clearSystemMessage() {
    const msgDiv = document.getElementById('system-message');
    if (msgDiv) msgDiv.classList.add('d-none');
}

// 1. Manejar LOGIN
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-username').value;
    const pass = document.getElementById('login-password').value;
    
    // Buscar usuario
    const user = USUARIOS_REGISTRADOS.find(u => u.email === email && u.password === pass);

    if (user) {
        // Guardar sesión
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        
        // Mensaje Verde
        showAuthMessage(`¡Hola de nuevo, ${user.name}! Redirigiendo...`, 'success');
        
        // Esperar 1.5s y redirigir al Home
        setTimeout(() => {
            window.location.href = 'index.html'; 
        }, 1500);

    } else {
        // Mensaje Rojo
        showAuthMessage('Correo o contraseña incorrectos.', 'danger');
    }
}

// 2. Manejar REGISTRO
function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('register-username').value;
    const pass = document.getElementById('register-password').value;
    
    // Validar si ya existe
    const existe = USUARIOS_REGISTRADOS.find(u => u.email === email);
    
    if (existe) {
        showAuthMessage('Este correo ya está registrado. Intenta iniciar sesión.', 'warning');
        return;
    }

    // Crear y guardar
    const nombre = email.split('@')[0];
    USUARIOS_REGISTRADOS.push({ email, password: pass, name: nombre });
    localStorage.setItem('registeredUsers', JSON.stringify(USUARIOS_REGISTRADOS));
    
    // Mensaje Verde
    showAuthMessage('¡Cuenta creada con éxito! Ahora inicia sesión.', 'success');
    
    // Resetear form y volver al login automáticamente tras 2 segundos
    document.getElementById('register-form').reset();
    setTimeout(() => {
        document.getElementById('register-form-container').classList.add('d-none');
        document.getElementById('login-form-container').classList.remove('d-none');
        clearSystemMessage(); // Limpiar el mensaje de éxito para que el login se vea limpio
    }, 2000);
}

// 3. Manejar LOGOUT
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html'; // Volver al inicio
}

// 4. Actualizar Interfaz según estado
function updateAuthUI() {
    const isLog = localStorage.getItem('isLoggedIn') === 'true';
    const name = localStorage.getItem('userName') || 'Invitado';
    
    const loggedInDiv = document.getElementById('auth-links-logged-in');
    const loggedOutDiv = document.getElementById('auth-links-logged-out');
    const navPerfil = document.getElementById('nav-perfil');

    if(loggedInDiv) {
        if(isLog) {
            loggedInDiv.classList.remove('d-none');
            if(loggedOutDiv) loggedOutDiv.classList.add('d-none');
            const greeting = document.getElementById('user-greeting');
            if(greeting) greeting.textContent = `Hola, ${name}`;
            if(navPerfil) navPerfil.classList.remove('d-none');
        } else {
            loggedInDiv.classList.add('d-none');
            if(loggedOutDiv) loggedOutDiv.classList.remove('d-none');
            if(navPerfil) navPerfil.classList.add('d-none');
        }
    }
}

//  FUNCIONES DE PRODUCTOS Y CATALOGO

async function fetchRAWGProducts() {
    if (PRODUCTOS.length > 10) return; 

    const URL = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=8&ordering=-released`;
    try {
        const res = await fetch(URL);
        const data = await res.json();
        const nuevos = data.results.map(game => ({
            id: `RAWG-${game.id}`,
            name: game.name,
            category: "videojuegos",
            price: 59.99, // Precio simulado
            desc: `Lanzamiento: ${game.released}. Rating: ${game.rating}/5`,
            image: game.background_image || PLACEHOLDER_IMAGE
        }));
        PRODUCTOS.push(...nuevos);
    } catch (e) { console.error("Error API", e); }
}

function createProductCard(p) {
    // Genera tarjeta que enlaza a catalogo.html con ID
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

function renderFeaturedProducts() {
    const container = document.getElementById('featured-products-container');
    if (container) {
        container.innerHTML = PRODUCTOS.slice(0, 4).map(createProductCard).join('');
    }
}

function applyFilters() {
    const catSelect = document.getElementById('filter-category');
    const sortSelect = document.getElementById('filter-sort');
    const container = document.getElementById('products-container');
    
    if(!catSelect || !container) return;

    const cat = catSelect.value;
    const sort = sortSelect.value;
    
    let filtered = PRODUCTOS.filter(p => cat === 'todos' ? true : p.category === cat);
    
    if (sort === 'asc') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'desc') filtered.sort((a, b) => b.price - a.price);

    container.innerHTML = filtered.map(createProductCard).join('') || '<p class="text-center p-4 w-100">No hay productos con este filtro.</p>';
}

function renderProductDetail(id) {
    const p = PRODUCTOS.find(prod => String(prod.id) === String(id));
    
    if (!p) {
        window.location.href = 'catalogo.html'; 
        return;
    }

    const catalogoView = document.getElementById('catalogo-view');
    const detalleView = document.getElementById('detalle-view');
    if(catalogoView) catalogoView.classList.add('d-none');
    if(detalleView) detalleView.classList.remove('d-none');

    document.getElementById('detalle-image').src = p.image;
    document.getElementById('detalle-title').textContent = p.name;
    document.getElementById('detalle-category').textContent = p.category;
    document.getElementById('detalle-price').textContent = `$${p.price.toFixed(2)}`;
    document.getElementById('detalle-description').textContent = p.desc;
    
    const apiInfoDiv = document.getElementById('detalle-api-info');
    if(String(p.id).startsWith('RAWG')) {
        apiInfoDiv.innerHTML = '<strong>Fuente:</strong> API Externa (RAWG). Precio estimado.';
    } else {
        apiInfoDiv.textContent = 'Producto original de The Happy Shelf. Envío inmediato.';
    }
    
    const btnCart = document.getElementById('add-to-cart');
    const newBtn = btnCart.cloneNode(true);
    btnCart.parentNode.replaceChild(newBtn, btnCart);
    
    newBtn.addEventListener('click', () => {
        const feedback = document.getElementById('cart-feedback');
        feedback.textContent = `¡"${p.name}" añadido al carrito!`;
        feedback.classList.remove('d-none');
        setTimeout(() => feedback.classList.add('d-none'), 3000);
    });
}

function closeDetailView() {
    // 1. Limpiar la URL sin recargar la página
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);
    document.getElementById('detalle-view').classList.add('d-none');
    document.getElementById('catalogo-view').classList.remove('d-none');
    applyFilters(); 
}