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

// Carga los usuarios guardados o crea uno por defecto para prueba
let USUARIOS_REGISTRADOS = loadUsersFromStorage();

// Variables de estado global
let isLoggedIn = false;
let currentUserName = 'Invitado';

// --- FUNCIONES DE AUTENTICACIÓN Y LOCALSTORAGE (SIMPLIFICADAS) ---

// Se simplifica para cargar solo lo que existe o un array vacío
function loadUsersFromStorage() {
    try {
        const users = JSON.parse(localStorage.getItem('registeredUsers'));
        return users && users.length > 0 ? users : []; // No hay usuario por defecto
    } catch (e) {
        console.error("Error cargando usuarios:", e);
        return [];
    }
}

function saveUsersToStorage() {
    localStorage.setItem('registeredUsers', JSON.stringify(USUARIOS_REGISTRADOS));
}

// Se simplifica: solo revisa si hay sesión activa y obtiene el nombre
function updateAuthUI() {
    isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    currentUserName = localStorage.getItem('userName') || 'Invitado';

    // Usar d-none para ocultar/mostrar elementos de Bootstrap
    document.getElementById('auth-links-logged-in').classList.toggle('d-none', !isLoggedIn);
    document.getElementById('auth-links-logged-out').classList.toggle('d-none', isLoggedIn);
    document.getElementById('nav-perfil').classList.toggle('d-none', !isLoggedIn);

    const greetingEl = document.getElementById('user-greeting');
    if (greetingEl) {
        greetingEl.textContent = `Hola, ${currentUserName}`;
    }
}

function handleLogin(e) {
    e.preventDefault();
    const emailInput = document.getElementById('login-username').value;
    const passwordInput = document.getElementById('login-password').value; 
    
    if (!emailInput || !passwordInput) {
        showSystemMessage('Por favor, ingresa tu email y contraseña.', true);
        return;
    }
    
    // Búsqueda simple por email y contraseña
    const user = USUARIOS_REGISTRADOS.find(u => u.email === emailInput && u.password === passwordInput);
    
    if (user) {
        // Login Exitoso
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        
        updateAuthUI();
        showSystemMessage(`¡Bienvenido de nuevo, ${user.name}!`, false);
        // Limpiar formulario
        document.getElementById('login-form').reset();
        window.location.hash = '#home';
    } else {
        // Login Fallido
        showSystemMessage('Credenciales inválidas. Verifica tu email y contraseña. ¿Te registraste?', true);
    }
}

function handleRegister(e) {
    e.preventDefault();
    const emailInput = document.getElementById('register-username').value;
    const passwordInput = document.getElementById('register-password').value; 
    const userName = emailInput.split('@')[0];

    if (!emailInput || !passwordInput) {
        showSystemMessage('Por favor, ingresa un email y una contraseña.', true);
        return;
    }

    if (USUARIOS_REGISTRADOS.find(u => u.email === emailInput)) {
        showSystemMessage('Ese email ya está registrado. Intenta iniciar sesión.', true);
        return;
    }

    // Agregar nuevo usuario y guardar
    const newUser = { email: emailInput, password: passwordInput, name: userName };
    USUARIOS_REGISTRADOS.push(newUser);
    saveUsersToStorage();
    
    // Limpiar formulario de registro
    document.getElementById('register-form').reset();
    
    // No hay inicio de sesión automático, se redirige al login
    showSystemMessage(`¡Registro exitoso para ${userName}! Ahora inicia sesión con tu nueva cuenta.`, false);
    document.getElementById('register-form-container').classList.add('d-none');
    document.getElementById('login-form-container').classList.remove('d-none'); // Mostrar login
}

function handleLogout() {
    // Eliminar todas las claves de sesión
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    updateAuthUI();
    showSystemMessage('Sesión cerrada. ¡Vuelve pronto!', false);
    window.location.hash = '#auth'; 
}

function showRegisterForm(e) {
    e.preventDefault();
    document.getElementById('login-form-container').classList.add('d-none');
    document.getElementById('register-form-container').classList.remove('d-none');
}

function showLoginForm(e) {
    e.preventDefault();
    document.getElementById('register-form-container').classList.add('d-none');
    document.getElementById('login-form-container').classList.remove('d-none');
}

// --- FUNCIONES DE UTILIDAD GENERAL ---

function showSystemMessage(message, isError = false) {
  const msgEl = document.getElementById('system-message');
    if (!msgEl) return;
    
    msgEl.textContent = message;
    
    // Clases Bootstrap para alerts
    const alertClass = isError ? 'alert-danger text-danger bg-danger-subtle' : 'alert-success text-success bg-success-subtle';

    // Se asignan las clases completas de Bootstrap
    msgEl.className = `fixed-top end-0 mt-5 me-4 p-3 rounded shadow ${alertClass}`;
    msgEl.classList.remove('d-none');
    setTimeout(() => msgEl.classList.add('d-none'), 5000);
}

