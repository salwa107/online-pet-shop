/**
 * PawParadise Pet Shop - Main JavaScript
 * Course: CNC111 - Web Programming
 * 
 * Features:
 * - Unobtrusive JavaScript (no inline handlers)
 * - AJAX with Fetch API
 * - jQuery for JSON loading
 * - User Authentication
 * - DOM Manipulation
 */

// =====================================================
// GLOBAL STATE
// =====================================================
let products = [];
let cart = [];
let favorites = [];
let currentUser = null;

// =====================================================
// INITIALIZATION - Using jQuery to load JSON
// =====================================================
$(document).ready(function() {
    // Load products from JSON file using jQuery AJAX
    $.getJSON("products.json")
        .done(function(data) {
            products = data;
            loadProducts(products);
        })
        .fail(function() {
            console.error("Failed to load products.json");
        });
    
    // Initialize the application
    init();
    
    // Check if user is already logged in
    checkSession();
});

/**
 * Initialize the application
 * Sets up all event listeners and initial state
 */
function init() {
    updateCartCount();
    updateFavCount();
    updateFavoritesSection();
    setupEventListeners();
}

// =====================================================
// EVENT LISTENERS SETUP (UNOBTRUSIVE JAVASCRIPT)
// =====================================================
function setupEventListeners() {
    // -------------------------------------------------
    // Header Buttons
    // -------------------------------------------------
    document.getElementById('searchBtn').addEventListener('click', toggleSearch);
    document.getElementById('closeSearchBtn').addEventListener('click', toggleSearch);
    document.getElementById('favoritesBtn').addEventListener('click', toggleFavoritesPanel);
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    
    // -------------------------------------------------
    // Auth Buttons
    // -------------------------------------------------
    document.getElementById('loginBtn').addEventListener('click', function() {
        openModal('loginModal');
    });
    document.getElementById('signupBtn').addEventListener('click', function() {
        openModal('signupModal');
    });
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Switch between login/signup
    document.getElementById('switchToSignup').addEventListener('click', function(e) {
        e.preventDefault();
        closeModal('loginModal');
        openModal('signupModal');
    });
    document.getElementById('switchToLogin').addEventListener('click', function(e) {
        e.preventDefault();
        closeModal('signupModal');
        openModal('loginModal');
    });
    
    // -------------------------------------------------
    // Form Submissions
    // -------------------------------------------------
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('paymentForm').addEventListener('submit', processPayment);
    document.getElementById('newsletterForm').addEventListener('submit', subscribeNewsletter);
    
    // -------------------------------------------------
    // Checkout Button
    // -------------------------------------------------
    document.getElementById('checkoutBtn').addEventListener('click', showCheckout);
    
    // -------------------------------------------------
    // Hero Buttons
    // -------------------------------------------------
    document.getElementById('shopNowBtn').addEventListener('click', scrollToProducts);
    document.getElementById('learnMoreBtn').addEventListener('click', scrollToAbout);
    
    // -------------------------------------------------
    // Category Navigation
    // -------------------------------------------------
    document.querySelectorAll('.product-category').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var category = this.getAttribute('data-category');
            filterProducts(category);
        });
    });
    
    // -------------------------------------------------
    // FAQ Items
    // -------------------------------------------------
    document.querySelectorAll('.faq-item').forEach(function(item) {
        item.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // -------------------------------------------------
    // Payment Method Toggle
    // -------------------------------------------------
    document.querySelectorAll('input[name="paymentMethod"]').forEach(function(radio) {
        radio.addEventListener('change', togglePaymentMethod);
    });
    
    // -------------------------------------------------
    // Card Input Formatting
    // -------------------------------------------------
    document.getElementById('cardNumber').addEventListener('input', function() {
        formatCardNumber(this);
    });
    document.getElementById('cardExpiry').addEventListener('input', function() {
        formatExpiry(this);
    });
    document.getElementById('cardCvv').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    // -------------------------------------------------
    // Search Input
    // -------------------------------------------------
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // -------------------------------------------------
    // Close Modal Buttons
    // -------------------------------------------------
    document.querySelectorAll('[data-close]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var modalId = this.getAttribute('data-close');
            closeModal(modalId);
        });
    });
    
    // -------------------------------------------------
    // Close modals when clicking overlay
    // -------------------------------------------------
    document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // -------------------------------------------------
    // Event Delegation for Dynamic Buttons
    // -------------------------------------------------
    document.body.addEventListener('click', handleButtonClick);
    
    // -------------------------------------------------
    // Keyboard Events
    // -------------------------------------------------
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// =====================================================
// MODAL FUNCTIONS
// =====================================================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(function(modal) {
        modal.classList.remove('active');
    });
    document.getElementById('searchOverlay').classList.remove('active');
}

