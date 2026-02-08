// --- 1. DATA ---
const databases = {
    'lin': {
        title: "Savonnerie Marseillaise", desc: "L'authenticité du sud",
        products: [
            { id: "abricot", name: "Savon Abricot", price: 3, img: "img/savon-abricot.jpg", description: "Savon artisanal enrichi en huile de noyau d'abricot : mousse onctueuse, parfum léger et gourmand. Formulé pour adoucir et nourrir la peau sans la dessécher — parfait pour les peaux sèches et sensibles. Emballé sans plastique, format pratique pour le quotidien." },
            { id: "original", name: "Savon Original", price: 5, img: "img/savon-original.jpg", description: "Le véritable cube de Marseille (72% huile d'olive) : un nettoyage profond mais doux, respectueux du textile et de la peau. Sa texture dense dure longtemps et s'utilise aussi bien pour les mains que pour la lessive écologique. Un classique durable à avoir sous la main." },
            { id: "détachant", name: "Savon Détachant", price: 6, img: "img/savon-détachant.jpg", description: "Concentré naturel pour prétraiter les taches rebelles : frottez, laissez agir, rincez. Efficace sur graisse, café et herbe, sans agents agressifs ni colorants. Idéal pour qui souhaite une solution simple, efficace et respectueuse des fibres." }
        ]
    },
    'argile': {
        title: "Art de la Table", desc: "Céramique artisanale",
        products: [
            { id: "carafe", name: "Carafe Eau", price: 30, img: "img/carafe.jpg", description: "Carafe en céramique tournée à la main : glaçure mate et finition artisanale qui garde l'eau fraîche et met en valeur votre table. Chaque pièce porte les traces du geste du tourneur — légère irrégularité, chaleur du matériau — idéale pour le quotidien comme pour un dîner soigné." },
            { id: "gourde", name: "Gourde Design", price: 34, img: "img/gourde.jpg", description: "Gourde isotherme en acier inoxydable au design épuré : double paroi pour garder vos boissons chaudes ou froides plusieurs heures. Bouchon étanche, prise en main soignée et finition mate — pratique pour la ville, le bureau ou les promenades." },
            { id: "poisson", name: "Carafe Poisson", price: 40, img: "img/poisson.jpg", description: "Carafe au motif 'Poisson' — pièce sculpturale et fonctionnelle : émaillée à la main, elle devient le point focal de la table. Parfaite pour servir eau ou jus, elle apporte caractère et conversation à chaque repas." }
        ]
    },
    'lumiere': {
        title: "Lumière", desc: "Luminaires",
        products: [
            { id: "lampe", name: "Lampe Archi", price: 140, img: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Lampe articulée au design architectural : bras pivotant et diffuseur chaleureux pour une lumière tamisée parfaite en coin lecture ou sur un bureau. Construction robuste, finitions soignées — elle combine utilité et esthétisme pour sublimer votre intérieur." }
        ]
    },
    'brut': {
        title: "Brut", desc: "Mobilier",
        products: [
            { id: "chaise", name: "Chaise Chêne", price: 250, img: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Chaise en chêne massif, assemblée selon des techniques traditionnelles. Finition huilée pour révéler le veinage naturel, assise confort étudiée — une pièce robuste conçue pour traverser les années et prendre une belle patine avec le temps." }
        ]
    },
    'vintage': {
        title: "Vintage", desc: "Pépites",
        products: [
            { id: "miroir", name: "Miroir Doré", price: 120, img: "https://images.pexels.com/photos/6976094/pexels-photo-6976094.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Miroir au cadre doré patiné, verre légèrement vieilli pour une profondeur chaleureuse. Idéal au-dessus d'une commode ou dans une entrée, il apporte une touche d'élégance vintage sans être ostentatoire." }
        ]
    }
};

let cart = [];
let currentProduct = null;
let shippingCost = 5;

// --- 2. INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Menu
    const navDrawer = document.getElementById('navDrawer');
    const navBackdrop = document.getElementById('navBackdrop');
    const toggleNav = () => { navDrawer.classList.toggle('active'); navBackdrop.classList.toggle('active'); };

    document.getElementById('burgerBtn').addEventListener('click', toggleNav);
    document.getElementById('closeNavBtn').addEventListener('click', toggleNav);
    navBackdrop.addEventListener('click', toggleNav);

    // Panier
    const cartTriggerEl = document.getElementById('cartTrigger');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartModalEl = document.getElementById('cartModal');
    const continueShoppingBtn = document.getElementById('continueShopping');

    // --- LOGIQUE D'OUVERTURE IMMERSIVE ---
    const openCart = () => {
        const cartModal = document.getElementById('cartModal');
        cartModal.classList.add('active');
        document.body.classList.add('cart-open'); // Déclenche le flou CSS
    };

    const closeCart = () => {
        const cartModal = document.getElementById('cartModal');
        cartModal.classList.remove('active');
        document.body.classList.remove('cart-open'); // Retire le flou
    };

    // Application aux boutons
    if (cartTriggerEl) cartTriggerEl.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', closeCart);

    // On modifie aussi goToCart pour la cohérence
    function goToCart() {
        document.getElementById('confirmModal').classList.remove('active');
        setTimeout(openCart, 200); // Utilise la nouvelle fonction openCart
    }
    // Optionnel : fermer le panier si on clique sur le flou (l'overlay)
    const cartOverlay = document.querySelector('.cart-overlay');
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // --- GESTION DES PAGES D'INFO (Concept, Atelier, Contact) ---
    // On sélectionne tous les liens qui ont la classe "info-link"
    document.querySelectorAll('.info-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // On empêche le lien de remonter en haut de page

            // On récupère le nom de la page (ex: "concept")
            const pageName = link.dataset.page;

            // On construit l'ID (ex: "page-concept")
            const targetPage = document.getElementById('page-' + pageName);

            if (targetPage) {
                closeAllPages(); // On ferme tout le reste
                targetPage.classList.add('active'); // On ouvre la bonne page
            }
        });
    });
    // --- GESTION DU MENU BURGER (Navigation) ---
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const pageName = link.dataset.page;

            // 1. Si c'est "Accueil", on ferme tout et on remonte
            if (pageName === 'home') {
                closeAllPages();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            // 2. Sinon, on ouvre la page demandée (Concept, Atelier...)
            else {
                const targetPage = document.getElementById('page-' + pageName);
                if (targetPage) {
                    closeAllPages(); // On ferme les autres pages
                    targetPage.classList.add('active'); // On ouvre la bonne
                }
            }

            // 3. IMPORTANT : ON FERME LE MENU BURGER
            document.getElementById('navDrawer').classList.remove('active');
            document.getElementById('navBackdrop').classList.remove('active');
        });
    });

    // Catalogue
    document.querySelectorAll('.corner').forEach(c => {
        if (!c.classList.contains('empty-slot')) c.addEventListener('click', () => openCatalog(c.dataset.collection));
    });

    document.getElementById('closeCatalogBtn').addEventListener('click', closeAllPages);
    document.getElementById('closeProductBtn').addEventListener('click', () => document.getElementById('productPage').classList.remove('active'));

    // --- LE BRANCHEMENT DU BOUTON AJOUTER ---
    const addBtn = document.getElementById('pdp-add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (currentProduct) {
                // On appelle la fonction SIMPLE d'ajout
                addToCart(currentProduct.id, currentProduct.name, currentProduct.price);
            }
        });
    }

    // Scroll Header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 20) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });
});