// --- LÓGICA DE NAVEGACIÓN (Hash Routing) ---

function showPage(hash) {
    document.querySelectorAll('.page-content').forEach(section => {
        section.classList.add('d-none');
    });

    let hashValue = hash.substring(1).split('?')[0] || 'home'; 
    let pageId = hashValue + '-page';
    let pageElement = document.getElementById(pageId);

    if (hash.startsWith('#detalle')) {
        pageElement = document.getElementById('detalle-page');
        const urlParams = new URLSearchParams(hash.substring(hash.indexOf('?')));
        const productId = urlParams.get('id');
        if (productId) renderProductDetail(productId);
    }
    
    // Redirección forzada si intenta acceder a perfil sin estar logueado
    if (pageId === 'perfil-page' && !isLoggedIn) {
        showSystemMessage('Debes iniciar sesión para acceder a tu perfil.', true);
        pageElement = document.getElementById('auth-page'); 
        window.location.hash = '#auth';
        return;
    }
    
    if (pageId === 'perfil-page' && isLoggedIn) {
        const userEmail = localStorage.getItem('userEmail') || 'N/A';
        const userName = localStorage.getItem('userName') || 'N/A';
        document.getElementById('profile-user-email').textContent = userEmail;
        document.getElementById('profile-user-id').textContent = `ID-${userName.toUpperCase().replace(/[^A-Z0-9]/g, '-')}-SHELF`;
    }

    if (pageElement) {
        pageElement.classList.remove('d-none');
        window.scrollTo(0, 0); 

        if (pageId === 'catalogo-page') {
            applyFilters();
        }
        if (pageId === 'home-page') {
            renderFeaturedProducts();
        }
    } else {
        document.getElementById('home-page').classList.remove('d-none');
        renderFeaturedProducts();
        window.location.hash = '#home';
    }
}

function handleHashChange() {
    showPage(window.location.hash);
}

// --- LÓGICA DE PRODUCTOS, RENDERING Y RAWG ---