// =====================================================
// AUTHENTICATION FUNCTIONS (AJAX with Fetch API)
// =====================================================

/**
 * Check if user is logged in on page load
 */
function checkSession() {
    fetch('check_session.php', {
        method: 'GET',
        credentials: 'include'
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.loggedIn) {
            currentUser = data.user;
            updateAuthUI(true);
        }
    })
    .catch(function(error) {
        console.log('Session check failed:', error);
    });
}

/**
 * Handle user login
 */
function handleLogin(e) {
    e.preventDefault();
    
    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPassword').value;
    
    // Client-side validation
    if (!validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    // AJAX request using Fetch API
    fetch('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email, password: password })
    })
    .then(function(response) { 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
    })
    .then(function(data) {
        if (data.success) {
            currentUser = data.user;
            updateAuthUI(true);
            closeModal('loginModal');
            document.getElementById('loginForm').reset();
            showToast('Welcome back, ' + data.user.name + '! 🎉', 'success');
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(function(error) {
        console.error('Login error:', error);
        showToast('Login failed. Please try again.', 'error');
    });
}

/**
 * Handle user signup
 */
function handleSignup(e) {
    e.preventDefault();
    
    var name = document.getElementById('signupName').value;
    var email = document.getElementById('signupEmail').value;
    var password = document.getElementById('signupPassword').value;
    
    // Client-side validation
    if (name.trim().length < 3) {
        showToast('Name must be at least 3 characters', 'error');
        return;
    }
    if (!validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    // AJAX request using Fetch API
    fetch('signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: name, email: email, password: password })
    })
    .then(function(response) { 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
    })
    .then(function(data) {
        if (data.success) {
            currentUser = data.user;
            updateAuthUI(true);
            closeModal('signupModal');
            document.getElementById('signupForm').reset();
            showToast('Welcome to PawParadise, ' + data.user.name + '! 🎉', 'success');
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(function(error) {
        console.error('Signup error:', error);
        showToast('Signup failed. Please try again.', 'error');
    });
}

/**
 * Handle user logout
 */
function handleLogout() {
    fetch('logout.php', {
        method: 'GET',
        credentials: 'include'
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        currentUser = null;
        updateAuthUI(false);
        showToast('Logged out successfully', 'success');
    })
    .catch(function(error) {
        console.error('Logout error:', error);
        showToast('Logout failed', 'error');
    });
}

/**
 * Update UI based on authentication state
 */
function updateAuthUI(isLoggedIn) {
    var authButtons = document.getElementById('authButtons');
    var userInfo = document.getElementById('userInfo');
    var userName = document.getElementById('userName');
    
    if (isLoggedIn && currentUser) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        userName.textContent = currentUser.name;
    } else {
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
    }
}

/**
 * Validate email using regex
 */
function validateEmail(email) {
    var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

// =====================================================
// PRODUCT FUNCTIONS
// =====================================================

/**
 * Load products into the grid
 */
function loadProducts(productsToShow) {
    var grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    productsToShow.forEach(function(product, index) {
        var card = createProductCard(product, index);
        grid.appendChild(card);
    });
}

/**
 * Create a product card element
 */
function createProductCard(product, index) {
    var card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = (index * 0.1) + 's';
    card.setAttribute('data-category', product.category);
    
    var badgeHTML = product.badge 
        ? '<span class="product-badge">' + product.badge + '</span>' 
        : '';
    
    var oldPriceHTML = product.oldPrice 
        ? '<span class="old-price">$' + product.oldPrice.toFixed(2) + '</span>' 
        : '';
    
    var isFavorite = favorites.some(function(f) { return f.id === product.id; });
    
    card.innerHTML = 
        '<div class="product-image">' +
            badgeHTML +
            '<button class="favorite-btn ' + (isFavorite ? 'active' : '') + '" data-action="favorite" data-id="' + product.id + '">' +
                (isFavorite ? '❤️' : '🤍') +
            '</button>' +
            '<span>' + product.emoji + '</span>' +
        '</div>' +
        '<div class="product-info">' +
            '<span class="product-category-tag">' + getCategoryName(product.category) + '</span>' +
            '<h3 class="product-name">' + product.name + '</h3>' +
            '<div class="product-price">' +
                '<span class="current-price">$' + product.price.toFixed(2) + '</span>' +
                oldPriceHTML +
            '</div>' +
            '<button class="add-to-cart" data-action="add-to-cart" data-id="' + product.id + '">' +
                'Add to Cart 🛒' +
            '</button>' +
        '</div>';
    
    return card;
}

/**
 * Get friendly category name
 */
function getCategoryName(category) {
    var names = {
        food: 'Dry Food',
        toys: 'Toys',
        beds: 'Beds & Houses',
        accessories: 'Accessories',
        grooming: 'Grooming'
    };
    return names[category] || category;
}

/**
 * Filter products by category
 */
function filterProducts(category) {
    var filteredProducts;
    
    if (category === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(function(p) {
            return p.category === category;
        });
    }
    
    loadProducts(filteredProducts);
    scrollToProducts();
}

// =====================================================
// CART FUNCTIONS
// =====================================================

/**
 * Add product to cart
 */
function addToCart(productId) {
    var product = products.find(function(p) { return p.id === productId; });
    
    if (product) {
        var existingItem = cart.find(function(item) { return item.id === productId; });
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ 
                id: product.id,
                name: product.name,
                price: product.price,
                emoji: product.emoji,
                quantity: 1 
            });
        }
        
        updateCartCount();
        showToast(product.name + ' added to cart!', 'success');
    }
}

/**
 * Remove item from cart
 */
function removeFromCart(productId) {
    cart = cart.filter(function(item) { return item.id !== productId; });
    updateCartCount();
    renderCartItems();
}

/**
 * Update item quantity
 */
function updateQuantity(productId, change) {
    var item = cart.find(function(item) { return item.id === productId; });
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            renderCartItems();
        }
    }
}

/**
 * Update cart count display
 */
function updateCartCount() {
    var countElement = document.getElementById('cartCount');
    if (countElement) {
        var count = cart.reduce(function(total, item) { 
            return total + item.quantity; 
        }, 0);
        countElement.textContent = count;
    }
}

/**
 * Render cart items in modal
 */
function renderCartItems() {
    var cartItemsContainer = document.getElementById('cartItems');
    var cartEmpty = document.getElementById('cartEmpty');
    var cartFooter = document.getElementById('cartFooter');
    
    if (!cartItemsContainer || !cartEmpty || !cartFooter) return;
    
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        cartEmpty.style.display = 'block';
        cartFooter.style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartItemsContainer.style.display = 'flex';
    cartFooter.style.display = 'block';
    
    var html = '';
    cart.forEach(function(item) {
        html += 
            '<div class="cart-item">' +
                '<div class="item-emoji">' + item.emoji + '</div>' +
                '<div class="item-details">' +
                    '<div class="item-name">' + item.name + '</div>' +
                    '<div class="item-price">$' + (item.price * item.quantity).toFixed(2) + '</div>' +
                '</div>' +
                '<div class="item-controls">' +
                    '<button class="qty-btn" data-action="decrease" data-id="' + item.id + '">−</button>' +
                    '<span class="item-qty">' + item.quantity + '</span>' +
                    '<button class="qty-btn" data-action="increase" data-id="' + item.id + '">+</button>' +
                    '<button class="qty-btn remove" data-action="remove" data-id="' + item.id + '">✕</button>' +
                '</div>' +
            '</div>';
    });
    cartItemsContainer.innerHTML = html;
    
    var total = cart.reduce(function(sum, item) { 
        return sum + (item.price * item.quantity); 
    }, 0);
    document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
}

/**
 * Toggle cart modal
 */
function toggleCart() {
    var modal = document.getElementById('cartModal');
    if (!modal) return;
    
    modal.classList.toggle('active');
    
    if (modal.classList.contains('active')) {
        renderCartItems();
    }
}

// =====================================================
// CHECKOUT FUNCTIONS
// =====================================================

/**
 * Show checkout modal (requires login)
 */
function showCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    // Check if user is logged in
    if (!currentUser) {
        showToast('Please login to proceed with checkout', 'error');
        closeModal('cartModal');
        openModal('loginModal');
        return;
    }
    
    closeModal('cartModal');
    openModal('checkoutModal');
    
    var total = cart.reduce(function(sum, item) { 
        return sum + (item.price * item.quantity); 
    }, 0);
    document.getElementById('checkoutSubtotal').textContent = '$' + total.toFixed(2);
    document.getElementById('checkoutTotal').textContent = '$' + total.toFixed(2);
}

