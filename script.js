// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
    currency: '$',
    // IMPORTANTE: Reemplaza este número por tu número de WhatsApp real de la agencia
    // Formato internacional sin el signo '+'. Ej: 5493510000000 (Argentina/Córdoba)
    whatsappAgencyNumber: '5493510000000' 
};

// ========================================
// DATA: MODELS & PRODUCTS
// ========================================
// Estructura adaptada para carpetas locales: assets/images/products/nombre_modelo/...
const models = [
    {
        id: "MDL-001",
        name: "Isabella V.",
        tagline: "Sensualidad y misterio.",
        description: "Colección fotográfica enfocada en luces bajas y lencería de diseño. Contenido exclusivo sin censura disponible en el pack premium.",
        coverImage: "https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?q=80&w=800&auto=format&fit=crop",
        telegramUser: "isabella_velix", // Usuario de telegram sin el @
        freeImages: [
            "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=400&auto=format&fit=crop"
        ],
        premiumPack: {
            id: "PACK-ISA-01",
            title: "Private Collection Vol. 1",
            price: 8500
        }
    },
    {
        id: "MDL-002",
        name: "Sophia L.",
        tagline: "Elegancia natural.",
        description: "Sesión en exteriores y estudio privado. El pack premium incluye videos detrás de escena y sets de fotos extendidos.",
        coverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
        telegramUser: "sophia_velix",
        freeImages: [
            "https://images.unsplash.com/photo-1485231183945-fcbd04c9e1dd?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=400&auto=format&fit=crop"
        ],
        premiumPack: {
            id: "PACK-SOP-01",
            title: "Midnight Walk Set",
            price: 10000
        }
    }
];

// ========================================
// DOM ELEMENTS
// ========================================
const DOM = {
    modelsGrid: document.getElementById('models-grid'),
    
    // Modals
    modelModal: document.getElementById('model-modal'),
    formModal: document.getElementById('form-modal'),
    creatorModal: document.getElementById('creator-modal'),
    closeBtns: document.querySelectorAll('.close-modal-btn'),
    navCreatorBtn: document.getElementById('nav-creator-btn'),
    
    // Model Profile Elements
    profAvatar: document.getElementById('profile-avatar'),
    profName: document.getElementById('profile-name'),
    profDesc: document.getElementById('profile-desc'),
    profTelegram: document.getElementById('profile-telegram'),
    profGallery: document.getElementById('free-gallery'),
    premTitle: document.getElementById('premium-title'),
    premPrice: document.getElementById('premium-price'),
    premCta: document.getElementById('premium-cta'),
    
    // Client Premium Form
    premiumForm: document.getElementById('premium-form'),
    formModelName: document.getElementById('form-model-name'),
    inpModelo: document.getElementById('input_modelo'),
    inpPackId: document.getElementById('input_pack_id'),
    inpPrecio: document.getElementById('input_precio'),
    inpClientAmount: document.getElementById('paymentAmount'),
    
    // Creator Form
    creatorForm: document.getElementById('creator-form'),
    cName: document.getElementById('cName'),
    cIg: document.getElementById('cIg')
};

let currentModel = null;

// ========================================
// INITIALIZATION & RENDER
// ========================================
function init() {
    renderModels();
    setupEventListeners();
}

function renderModels() {
    DOM.modelsGrid.innerHTML = '';
    
    models.forEach(model => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openModelProfile(model.id);

        card.innerHTML = `
            <div class="product-image-wrap">
                <img src="${model.coverImage}" alt="${model.name}" loading="lazy">
            </div>
            <div class="model-card-info">
                <h3>${model.name}</h3>
                <p>${model.tagline}</p>
            </div>
        `;
        DOM.modelsGrid.appendChild(card);
    });
}

// ========================================
// PROFILE MODAL LOGIC
// ========================================
function openModelProfile(modelId) {
    currentModel = models.find(m => m.id === modelId);
    if (!currentModel) return;

    // Poblar Cabecera
    DOM.profAvatar.src = currentModel.coverImage;
    DOM.profName.textContent = currentModel.name;
    DOM.profDesc.textContent = currentModel.description;
    DOM.profTelegram.href = `https://t.me/${currentModel.telegramUser}`;

    // Renderizar Galería Free
    DOM.profGallery.innerHTML = '';
    currentModel.freeImages.forEach(imgUrl => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = `Free image of ${currentModel.name}`;
        DOM.profGallery.appendChild(img);
    });

    // Poblar Caja Premium
    DOM.premTitle.textContent = currentModel.premiumPack.title;
    DOM.premPrice.textContent = `${CONFIG.currency}${currentModel.premiumPack.price}`;
    
    DOM.modelModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ========================================
// BUY PREMIUM LOGIC (FORMSUBMIT)
// ========================================
DOM.premCta.addEventListener('click', () => {
    DOM.modelModal.classList.remove('active');
    DOM.formModal.classList.add('active');
    
    // Autocompletar form de compra
    DOM.formModelName.textContent = currentModel.name;
    DOM.inpModelo.value = currentModel.name;
    DOM.inpPackId.value = currentModel.premiumPack.id;
    DOM.inpPrecio.value = `${CONFIG.currency}${currentModel.premiumPack.price}`;
    DOM.inpClientAmount.value = `${CONFIG.currency}${currentModel.premiumPack.price}`;
});

// ========================================
// CREATOR BOOKING LOGIC (WHATSAPP)
// ========================================
DOM.navCreatorBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeAllModals();
    DOM.creatorModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

DOM.creatorForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitamos que la página se recargue
    
    const name = DOM.cName.value;
    const ig = DOM.cIg.value;
    
    // Mensaje codificado para la URL de WhatsApp
    const message = `Hola agencia VELIX, me llamo ${name} y me gustaría aplicar como modelo/creadora. Mi Instagram es ${ig}.`;
    const encodedMessage = encodeURIComponent(message);
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappAgencyNumber}&text=${encodedMessage}`;
    
    // Redirigir a WhatsApp
    window.open(whatsappUrl, '_blank');
    closeAllModals();
    DOM.creatorForm.reset();
});

// ========================================
// MODAL MANAGEMENT
// ========================================
function closeAllModals() {
    DOM.modelModal.classList.remove('active');
    DOM.formModal.classList.remove('active');
    DOM.creatorModal.classList.remove('active');
    document.body.style.overflow = '';
}

function setupEventListeners() {
    DOM.closeBtns.forEach(btn => btn.addEventListener('click', closeAllModals));
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeAllModals();
        }
    });
}

// Iniciar app
document.addEventListener('DOMContentLoaded', init);