async function fetchRAWGProducts() {
  const URL = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=10&ordering=-released`;

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error('Error al obtener los datos de RAWG');
    const data = await response.json();
    
    const nuevosVideojuegos = data.results.map((game, index) => ({
      id: `RAWG-${game.id}`,
      name: game.name,
      category: "videojuegos",
      price: 49.99 + (index * 0.5), // Precio simulado
      desc: `Videojuego épico lanzado el ${game.released}. ¡Explora mundos increíbles! Géneros: ${game.genres.map(g => g.name).join(', ')}.`,
      image: game.background_image ? game.background_image : PLACEHOLDER_IMAGE,
      released: game.released
    }));

    PRODUCTOS.push(...nuevosVideojuegos); 
    
    // Si estamos en el home o catálogo, actualizamos
    if (window.location.hash.includes('#home')) renderFeaturedProducts();
    if (window.location.hash.includes('#catalogo')) applyFilters();

  } catch (error) {
    console.error("Error al cargar videojuegos de RAWG:", error);
  }
}

function createProductCard(product) {
  const detailLink = `#detalle?id=${product.id}`;
        
  return `
    <div class="col">
      <div class="card h-100 shadow-sm border-0">
        <a href="${detailLink}">
          <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 180px; object-fit: cover;">
        </a>
        <div class="card-body d-flex flex-column">
          <span class="small text-primary text-uppercase fw-semibold">${product.category}</span>
          <h5 class="card-title fw-bold text-dark text-truncate mt-1">
            <a href="${detailLink}" class="text-decoration-none text-dark">${product.name}</a>
          </h5>
          <p class="fs-4 fw-extrabold text-success mt-2">$${product.price.toFixed(2)}</p>
          <button onclick="simulateAddToCart(event, '${product.id}')" class="btn btn-primary btn-sm mt-auto fw-medium">
            Ver/Comprar
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderFeaturedProducts() {
  const container = document.getElementById('featured-products-container');
  // Asegura que se renderizan los primeros 4 productos
  if (container) {
      container.innerHTML = PRODUCTOS.slice(0, 4).map(createProductCard).join('');
  }
}

function applyFilters() {
  const categoryFilterElement = document.getElementById('filter-category');
    const sortFilterElement = document.getElementById('filter-sort');
    const productsContainer = document.getElementById('products-container');

    if (!categoryFilterElement || !sortFilterElement || !productsContainer) return;

    const categoryFilter = categoryFilterElement.value;
    const sortFilter = sortFilterElement.value;
    let filteredProducts = [...PRODUCTOS];

    if (categoryFilter !== 'todos') {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }

    if (sortFilter === 'asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortFilter === 'desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    productsContainer.innerHTML = filteredProducts.map(createProductCard).join('') || 
                        '<p class="col-12 text-center text-muted p-4">No se encontraron productos para esta selección.</p>';
}

function renderProductDetail(productId) {
    const product = PRODUCTOS.find(p => String(p.id) === String(productId));

    if (!product) {
        showSystemMessage('Producto no encontrado.', true);
        window.location.hash = '#catalogo';
        return;
    }

    // 1. Actualizar Contenido
    document.getElementById('detalle-image').src = product.image || PLACEHOLDER_IMAGE;
    document.getElementById('detalle-image').alt = product.name;
    document.getElementById('detalle-category').textContent = product.category.toUpperCase();
    document.getElementById('detalle-title').textContent = product.name;
    document.getElementById('detalle-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('detalle-description').textContent = product.desc;
    
    // Info Adicional/RAWG
    if (String(product.id).startsWith('RAWG')) {
        const released = product.released || 'N/A';
        document.getElementById('detalle-api-info').innerHTML = `Juego obtenido de la API externa de RAWG. **Fecha de lanzamiento:** ${released}`;
    } else {
        document.getElementById('detalle-api-info').textContent = "Producto de nuestro inventario principal. Calidad garantizada.";
    }

    // 2. Enlazar la función de compra al botón de la página de detalle
    document.getElementById('add-to-cart').onclick = () => simulateAddToCart(null, productId);
    
    // 3. Reiniciar y añadir listeners de rating
    const ratingStars = document.querySelectorAll('#rating-stars .rating-star');
    ratingStars.forEach(star => {
        star.classList.remove('active', 'text-warning');
        star.classList.add('text-muted');
        // Usar removeEventListener y addEventListener para evitar duplicados
        const newListener = () => handleRating(parseInt(star.dataset.rating), ratingStars);
        star.removeEventListener('click', star.listener || (() => {})); 
        star.addEventListener('click', newListener);
        star.listener = newListener; // Guardar la referencia del listener
    });
    document.getElementById('rating-message').textContent = 'Haz clic en una estrella para votar.';
}

function handleRating(rating, stars) {
  stars.forEach((star, index) => {
    const starValue = parseInt(star.dataset.rating);
    const isActive = starValue <= rating;
    star.classList.toggle('active', isActive);
    star.classList.toggle('text-warning', isActive);
    star.classList.toggle('text-muted', !isActive);
  });
  document.getElementById('rating-message').textContent = `¡Gracias! Calificaste con ${rating} estrellas.`;
}


// --- MANEJADORES GLOBALES DE EVENTOS Y FUNCIONES EXPORTADAS ---

function simulateAddToCart(event, productId) {
    if (event) event.preventDefault(); 
    const feedbackEl = document.getElementById('cart-feedback');
    if (feedbackEl) {
        // Mostrar feedback en la página de detalle
        feedbackEl.classList.remove('d-none');
        setTimeout(() => feedbackEl.classList.add('d-none'), 3000);
    }
    const product = PRODUCTOS.find(p => String(p.id) === String(productId));
    if (product) {
        showSystemMessage(`"${product.name}" añadido a la cesta (simulación).`, false);
    } else {
        showSystemMessage(`Producto no encontrado para añadir al carrito.`, true);
    }
}

function handleCategoryClick(category) {
    // 1. Cambia el hash para forzar la navegación
    window.location.hash = '#catalogo';
    
    // 2. Espera un momento para que la función showPage cargue el catálogo
    setTimeout(() => {
        const filterSelect = document.getElementById('filter-category');
        if (filterSelect) {
             // 3. Setea el filtro y aplica los filtros
             if ([...filterSelect.options].map(o => o.value).includes(category)) {
                 filterSelect.value = category;
             } else {
                 filterSelect.value = 'todos'; 
             }
             applyFilters();
        }
    }, 100);
}


// --- INICIALIZACIÓN PRINCIPAL ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar UI de autenticación
    updateAuthUI();

    // 2. Cargar productos externos (Videojuegos RAWG)
    fetchRAWGProducts();

    // 3. Establecer la página inicial
    handleHashChange();

    // 4. Listeners para navegación (cambio de hash)
    window.addEventListener('hashchange', handleHashChange);

    // 5. Eventos de Autenticación funcional
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('show-register-btn').addEventListener('click', showRegisterForm);
    document.getElementById('show-login-btn').addEventListener('click', showLoginForm);

    // 6. Evento de Calculadora de Ahorro
    document.getElementById('savings-calculator-form').addEventListener('submit', calculateSavings);

    // 7. Exportar funciones globales necesarias (para el HTML)
    window.applyFilters = applyFilters;
    window.simulateAddToCart = simulateAddToCart;
    window.handleLogout = handleLogout;
    window.handleCategoryClick = handleCategoryClick;
});