// --- 3. FONCTION AJOUT SIMPLE (AVEC FENÊTRE DE CHOIX) ---
function addToCart(id, name, price) {
    // Vérifier si l'article est déjà dans le panier
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        // Si l'article existe, augmenter la quantité
        existingItem.qty++;
    } else {
        // Sinon, ajouter le nouvel article avec quantité 1
        cart.push({ id, name, price, qty: 1 });
    }

    // Animer le badge du panier
    const badge = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.innerText = totalItems;
    badge.classList.remove('pulse');
    void badge.offsetWidth; // Force le redémarrage de l'animation
    badge.classList.add('pulse');

    // Mettre à jour l'affichage du panier
    updateCart();

    // 2. On ferme la fiche produit
    document.getElementById('productPage').classList.remove('active');

    // 3. On ouvre la fenêtre de confirmation "Que voulez-vous faire ?"
    document.getElementById('confirmModal').classList.add('active');
}

// --- 4. GESTION DE LA FENÊTRE DE CONFIRMATION ---
function closeConfirmModal() {
    // "Continuer mes achats" -> On ferme juste la fenêtre
    document.getElementById('confirmModal').classList.remove('active');
}

function goToCart() {
    // "Voir mon panier" -> On ferme la fenêtre ET on ouvre le panier
    document.getElementById('confirmModal').classList.remove('active');
    setTimeout(() => {
        document.getElementById('cartModal').classList.add('active');
    }, 200); // Petit délai pour la fluidité
}


