import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home({ user }) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setShowText(true), 100);
  }, []);

  const services = [
    {
      title: 'Infinity Pool',
      description: 'Olympic-sized pool with breathtaking ocean views',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfKgwbarHTWmUa9fqzKc8tfsvZ9IhT0dybLQ&s',
      alt: 'Luxury infinity pool with ocean view'
    },
    {
      title: 'Fine Dining',
      description: '5 restaurants with international and Ethiopian cuisine',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      alt: 'Elegant restaurant dining table'
    },
    {
      title: 'Luxury Spa',
      description: 'Traditional and modern treatments for ultimate relaxation',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      alt: 'Luxury spa treatment room'
    },
    {
      title: 'Modern Gym',
      description: 'State-of-the-art equipment with personal trainers',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      alt: 'Modern fitness center with equipment'
    },
    {
      title: 'Free Transport',
      description: 'Luxury vehicle pickup from airport or anywhere',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      alt: 'Luxury car service'
    },
    {
      title: 'Ethiopian Coffee',
      description: 'Authentic coffee ceremony with traditional snacks',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGl1S86xf8i8z2994YdrsdyfTpGDlrSNWaiw&s',
      alt: 'Traditional Ethiopian coffee ceremony'
    }
  ];

  const highlights = [
    {
      stat: '500+',
      label: 'Luxury Rooms',
      icon: '🏨'
    },
    {
      stat: '15+',
      label: 'Restaurants',
      icon: '🍽️'
    },
    {
      stat: '24/7',
      label: 'Concierge Service',
      icon: '⭐'
    },
    {
      stat: '1000+',
      label: 'Happy Guests',
      icon: '😊'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section with Animated Text */}
      <div className="hero-section">
        <div className="hero-overlay">
          <div className="container text-center text-white">
            <h1 className={`hero-title ${showText ? 'animate' : ''}`}>
              <span className="text-line line1">Welcome to</span>
              <span className="text-line line2">Logo hayk Resort</span>
            </h1>
            <p className={`hero-subtitle ${showText ? 'animate' : ''}`}>
              Where Luxury Meets Paradise
            </p>
            <div className={`hero-buttons ${showText ? 'animate' : ''}`}>
              {!user ? (
                <>
                  <Link to="/register" className="btn btn-gold btn-lg me-3 pulse">Register Now</Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg">Login</Link>
                </>
              ) : (
                <Link to="/rooms" className="btn btn-gold btn-lg pulse">Book Your Stay</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message with Fade Animation */}
      <div className="container my-5 text-center">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h2 className="text-gold mb-3 fade-in-up">Experience True Luxury</h2>
            <p className="lead fade-in-up delay-1">
              Nestled in the heart of paradise, Lucy Luxury Resort offers an 
              unforgettable experience with world-class amenities and exceptional service.
            </p>
          </div>
        </div>
      </div>

      {/* Hotel Highlights Stats */}
      <div className="highlights-section py-5">
        <div className="container">
          <div className="row">
            {highlights.map((item, index) => (
              <div className="col-md-3 col-6 mb-4" key={index}>
                <div className="highlight-card text-center slide-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <span className="highlight-icon">{item.icon}</span>
                  <h3 className="highlight-number">{item.stat}</h3>
                  <p className="highlight-label">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Services with Images */}
      <div className="container my-5">
        <h2 className="text-center mb-5">
          <span className="text-gold">Our Premium</span> Services
        </h2>
        <div className="row">
          {services.map((service, index) => (
            <div className="col-lg-4 col-md-6 mb-4" key={index}>
              <div className="service-card h-100 fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="service-image-wrapper">
                  <img 
                    src={service.image} 
                    className="service-image" 
                    alt={service.alt}
                    loading="lazy"
                  />
                  <div className="service-overlay">
                    <h4 className="service-title">{service.title}</h4>
                  </div>
                </div>
                <div className="service-content p-4">
                  <h4 className="service-title-mobile text-gold mb-3">{service.title}</h4>
                  <p className="service-description">{service.description}</p>
                  <Link to={`/${service.title.toLowerCase().replace(' ', '-')}`} className="btn btn-outline-gold btn-sm">
                    Learn More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Ethiopian Experience */}
      <div className="ethiopian-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="ethiopian-image-wrapper slide-in-left">
                <img 
                  src="https://mauchchunkcoffee.com/cdn/shop/articles/Ethiopian_Coffee_Ceremony_4fbca940-dc64-45b6-8fbb-47741a606753_1200x1200.jpg?v=1682080063"
                  alt="Traditional Ethiopian coffee ceremony"
                  className="img-fluid rounded-3 shadow"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="ethiopian-content slide-in-right">
                <h2 className="text-gold mb-4">Authentic Ethiopian Experience</h2>
                <p className="lead mb-4">
                  Immerse yourself in the rich culture of Ethiopia with our traditional coffee ceremony, 
                  authentic cuisine, and cultural performances.
                </p>
                <div className="features-list mb-4">
                  <div className="feature-item mb-3 fade-in-up">
                    <span className="feature-icon me-3">☕</span>
                    <span>Traditional Coffee Ceremony</span>
                  </div>
                  <div className="feature-item mb-3 fade-in-up delay-1">
                    <span className="feature-icon me-3">🍽️</span>
                    <span>Authentic Ethiopian Dishes</span>
                  </div>
                  <div className="feature-item mb-3 fade-in-up delay-2">
                    <span className="feature-icon me-3">🎵</span>
                    <span>Live Cultural Music</span>
                  </div>
                  <div className="feature-item mb-3 fade-in-up delay-3">
                    <span className="feature-icon me-3">👗</span>
                    <span>Traditional Dress Experience</span>
                  </div>
                </div>
                <Link to="/restaurant" className="btn btn-gold slide-in-up">
                  Explore Ethiopian Menu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Offers */}
      <div className="offers-section py-5">
        <div className="container">
          <h2 className="text-center text-white mb-5 fade-in-up">Special Offers</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="offer-card slide-in-up" style={{animationDelay: '0.1s'}}>
                <img 
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Honeymoon Suite"
                  className="offer-image"
                />
                <div className="offer-content p-4">
                  <h4 className="text-gold">Honeymoon Package</h4>
                  <p>Free spa treatment + Romantic dinner + Suite upgrade</p>
                  <p className="h5">$999/night</p>
                  <button className="btn btn-gold btn-sm mt-2">View Details</button>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="offer-card slide-in-up" style={{animationDelay: '0.2s'}}>
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Family Vacation"
                  className="offer-image"
                />
                <div className="offer-content p-4">
                  <h4 className="text-gold">Family Special</h4>
                  <p>Kids stay free + Free meals for children + Family activities</p>
                  <p className="h5">$799/night</p>
                  <button className="btn btn-gold btn-sm mt-2">View Details</button>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="offer-card slide-in-up" style={{animationDelay: '0.3s'}}>
                <img 
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Business Suite"
                  className="offer-image"
                />
                <div className="offer-content p-4">
                  <h4 className="text-gold">Business Package</h4>
                  <p>Free conference room + Airport transfer + Business lounge</p>
                  <p className="h5">$899/night</p>
                  <button className="btn btn-gold btn-sm mt-2">View Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container my-5">
        <h2 className="text-center mb-5">
          What <span className="text-gold">Our Guests</span> Say
        </h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="testimonial-card p-4 h-100 slide-in-up" style={{animationDelay: '0.1s'}}>
              <div className="testimonial-image-wrapper mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                  alt="Guest"
                  className="testimonial-image"
                />
              </div>
              <div className="stars mb-3">⭐⭐⭐⭐⭐</div>
              <p className="fst-italic">"The infinity pool with ocean view is absolutely breathtaking. Best hotel experience ever!"</p>
              <div className="mt-3">
                <h6 className="mb-0">John Doe</h6>
                <small className="text-muted">United States</small>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="testimonial-card p-4 h-100 slide-in-up" style={{animationDelay: '0.2s'}}>
              <div className="testimonial-image-wrapper mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1494790108777-766d2e0a6a7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                  alt="Guest"
                  className="testimonial-image"
                />
              </div>
              <div className="stars mb-3">⭐⭐⭐⭐⭐</div>
              <p className="fst-italic">"The Ethiopian coffee ceremony was magical. The food menu is incredible with so many authentic options."</p>
              <div className="mt-3">
                <h6 className="mb-0">Sarah Tekle</h6>
                <small className="text-muted">Ethiopia</small>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="testimonial-card p-4 h-100 slide-in-up" style={{animationDelay: '0.3s'}}>
              <div className="testimonial-image-wrapper mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                  alt="Guest"
                  className="testimonial-image"
                />
              </div>
              <div className="stars mb-3">⭐⭐⭐⭐⭐</div>
              <p className="fst-italic">"Luxury at its finest. The gym and spa facilities are world-class. The free transport service was very convenient."</p>
              <div className="mt-3">
                <h6 className="mb-0">Michael Brown</h6>
                <small className="text-muted">UK</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section text-center text-white py-5">
        <div className="container">
          <h2 className="mb-4 fade-in-up">Ready for an Unforgettable Experience?</h2>
          <p className="lead mb-4 fade-in-up delay-1">Book your stay now and enjoy 20% off on your first visit</p>
          <Link to={user ? "/rooms" : "/register"} className="btn btn-gold btn-lg pulse fade-in-up delay-2">
            {user ? "Book Now" : "Register & Get 20% Off"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
