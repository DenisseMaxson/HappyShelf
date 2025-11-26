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
    { id: 11, name: "Mochis sabor taro", category: "snacks", price: 50.50, desc: "Un bocado exotico y dulce para tus tardes de peliculas.", image: "./images/mochis.jpg" },
    { id: 12, name: "Mochis sabor taro", category: "snacks", price: 50.50, desc: "Un bocado exotico y dulce para tus tardes de peliculas.", image: "./images/mochis.jpg" }
];

// Variables de estado (sin variables manuales para el carrusel)
let isLoggedIn = false;
let currentUserName = 'Invitado';

const PLACEHOLDER_IMAGE = "https://placehold.co/300x180?text=No+Image";


async function fetchRAWGProducts() {
    // REEMPLAZA TU_CLAVE_AQUI con tu clave real de RAWG
    const RAWG_API_KEY = "440d1bf1d0fc4b8ab796d650dce689bb"; 
    const URL = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=10&ordering=-released`; // Pide 10 juegos ordenados por lanzamiento

    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Error al obtener los datos de RAWG');
        }
        const data = await response.json();
        
        // Mapear los datos de la API al formato de tu tienda
        const nuevosVideojuegos = data.results.map((game, index) => ({
            id: `RAWG-${game.id}`,
            name: game.name,
            category: "videojuegos",
            price: 49.99 + (index * 0.5), // Precio simulado
            desc: `Videojuego épico lanzado el ${game.released}. ¡Explora mundos increíbles!`,
            image: game.background_image ? game.background_image : PLACEHOLDER_IMAGE,
            released: game.released
        }));

        // Asegúrate de que tu array PRODUCTOS sea global o usa una función para actualizarlo.
        PRODUCTOS.push(...nuevosVideojuegos); 
        
        // Llama a la función que redibuja tus productos, por ejemplo:
        renderFeaturedProducts(); // <--- LLAMAR AQUÍ PARA ACTUALIZAR HOME
        applyFilters(); // <--- LLAMAR AQUÍ PARA ACTUALIZAR CATÁLOGO
        
        // Llama a la función que redibuja tus productos, por ejemplo:
        // renderProducts(PRODUCTOS); 

    } catch (error) {
        console.error("Error al cargar videojuegos de RAWG:", error);
    }
}

// --- FUNCIONES DE UTILIDAD GENERAL ---

function showSystemMessage(message, isError = false) {
    const msgEl = document.getElementById('system-message');
    msgEl.textContent = message;
    
    // Clases Bootstrap para alerts
    const alertClass = isError ? 'alert-danger text-danger bg-danger-subtle' : 'alert-success text-success bg-success-subtle';

    // Se asignan las clases completas de Bootstrap
    msgEl.className = `fixed-top end-0 mt-5 me-4 p-3 rounded shadow ${alertClass}`;
    msgEl.classList.remove('d-none');
    setTimeout(() => msgEl.classList.add('d-none'), 5000);
}

// Simulación de navegación
function showPage(hash) {
    document.querySelectorAll('.page-content').forEach(section => {
        section.classList.add('d-none');
    });

    let hashValue = hash.substring(1).split('?')[0]; 
    let pageId = hashValue + '-page';
    let pageElement = document.getElementById(pageId);

    if (hash.startsWith('#detalle')) {
        pageElement = document.getElementById('detalle-page');
        const urlParams = new URLSearchParams(hash.substring(hash.indexOf('?')));
        const productId = urlParams.get('id');
        if (productId) renderProductDetail(productId);
    }

    if (pageElement) {
        pageElement.classList.remove('d-none');
        window.scrollTo(0, 0); 

        // Lógica de carga específica de la página
        if (pageId === 'catalogo-page') {
            applyFilters();
        }
        if (pageId === 'home-page') {
            renderFeaturedProducts();
            // El carrusel se inicializa y se auto-ejecuta por Bootstrap (data-bs-ride="carousel")
        }
        if (pageId === 'perfil-page' && !isLoggedIn) {
            showSystemMessage('Debes iniciar sesión para acceder a tu perfil.', true);
            window.location.hash = '#auth';
        }
    } else {
        // Default a home si el hash es inválido o vacío
        document.getElementById('home-page').classList.remove('d-none');
        renderFeaturedProducts();
    }
}

// --- RENDERING DE PRODUCTOS ---

function createProductCard(product) {
    return `
        <div class="col">
            <div class="card h-100 shadow-sm border-0">
                <a href="#detalle?id=${product.id}">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 180px; object-fit: cover;">
                </a>
                <div class="card-body d-flex flex-column">
                    <span class="small text-primary text-uppercase fw-semibold">${product.category}</span>
                    <h5 class="card-title fw-bold text-dark text-truncate mt-1">
                        <a href="#detalle?id=${product.id}" class="text-decoration-none text-dark">${product.name}</a>
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
    container.innerHTML = PRODUCTOS.slice(0, 4).map(createProductCard).join('');
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

function applyFilters() {
    const categoryFilter = document.getElementById('filter-category').value;
    const sortFilter = document.getElementById('filter-sort').value;
    let filteredProducts = [...PRODUCTOS];

    // 1. Filtrar por categoría
    if (categoryFilter !== 'todos') {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }

    // 2. Ordenar por precio
    if (sortFilter === 'asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortFilter === 'desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    // 3. Renderizar
    const container = document.getElementById('products-container');
    container.innerHTML = filteredProducts.map(createProductCard).join('') || 
                          '<p class="col-12 text-center text-muted p-4">No se encontraron productos para esta selección.</p>';
}

// --- LÓGICA SIMULADA DE AUTENTICACIÓN Y PERFIL ---

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
    const username = document.getElementById('login-username').value;
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', username.split('@')[0]);
    localStorage.setItem('userEmail', username); // Simulado
    updateAuthUI();
    showSystemMessage(`¡Bienvenido de nuevo, ${username.split('@')[0]}!`, false);
    window.location.hash = '#home';
}

function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('register-username').value;
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', email.split('@')[0]);
    localStorage.setItem('userEmail', email);
    updateAuthUI();
    showSystemMessage(`Registro exitoso. ¡Bienvenido, ${email.split('@')[0]}!`, false);
    window.location.hash = '#home';
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    updateAuthUI();
    showSystemMessage('Sesión cerrada. ¡Vuelve pronto!', false);
    window.location.hash = '#auth';
}