// --- 5. FONCTIONS UTILES ---
function chooseDelivery(type) {
    document.querySelectorAll('.delivery-option').forEach(el => el.classList.remove('selected'));
    document.getElementById('del-' + type).classList.add('selected');
    shippingCost = (type === 'express') ? 12 : 5;
    updateCart();
}

function openCatalog(key) {
    const data = databases[key];
    if (!data) return;

    document.getElementById('brand-title').innerText = data.title;
    document.getElementById('brand-desc').innerText = data.desc;

    const grid = document.getElementById('products');
    grid.innerHTML = '';

    data.products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.img}" class="product-img" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.price}€</p>
            <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;">
                <button class="btn-add">Voir Détails</button>
                <button class="btn-buy">Acheter</button>
            </div>
        `;

        card.querySelector('.product-img').addEventListener('click', () => openProductPage(p.id, key));
        card.querySelector('.btn-add').addEventListener('click', (e) => {
            e.stopPropagation();
            openProductPage(p.id, key);
        });
        const buyBtn = card.querySelector('.btn-buy');
        if (buyBtn) {
            buyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // add item to cart and show confirmation modal
                addToCart(p.id, p.name, p.price);
            });
        }

        grid.appendChild(card);
    });

    document.getElementById('catalog').classList.add('active');
}

function openProductPage(id, dbKey) {
    const product = databases[dbKey].products.find(p => p.id === id);
    if (!product) return;

    currentProduct = product;

    document.getElementById('pdp-img').src = product.img;
    document.getElementById('pdp-title').innerText = product.name;
    document.getElementById('pdp-desc').innerText = product.description;
    document.getElementById('pdp-price').innerText = product.price.toFixed(2) + "€";
    document.getElementById('pdp-ht').innerText = "HT : " + (product.price / 1.2).toFixed(2) + "€";

    const page = document.getElementById('productPage');
    page.classList.remove('active');
    void page.offsetWidth;
    page.classList.add('active');

    chooseDelivery('standard');
}

function updateCart() {
    // Compter le nombre total d'articles
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cartCount').innerText = totalItems;

    const listEl = document.getElementById('cartItemsList');
    const emptyEl = document.getElementById('cartEmpty');

    if (cart.length === 0) {
        listEl.innerHTML = '';
        emptyEl.classList.add('active');
        const footerEl = document.getElementById('cartFooter');
        if (footerEl) {
            footerEl.classList.remove('active');
        }
        return;
    }

    emptyEl.classList.remove('active');
    if (document.getElementById('cartFooter')) {
        (document.getElementById('cartFooter')).classList.add('active');
    }

    // Afficher les articles avec quantités
    listEl.innerHTML = cart.map(item => {
        // Chercher l'image du produit dans toutes les bases de données
        let productImg = '';
        for (const [key, data] of Object.entries(databases)) {
            const product = data.products.find(p => p.id === item.id);
            if (product) {
                productImg = product.img;
                break;
            }
        }

        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image-wrapper">
                    ${productImg ? `<img src="${productImg}" alt="${item.name}" class="cart-item-image">` : '<div class="cart-item-placeholder"></div>'}
                </div>
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <div class="cart-item-qty">
                        <button class="qty-btn qty-minus" onclick="decreaseQty('${item.id}')">−</button>
                        <span class="qty-value">${item.qty}</span>
                        <button class="qty-btn qty-plus" onclick="increaseQty('${item.id}')">+</button>
                    </div>
                </div>
                <div class="cart-item-price-wrapper">
                    <span class="cart-item-price">${(item.price * item.qty).toFixed(2).replace('.', ',')}€</span>
                    <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">✕</button>
                </div>
            </div>
        `;
    }).join('');

    // Calculer et afficher les totaux
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const currentShipping = (cart.length > 0) ? shippingCost : 0;
    const total = subtotal + currentShipping;

    document.getElementById('cartSubtotal').innerText = subtotal.toFixed(2).replace('.', ',') + '€';
    document.getElementById('cartShipping').innerText = currentShipping.toFixed(2).replace('.', ',') + '€';
    document.getElementById('cartTotal').innerText = total.toFixed(2).replace('.', ',') + '€';

    // Afficher ou masquer le footer
    const footerEl = document.getElementById('cartFooter');
    if (document.getElementById('cartFooter')) {
        if (cart.length > 0) {
            (document.getElementById('cartFooter')).classList.add('active');
        } else {
            (document.getElementById('cartFooter')).classList.remove('active');
        }
    }
}

