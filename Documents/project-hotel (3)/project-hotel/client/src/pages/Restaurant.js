import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Restaurant.css';

function Restaurant({ user }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuAnimation, setMenuAnimation] = useState(false);

  useEffect(() => {
    // Trigger menu animation on load
    setTimeout(() => setMenuAnimation(true), 100);
  }, []);

  // Complete Menu Data - Real Restaurant Style
  const menuData = {
    categories: [
      { id: 'all', name: 'All Items', icon: '🍽️' },
      { id: 'appetizers', name: 'Appetizers', icon: '🥗' },
      { id: 'ethiopian', name: 'Ethiopian Cuisine', icon: '🇪🇹' },
      { id: 'seafood', name: 'Seafood', icon: '🦞' },
      { id: 'steaks', name: 'Steaks & Grills', icon: '🥩' },
      { id: 'pasta', name: 'Pasta & Risotto', icon: '🍝' },
      { id: 'coffee', name: 'Coffee & Drinks', icon: '☕' },
      { id: 'desserts', name: 'Desserts', icon: '🍰' }
    ],

    // Appetizers
    appetizers: [
      {
        id: 1,
        name: 'Truffle Arancini',
        description: 'Crispy risotto balls with mozzarella, topped with black truffle shavings',
        price: 16.99,
        category: 'appetizers',
        subcategory: 'Signature Starters',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['vegetarian', 'signature'],
        spicy: false,
        gluten_free: false
      },
      {
        id: 2,
        name: 'Crispy Calamari',
        description: 'Lightly fried calamari served with spicy marinara and lemon aioli',
        price: 18.99,
        category: 'appetizers',
        subcategory: 'Seafood Starters',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['popular'],
        spicy: true,
        gluten_free: false
      },
      {
        id: 3,
        name: 'Beef Carpaccio',
        description: 'Thinly sliced raw beef with arugula, parmesan, and truffle oil',
        price: 22.99,
        category: 'appetizers',
        subcategory: 'Signature Starters',
        image: 'https://api.photon.aremedia.net.au/wp-content/uploads/sites/10/Gt/2023/01/12/20634/web_Beef-Carpaccio-with-Fig---Fennel-Salad---Ginger-Shallot-Dressin.jpg?fit=1200%2C1500',
        tags: ['chef special'],
        spicy: false,
        gluten_free: true
      }
    ],

    // Ethiopian Cuisine
    ethiopian: [
      {
        id: 4,
        name: 'Doro Wat',
        description: 'Traditional spicy chicken stew with hard-boiled eggs, served with injera',
        price: 24.99,
        category: 'ethiopian',
        subcategory: 'Signature Dishes',
         image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg9c5BOZJ5fJL2Sc64Zd6DlxLHi8Yf6yNiig&s',
        tags: ['signature', 'spicy'],
        spicy: true,
        gluten_free: true
      },
      {
        id: 5,
        name: 'Kitfo',
        description: 'Minced raw beef seasoned with mitmita and niter kibbeh, served with ayib',
        price: 29.99,
        category: 'ethiopian',
        subcategory: 'Traditional',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXTOrkZiWpdZ72SVh87eQSkXctDEzrZRSC_g&s',
        tags: ['traditional', 'chef special'],
        spicy: true,
        gluten_free: true
      },
      {
        id: 6,
        name: 'Vegetarian Combination',
        description: 'Assorted lentil, cabbage, potato, and greens dishes with injera',
        price: 19.99,
        category: 'ethiopian',
        subcategory: 'Vegetarian',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8T_VMBhFUrfopJg4cEpAvk_vNYuStZkiHVA&s',
        tags: ['vegetarian', 'popular'],
        spicy: false,
        gluten_free: true
      },
      {
        id: 7,
        name: 'Tibs',
        description: 'Sautéed meat with onions, peppers, and rosemary',
        price: 26.99,
        category: 'ethiopian',
        subcategory: 'Main Course',
        image: 'https://www.shutterstock.com/image-photo/shekla-tibs-savory-ethiopian-national-260nw-2493547903.jpg',
        tags: ['popular'],
        spicy: false,
        gluten_free: true
      },
      {
        id: 8,
        name: 'Shiro',
        description: 'Chickpea flour stew with berbere spice, served with injera',
        price: 16.99,
        category: 'ethiopian',
        subcategory: 'Vegetarian',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY7hBDhEHJpnYcVjo48n9dKfyIsWXyvF9Pew&s',
        tags: ['vegetarian', 'vegan'],
        spicy: true,
        gluten_free: true
      },
      {
        id: 9,
        name: 'Gored Gored',
        description: 'Cubed raw beef mixed with mitmita and butter',
        price: 27.99,
        category: 'ethiopian',
        subcategory: 'Traditional',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwSqmeNoqDYyKIDtMIY47BSyc4TEKicJfzsg&s',
        tags: ['traditional'],
        spicy: true,
        gluten_free: true
      }
    ],

    // Seafood
    seafood: [
      {
        id: 10,
        name: 'Grilled Lobster',
        description: 'Whole Maine lobster with herb butter and lemon',
        price: 45.99,
        category: 'seafood',
        subcategory: 'Signature',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['signature', 'chef special'],
        spicy: false,
        gluten_free: true
      },
      {
        id: 11,
        name: 'Pan-Seared Salmon',
        description: 'Atlantic salmon with citrus beurre blanc and asparagus',
        price: 32.99,
        category: 'seafood',
        subcategory: 'Main Course',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['healthy'],
        spicy: false,
        gluten_free: true
      },
      {
        id: 12,
        name: 'Seafood Platter',
        description: 'Oysters, shrimp, crab legs, and lobster with dipping sauces',
        price: 89.99,
        category: 'seafood',
        subcategory: 'For Sharing',
        image: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['for sharing', 'signature'],
        spicy: false,
        gluten_free: true
      }
    ],

    // Steaks & Grills
    steaks: [
      {
        id: 13,
        name: 'Wagyu Beef',
        description: 'Premium A5 Japanese Wagyu, served with seasonal vegetables',
        price: 89.99,
        category: 'steaks',
        subcategory: 'Premium',
        image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['premium', 'chef special'],
        spicy: false,
        gluten_free: true
      },
      {
        id: 14,
        name: 'Ribeye Steak',
        description: '16oz prime ribeye with red wine reduction',
        price: 49.99,
        category: 'steaks',
        subcategory: 'Signature',
        image: 'https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['popular'],
        spicy: false,
        gluten_free: true
      },
      {
        id: 15,
        name: 'Filet Mignon',
        description: '8oz tenderloin with peppercorn sauce',
        price: 54.99,
        category: 'steaks',
        subcategory: 'Signature',
        image: 'https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['signature'],
        spicy: false,
        gluten_free: true
      }
    ],

    // Pasta
    pasta: [
      {
        id: 16,
        name: 'Truffle Pasta',
        description: 'Handmade pasta with black truffle cream sauce',
        price: 32.99,
        category: 'pasta',
        subcategory: 'Signature',
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['signature', 'vegetarian'],
        spicy: false,
        gluten_free: false
      },
      {
        id: 17,
        name: 'Lobster Ravioli',
        description: 'House-made ravioli filled with lobster in saffron cream',
        price: 38.99,
        category: 'pasta',
        subcategory: 'Premium',
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['premium'],
        spicy: false,
        gluten_free: false
      }
    ],

    // Coffee & Drinks
    coffee: [
      {
        id: 18,
        name: 'Ethiopian Coffee Ceremony',
        description: 'Traditional coffee ceremony with popcorn and incense',
        price: 15.99,
        category: 'coffee',
        subcategory: 'Traditional',
        image: 'https://media.istockphoto.com/id/2148372061/photo/ethiopian-coffee-ceremony-with-aromatic-frankincense-debre-libanos-ethiopia.jpg?s=612x612&w=0&k=20&c=wnmtopInF4vUK8hlz2yxymR1ISHRaJUoz5M7a78eUD4=',
        tags: ['signature', 'for two'],
        forTwo: true
      },
      {
        id: 19,
        name: 'iced-coffe Latte',
        description: 'refreshing coffee drink is made with espresso, milk and ice',
        price: 6.99,
        category: 'coffee',
        subcategory: 'Single Origin',
        image: 'https://alidasfood.com/wp-content/uploads/2021/09/Cafe-Latte-Gelado.jpg',
        tags: ['popular']
      },
      {
        id: 20,
        name: 'macchiato',
        description: 'Rich and full-bodied with chocolate notes',
        price: 6.99,
        category: 'coffee',
        subcategory: 'Single Origin',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLEI2Nb5A_NvnHAjM1AV02-5wg8BqodT1kkA&s'
      },
      {
        id: 21,
        name: 'Harrar',
        description: 'Winey and fruity with blueberry notes',
        price: 7.99,
        category: 'coffee',
        subcategory: 'Single Origin',
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['premium']
      },
      {
        id: 22,
        name: 'Ethiopian Honey Wine',
        description: 'Traditional tej, sweet honey wine',
        price: 12.99,
        category: 'coffee',
        subcategory: 'Wine',
        image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['alcoholic', 'traditional']
      }
    ],

    // Desserts
    desserts: [
      {
        id: 23,
        name: 'Chocolate Souffle',
        description: 'Decadent warm chocolate soufflé with vanilla ice cream',
        price: 18.99,
        category: 'desserts',
        subcategory: 'Signature',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['signature', 'must try']
      },
      {
        id: 24,
        name: 'Tiramisu',
        description: 'Classic Italian dessert with mascarpone and espresso',
        price: 14.99,
        category: 'desserts',
        subcategory: 'Classic',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['popular']
      },
      {
        id: 25,
        name: 'Crème Brûlée',
        description: 'Vanilla bean custard with caramelized sugar',
        price: 13.99,
        category: 'desserts',
        subcategory: 'Classic',
        image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    ]
  };

  // Combine all menu items
  const allItems = [
    ...menuData.appetizers,
    ...menuData.ethiopian,
    ...menuData.seafood,
    ...menuData.steaks,
    ...menuData.pasta,
    ...menuData.coffee,
    ...menuData.desserts
  ];

  // Get filtered items based on category
  const getFilteredItems = () => {
    if (activeCategory === 'all') return allItems;
    return allItems.filter(item => item.category === activeCategory);
  };

  const filteredItems = getFilteredItems();

  // Group items by subcategory
  const groupBySubcategory = (items) => {
    return items.reduce((groups, item) => {
      const key = item.subcategory || 'Other';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  };

  const groupedItems = groupBySubcategory(filteredItems);

  // Cart functions
  const addToCart = (item) => {
    if (!user) {
      setSelectedItem(item);
      return;
    }

    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }

    // Show cart with animation
    setShowCart(true);
    
    // Add animation class to the added item
    const element = document.getElementById(`item-${item.id}`);
    if (element) {
      element.classList.add('item-added');
      setTimeout(() => element.classList.remove('item-added'), 500);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
    if (cart.length === 1) {
      setShowCart(false);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const placeOrder = () => {
    setOrderSuccess(true);
    setCart([]);
    setShowCart(false);
    setTimeout(() => setOrderSuccess(false), 4000);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="restaurant-page">
      {/* Hero Section with Animated Text */}
      <div className="restaurant-hero">
        <div className="hero-overlay">
          <div className="container text-center text-white">
            <h1 className="hero-title animate-title">
              <span className="title-line line1">Culinary</span>
              <span className="title-line line2">Excellence</span>
            </h1>
            <p className="hero-subtitle animate-subtitle">
              Experience a journey of flavors from around the world
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {orderSuccess && (
        <div className="success-toast animate-slide-down">
          <div className="success-icon">✓</div>
          <div className="success-message">
            <h4>Order Placed Successfully!</h4>
            <p>Your food will be prepared fresh and delivered to your room.</p>
          </div>
        </div>
      )}

      {/* Login Prompt Modal */}
      {selectedItem && !user && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content animate-slide-up">
            <button className="modal-close" onClick={() => setSelectedItem(null)}>×</button>
            <div className="modal-icon">🍽️</div>
            <h3>Login to Order</h3>
            <p>Please login or register to add items to your cart</p>
            <div className="modal-buttons">
              <Link to="/login" className="btn btn-gold" onClick={() => setSelectedItem(null)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-outline-gold" onClick={() => setSelectedItem(null)}>
                Register
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Menu Section */}
      <div className="container my-5">
        {/* Category Navigation */}
        <div className="category-nav-wrapper">
          <div className="category-nav">
            {menuData.categories.map((category, index) => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="menu-section">
          {Object.entries(groupedItems).map(([subcategory, items], groupIndex) => (
            <div key={subcategory} className="menu-group">
              <h2 className="subcategory-title animate-slide-right">
                {subcategory}
              </h2>
              <div className="menu-grid">
                {items.map((item, itemIndex) => (
                  <div
                    id={`item-${item.id}`}
                    key={item.id}
                    className="menu-item-card"
                    style={{ animationDelay: `${(groupIndex * 0.1) + (itemIndex * 0.05)}s` }}
                  >
                    <div className="item-image-wrapper">
                      <img src={item.image} alt={item.name} className="item-image" />
                      {item.tags && item.tags.includes('signature') && (
                        <span className="item-badge signature">👑 Signature</span>
                      )}
                      {item.tags && item.tags.includes('popular') && (
                        <span className="item-badge popular">🔥 Popular</span>
                      )}
                      {item.spicy && (
                        <span className="item-badge spicy">🌶️ Spicy</span>
                      )}
                      {item.gluten_free && (
                        <span className="item-badge gluten-free">🌾 Gluten Free</span>
                      )}
                    </div>
                    
                    <div className="item-content">
                      <div className="item-header">
                        <h3 className="item-name">{item.name}</h3>
                        <span className="item-price">${item.price.toFixed(2)}</span>
                      </div>
                      
                      <p className="item-description">{item.description}</p>
                      
                      {item.tags && (
                        <div className="item-tags">
                          {item.tags.map(tag => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                        </div>
                      )}
                      
                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(item)}
                      >
                        <span className="btn-icon">+</span>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          className={`floating-cart-btn ${showCart ? 'active' : ''}`}
          onClick={() => setShowCart(!showCart)}
        >
          <span className="cart-icon">🛒</span>
          <span className="cart-count">{cart.length}</span>
          <span className="cart-total">${cartTotal.toFixed(2)}</span>
        </button>
      )}

      {/* Shopping Cart Sidebar */}
      <div className={`cart-sidebar ${showCart ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your Order</h3>
          <button className="close-cart" onClick={() => setShowCart(false)}>×</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <span className="empty-icon">🛒</span>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p>${item.price.toFixed(2)}</p>
                    <div className="cart-item-quantity">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span className="total-amount">${cartTotal.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={placeOrder}>
              Place Order
            </button>
          </div>
        )}
      </div>

      {/* Background Decoration */}
      <div className="menu-background">
        <div className="bg-circle circle1"></div>
        <div className="bg-circle circle2"></div>
        <div className="bg-circle circle3"></div>
      </div>
    </div>
  );
}

export default Restaurant;