/**
 * Toggle checkout modal
 */
function toggleCheckout() {
    document.getElementById('checkoutModal').classList.toggle('active');
}

/**
 * Toggle payment method display
 */
function togglePaymentMethod() {
    var selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    var cardDetails = document.getElementById('cardDetails');
    var codDetails = document.getElementById('codDetails');
    var payButton = document.getElementById('payButton');
    
    if (selectedMethod === 'card') {
        cardDetails.style.display = 'block';
        codDetails.style.display = 'none';
        payButton.textContent = 'Pay Now';
    } else {
        cardDetails.style.display = 'none';
        codDetails.style.display = 'block';
        payButton.textContent = 'Place Order';
    }
}

/**
 * Format card number with spaces
 */
function formatCardNumber(input) {
    var value = input.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
    var formatted = value.match(/.{1,4}/g);
    input.value = formatted ? formatted.join(' ') : value;
    validateCardNumber(value);
}

/**
 * Validate card number
 */
function validateCardNumber(value) {
    var hint = document.getElementById('cardHint');
    var input = document.getElementById('cardNumber');
    
    if (!hint || !input) return;
    
    if (value.length === 0) {
        hint.textContent = 'Enter 16 digits';
        hint.className = 'input-hint';
        input.classList.remove('error', 'valid');
    } else if (value.length < 16) {
        hint.textContent = (16 - value.length) + ' more digits needed';
        hint.className = 'input-hint error';
        input.classList.add('error');
        input.classList.remove('valid');
    } else if (value.length === 16) {
        hint.textContent = '✓ Valid card number';
        hint.className = 'input-hint valid';
        input.classList.add('valid');
        input.classList.remove('error');
    } else {
        hint.textContent = 'Too many digits';
        hint.className = 'input-hint error';
        input.classList.add('error');
        input.classList.remove('valid');
    }
}