// Muestra el formulario de registro y oculta el de login
function showRegisterForm(e) {
    e.preventDefault();
    document.getElementById('login-form-container').classList.add('d-none');
    document.getElementById('register-form-container').classList.remove('d-none');
}

// Muestra el formulario de login y oculta el de registro
function showLoginForm(e) {
    e.preventDefault();
    document.getElementById('register-form-container').classList.add('d-none');
    document.getElementById('login-form-container').classList.remove('d-none');
}


// --- LÓGICA DE LA CALCULADORA DE AHORRO ---

function calculateSavings(e) {
    e.preventDefault();
    const cost = parseFloat(document.getElementById('item-cost').value);
    const weeklyExpense = parseFloat(document.getElementById('weekly-expense').value);
    const resultDiv = document.getElementById('savings-result');
    const resultText = document.getElementById('result-text');

    if (isNaN(cost) || isNaN(weeklyExpense) || cost <= 0 || weeklyExpense <= 0) {
        showSystemMessage('Por favor, ingresa valores positivos válidos.', true);
        resultDiv.classList.add('d-none');
        return;
    }

    const weeks = Math.ceil(cost / weeklyExpense);
    const months = (weeks / 4).toFixed(1);

    resultText.textContent = `Necesitarás ahorrar por ${weeks} semanas (aprox. ${months} meses) para comprar tu artículo de $${cost.toFixed(2)}. ¡Ánimo!`;
    resultDiv.classList.remove('d-none');
}

// --- MANEJADORES GLOBALES DE EVENTOS ---

function handleHashChange() {
    showPage(window.location.hash);
}

function simulateAddToCart(event, productId) {
    if (event) event.preventDefault(); 
    const feedbackEl = document.getElementById('cart-feedback');
    if (feedbackEl) {
        // Mostrar feedback en la página de detalle
        feedbackEl.classList.remove('d-none');
        setTimeout(() => feedbackEl.classList.add('d-none'), 3000);
    }
    const product = PRODUCTOS.find(p => p.id == productId);
    showSystemMessage(`"${product.name}" añadido a la cesta (simulación).`, false);
}

function handleCategoryClick(category) {
    window.location.hash = '#catalogo';
    setTimeout(() => {
        const filterSelect = document.getElementById('filter-category');
        if (filterSelect) {
            // Asegurarse de que el valor exista antes de asignarlo
            if ([...filterSelect.options].map(o => o.value).includes(category)) {
                 filterSelect.value = category;
            } else {
                 filterSelect.value = 'todos'; 
            }
            applyFilters();
        }
    }, 100);
}


// --- INICIALIZACIÓN ---

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar UI de autenticación
    updateAuthUI();

    // Cargar productos desde RAWG
    fetchRAWGProducts();

    // Establecer la página inicial
    handleHashChange();

    // Listener para navegación (cambio de hash)
    window.addEventListener('hashchange', handleHashChange);

    // Eventos de Autenticación
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('show-register-btn').addEventListener('click', showRegisterForm);
    document.getElementById('show-login-btn').addEventListener('click', showLoginForm);

    // Evento de Calculadora de Ahorro
    document.getElementById('savings-calculator-form').addEventListener('submit', calculateSavings);

    // Exportar funciones globales necesarias
    window.applyFilters = applyFilters;
    window.simulateAddToCart = simulateAddToCart;
    window.handleLogout = handleLogout;
    window.handleCategoryClick = handleCategoryClick;
});