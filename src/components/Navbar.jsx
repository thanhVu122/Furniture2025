import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const state = useSelector(state => state.handleCart) || { items: [] };
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [totalItems, setTotalItems] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
      
      if (state && state.items && Array.isArray(state.items)) {
        const total = state.items.reduce((sum, item) => sum + (item.qty || 0), 0);
        setTotalItems(total);
      } else {
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error in Navbar useEffect:", error);
      setTotalItems(0);
    }

    // Thêm event listener để kiểm tra scroll
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [state]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`navbar navbar-expand-lg py-3 sticky-top ${scrolled ? 'navbar-scrolled' : ''}`} style={{
      backgroundColor: scrolled ? 'rgba(255, 248, 240, 0.95)' : 'rgba(255, 248, 240, 1)',
      transition: 'all 0.3s ease'
    }}>
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          {/* Logo hoặc icon đại diện */}
          <div className="brand-logo me-2" style={{ width: '40px', height: '40px', backgroundColor: '#8B4513', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <i className="fa fa-tree text-white"></i>
          </div>
          <div>
            <span className="brand-text" style={{ fontFamily: 'Playfair Display, serif', fontWeight: '700', color: '#8B4513', fontSize: '1.3rem' }}>TEAM 4</span>
            <span className="d-block" style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6B3612', letterSpacing: '1px', marginTop: '-5px' }}>WOOD</span>
          </div>
        </NavLink>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-controls="navbarSupportedContent" 
          aria-expanded={isOpen ? "true" : "false"} 
          aria-label="Toggle navigation"
          style={{ border: 'none', outline: 'none' }}
        >
          <span className="navbar-toggler-icon" style={{ color: '#8B4513' }}></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto my-2 text-center">
            <li className="nav-item mx-2">
              <NavLink className={(navData) => navData.isActive ? "nav-link active-link" : "nav-link"} to="/" onClick={() => setIsOpen(false)} style={{ 
                color: '#3E2723', 
                fontWeight: '500',
                position: 'relative'
              }}>
                Trang chủ
                <span className="hover-line"></span>
              </NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink className={(navData) => navData.isActive ? "nav-link active-link" : "nav-link"} to="/product" onClick={() => setIsOpen(false)} style={{ 
                color: '#3E2723', 
                fontWeight: '500',
                position: 'relative'
              }}>
                Sản phẩm
                <span className="hover-line"></span>
              </NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink className={(navData) => navData.isActive ? "nav-link active-link" : "nav-link"} to="/about" onClick={() => setIsOpen(false)} style={{ 
                color: '#3E2723', 
                fontWeight: '500',
                position: 'relative'
              }}>
                Giới thiệu
                <span className="hover-line"></span>
              </NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink className={(navData) => navData.isActive ? "nav-link active-link" : "nav-link"} to="/contact" onClick={() => setIsOpen(false)} style={{ 
                color: '#3E2723', 
                fontWeight: '500',
                position: 'relative'
              }}>
                Liên hệ
                <span className="hover-line"></span>
              </NavLink>
            </li>
          </ul>
          <div className="buttons text-center">
            {!isLoggedIn ? (
              <>
                <NavLink to="/login" className="btn-nav-custom me-2" onClick={() => setIsOpen(false)}>
                  <i className="fa fa-sign-in-alt me-1"></i> Đăng nhập
                </NavLink>
                <NavLink to="/register" className="btn-nav-primary" onClick={() => setIsOpen(false)}>
                  <i className="fa fa-user-plus me-1"></i> Đăng ký
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/cart" className="btn-cart me-2" onClick={() => setIsOpen(false)}>
                  <i className="fa fa-shopping-cart"></i>
                  {totalItems > 0 && (
                    <span className="cart-badge">{totalItems}</span>
                  )}
                </NavLink>
                <NavLink to="/account" className="btn-nav-custom me-2" onClick={() => setIsOpen(false)}>
                  <i className="fa fa-user me-1"></i> Tài khoản
                </NavLink>
                <button onClick={handleLogout} className="btn-nav-outline">
                  <i className="fa fa-sign-out-alt me-1"></i> Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .active-link {
          font-weight: 600 !important;
          color: #8B4513 !important;
        }
        
        .hover-line {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background-color: #8B4513;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .nav-link:hover .hover-line, .active-link .hover-line {
          width: 80%;
        }
        
        .navbar-scrolled {
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        
        .btn-nav-custom {
          padding: 0.5rem 1rem;
          color: #8B4513;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
          border-radius: 4px;
        }
        
        .btn-nav-custom:hover {
          color: #6B3612;
          text-decoration: none;
          background-color: rgba(139, 69, 19, 0.1);
        }
        
        .btn-nav-primary {
          padding: 0.5rem 1rem;
          background-color: #8B4513;
          color: white;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
          border-radius: 4px;
        }
        
        .btn-nav-primary:hover {
          background-color: #6B3612;
          color: white;
          text-decoration: none;
        }
        
        .btn-nav-outline {
          padding: 0.5rem 1rem;
          border: 1px solid #8B4513;
          color: #8B4513;
          background: transparent;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
          border-radius: 4px;
        }
        
        .btn-nav-outline:hover {
          background-color: #8B4513;
          color: white;
          text-decoration: none;
        }
        
        .btn-cart {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #F5E8DB;
          color: #8B4513;
          transition: all 0.3s ease;
        }
        
        .btn-cart:hover {
          background-color: #8B4513;
          color: white;
        }
        
        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #C62828;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;