function increaseQty(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty++;
        updateCart();
    }
}

function decreaseQty(id) {
    const item = cart.find(i => i.id === id);
    if (item && item.qty > 1) {
        item.qty--;
        updateCart();
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
}

function closeAllPages() { document.querySelectorAll('.overlay-page').forEach(p => p.classList.remove('active')); }// --- FONCTION DE PAGINATION (Naviguer entre les pages 1, 2, 3) ---
function switchPage(pageNumber) {
    // 1. On cache toutes les pages
    const pages = document.querySelectorAll('.gallery-page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // 2. On désactive tous les points (boutons bas)
    const dots = document.querySelectorAll('.page-dot');
    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    // 3. On affiche la page demandée (ex: page-2)
    const targetPage = document.getElementById('page-' + pageNumber);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // 4. On active le bouton correspondant
    // (pageNumber - 1 car les tableaux commencent à 0 en informatique)
    if (dots[pageNumber - 1]) {
        dots[pageNumber - 1].classList.add('active');
    }

    // 5. On remonte tout en haut du site doucement
    window.scrollTo({ top: 0, behavior: 'smooth' });
}/* --- DEBUGGING DU PAIEMENT --- */
const checkoutButton = document.getElementById('checkoutBtn');

if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
        // 1. Vérifie si le panier existe
        if (typeof cart === 'undefined') {
            alert("ERREUR : La variable 'cart' n'existe pas ! Le script ne trouve pas tes articles.");
            return;
        }

        if (cart.length === 0) {
            alert("Ton panier est vide ! Ajoute un article avant de payer.");
            return;
        }

        console.log("Panier détecté :", cart);
        alert("Connexion au serveur en cours...");

        // 2. Tente de contacter le serveur
        fetch('http://localhost:3000/create-checkout-session', { // On force l'adresse complète
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cart: cart
            })
        })
            .then(res => {
                if (res.ok) return res.json();
                return res.json().then(json => Promise.reject(json));
            })
            .then(({ url }) => {
                console.log("URL reçue :", url);
                window.location = url;
            })
            .catch(e => {
                console.error(e);
                alert("ERREUR SERVEUR : " + (e.error || e.message) + "\n\nVérifie que ton terminal affiche bien 'Serveur lancé'.");
            });
    });
} else {
    console.log("Bouton payer introuvable");
}