/**
 * Format expiry date
 */
function formatExpiry(input) {
    var value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    input.value = value;
}

/**
 * Process payment and submit order via AJAX
 */
function processPayment(e) {
    e.preventDefault();
    
    var selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    var total = cart.reduce(function(sum, item) { 
        return sum + (item.price * item.quantity); 
    }, 0);
    
    var orderData = {
        paymentMethod: selectedMethod,
        total: total
    };
    
    if (selectedMethod === 'card') {
        // Get shipping info
        orderData.name = document.getElementById('cardShipName').value;
        orderData.phone = document.getElementById('cardShipPhone').value;
        orderData.address = document.getElementById('cardShipAddress').value;
        
        // Validate shipping
        if (orderData.name.trim().length < 3) {
            showToast('Please enter your full name', 'error');
            return;
        }
        if (orderData.phone.trim().length < 10) {
            showToast('Please enter a valid phone number', 'error');
            return;
        }
        if (orderData.address.trim().length < 10) {
            showToast('Please enter your complete address', 'error');
            return;
        }
        
        // Validate card
        var cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        var cardName = document.getElementById('cardName').value;
        var cardExpiry = document.getElementById('cardExpiry').value;
        var cardCvv = document.getElementById('cardCvv').value;
        
        if (!/^\d{16}$/.test(cardNumber)) {
            showToast('Please enter a valid 16-digit card number', 'error');
            return;
        }
        if (cardName.trim().length < 3) {
            showToast('Please enter cardholder name', 'error');
            return;
        }
        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            showToast('Please enter valid expiry (MM/YY)', 'error');
            return;
        }
        if (!/^\d{3}$/.test(cardCvv)) {
            showToast('Please enter valid 3-digit CVV', 'error');
            return;
        }
    } else {
        // COD - get delivery info
        orderData.name = document.getElementById('codName').value;
        orderData.phone = document.getElementById('codPhone').value;
        orderData.address = document.getElementById('codAddress').value;
        
        if (orderData.name.trim().length < 3) {
            showToast('Please enter your full name', 'error');
            return;
        }
        if (orderData.phone.trim().length < 10) {
            showToast('Please enter a valid phone number', 'error');
            return;
        }
        if (orderData.address.trim().length < 10) {
            showToast('Please enter your complete address', 'error');
            return;
        }
    }
    
    // Submit order via AJAX
    fetch('submit_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderData)
    })
    .then(function(response) { 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
    })
    .then(function(data) {
        if (data.success) {
            if (selectedMethod === 'card') {
                showToast('Payment successful! Order #' + data.orderId + ' 🎉', 'success');
            } else {
                showToast('Order placed! Pay $' + total.toFixed(2) + ' on delivery 🚚', 'success');
            }
            
            // Clear cart
            cart = [];
            updateCartCount();
            closeModal('checkoutModal');
            document.getElementById('paymentForm').reset();
            togglePaymentMethod();
            
        } else if (data.requireLogin) {
            showToast(data.message, 'error');
            closeModal('checkoutModal');
            openModal('loginModal');
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(function(error) {
        showToast('Order failed. Please try again.', 'error');
    });
}

// =====================================================
// FAVORITES FUNCTIONS
// =====================================================

/**
 * Toggle favorite
 */
function toggleFavorite(productId) {
    var product = products.find(function(p) { return p.id === productId; });
    if (!product) return;
    
    var existingIndex = -1;
    favorites.forEach(function(f, index) {
        if (f.id === productId) existingIndex = index;
    });
    
    if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
        showToast(product.name + ' removed from favorites', 'success');
    } else {
        favorites.push(product);
        showToast(product.name + ' added to favorites! ❤️', 'success');
    }
    
    updateFavCount();
    loadProducts(products);
    updateFavoritesSection();
    
    var favModal = document.getElementById('favoritesModal');
    if (favModal && favModal.classList.contains('active')) {
        renderFavoritesItems();
    }
}

/**
 * Update favorites count
 */
function updateFavCount() {
    var countElement = document.getElementById('favCount');
    if (countElement) {
        countElement.textContent = favorites.length;
    }
}

/**
 * Update favorites section on page
 */
function updateFavoritesSection() {
    var grid = document.getElementById('favoritesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (favorites.length === 0) {
        grid.innerHTML = 
            '<div class="favorites-placeholder">' +
                '<span class="placeholder-icon">❤️</span>' +
                '<p>Your favorite products will appear here</p>' +
                '<p class="placeholder-hint">Click the heart icon on any product to add it to your favorites!</p>' +
            '</div>';
        return;
    }
    
    favorites.forEach(function(product, index) {
        var card = createProductCard(product, index);
        grid.appendChild(card);
    });
}

/**
 * Toggle favorites panel
 */
function toggleFavoritesPanel() {
    var modal = document.getElementById('favoritesModal');
    if (!modal) return;
    
    modal.classList.toggle('active');
    
    if (modal.classList.contains('active')) {
        renderFavoritesItems();
    }
}

/**
 * Render favorites items in modal
 */
function renderFavoritesItems() {
    var container = document.getElementById('favoritesItems');
    var empty = document.getElementById('favoritesEmpty');
    
    if (!container || !empty) return;
    
    if (favorites.length === 0) {
        container.style.display = 'none';
        empty.style.display = 'block';
        return;
    }
    
    empty.style.display = 'none';
    container.style.display = 'flex';
    
    var html = '';
    favorites.forEach(function(item) {
        html += 
            '<div class="favorite-item">' +
                '<div class="item-emoji">' + item.emoji + '</div>' +
                '<div class="item-details">' +
                    '<div class="item-name">' + item.name + '</div>' +
                    '<div class="item-price">$' + item.price.toFixed(2) + '</div>' +
                '</div>' +
                '<div class="item-controls">' +
                    '<button class="qty-btn" data-action="add-to-cart-fav" data-id="' + item.id + '">🛒</button>' +
                    '<button class="qty-btn remove" data-action="remove-fav" data-id="' + item.id + '">✕</button>' +
                '</div>' +
            '</div>';
    });
    container.innerHTML = html;
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Show toast notification
 */
function showToast(message, type) {
    var toast = document.getElementById('toast');
    var toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.className = 'toast show ' + (type || '');
    
    setTimeout(function() {
        toast.className = 'toast';
    }, 3000);
}

/**
 * Toggle search overlay
 */
function toggleSearch() {
    var overlay = document.getElementById('searchOverlay');
    var input = document.getElementById('searchInput');
    
    if (!overlay) return;
    
    overlay.classList.toggle('active');
    
    if (overlay.classList.contains('active') && input) {
        input.focus();
    }
}

/**
 * Handle search input
 */
function handleSearch(e) {
    var searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length > 0) {
        var filteredProducts = products.filter(function(p) {
            return p.name.toLowerCase().indexOf(searchTerm) !== -1 ||
                   p.category.toLowerCase().indexOf(searchTerm) !== -1;
        });
        loadProducts(filteredProducts);
    } else {
        loadProducts(products);
    }
}

/**
 * Scroll to products section
 */
function scrollToProducts() {
    var element = document.getElementById('products');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Scroll to about section
 */
function scrollToAbout() {
    var element = document.getElementById('about');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Subscribe to newsletter
 */
function subscribeNewsletter(e) {
    e.preventDefault();
    var email = e.target.querySelector('input[type="email"]').value;
    showToast('Thanks for subscribing with ' + email + '! 🎉', 'success');
    e.target.reset();
}

/**
 * Event delegation handler for dynamic buttons
 */
function handleButtonClick(e) {
    var button = e.target.closest('[data-action]');
    if (!button) return;
    
    var action = button.getAttribute('data-action');
    var id = parseInt(button.getAttribute('data-id'));
    
    e.preventDefault();
    e.stopPropagation();
    
    switch (action) {
        case 'add-to-cart':
            addToCart(id);
            break;
        case 'favorite':
            toggleFavorite(id);
            break;
        case 'increase':
            updateQuantity(id, 1);
            break;
        case 'decrease':
            updateQuantity(id, -1);
            break;
        case 'remove':
            removeFromCart(id);
            break;
        case 'add-to-cart-fav':
            addToCart(id);
            break;
        case 'remove-fav':
            toggleFavorite(id);
            break;
    }
}
