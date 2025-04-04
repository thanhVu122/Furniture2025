import React, { useState, useEffect } from "react";
// Sử dụng hình ảnh đồ gỗ sang trọng
const fallbackImage = "https://images.unsplash.com/photo-1538688423619-a81d3f23454b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80";

const Home = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(fallbackImage);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    // Đặt trạng thái đã tải sau khoảng thời gian ngắn
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 500);
    
    // Tải trước hình ảnh
    const preloadImage = new Image();
    preloadImage.src = fallbackImage;
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="hero-container">
      <div className="hero-background" style={{
        backgroundImage: `url(${imageSrc})`,
        opacity: imageLoaded ? 1 : 0
      }}>
        {!imageLoaded && (
          <div className="loading-overlay">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
      <div className="hero-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-8 mx-auto text-center">
              <div className="hero-text-box">
                <h5 className="pre-title">Sản phẩm chất lượng</h5>
                <h1 className="hero-title">ĐỒ GỖ TEAM 4 - WOOD</h1>
                <p className="hero-subtitle">
                  Nâng tầm không gian sống với những sản phẩm gỗ tinh tế, sang trọng và bền đẹp
                </p>
                <div className="hero-buttons">
                  <a href="/product" className="btn-shop-now">
                    <span>Mua Ngay</span>
                    <i className="fa fa-arrow-right"></i>
                  </a>
                  <a href="/about" className="btn-learn-more">
                    <span>Tìm hiểu thêm</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thêm lớp phủ trang trí */}
      <div className="hero-decoration">
        <div className="decoration-circle"></div>
        <div className="decoration-line"></div>
      </div>

      <style jsx>{`
        .hero-container {
          position: relative;
          height: 85vh;
          min-height: 600px;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: opacity 1s ease;
          z-index: 1;
        }

        .hero-background::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, rgba(62, 39, 35, 0.85) 0%, rgba(62, 39, 35, 0.5) 100%);
          z-index: 2;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(62, 39, 35, 0.7);
          z-index: 3;
        }

        .hero-content {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          z-index: 3;
        }

        .hero-text-box {
          background-color: rgba(255, 248, 240, 0.9);
          padding: 3rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        }

        .hero-text-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
          background-color: #8B4513;
        }

        .pre-title {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #8B4513;
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
        }

        .pre-title::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 1px;
          background-color: #8B4513;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          font-weight: 700;
          color: #3E2723;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 1rem;
          color: #6B3612;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .hero-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .btn-shop-now {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          background-color: #8B4513;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-shop-now:hover {
          background-color: #6B3612;
          transform: translateY(-3px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
          text-decoration: none;
          color: white;
        }

        .btn-learn-more {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          background-color: transparent;
          color: #8B4513;
          border: 1px solid #8B4513;
          border-radius: 4px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-learn-more:hover {
          background-color: rgba(139, 69, 19, 0.1);
          text-decoration: none;
          color: #8B4513;
        }

        .hero-decoration {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        .decoration-circle {
          position: absolute;
          top: 10%;
          right: 10%;
          width: 150px;
          height: 150px;
          border: 1px solid rgba(210, 180, 140, 0.3);
          border-radius: 50%;
        }

        .decoration-line {
          position: absolute;
          bottom: 10%;
          left: 10%;
          width: 150px;
          height: 1px;
          background-color: rgba(210, 180, 140, 0.3);
          transform: rotate(-45deg);
        }

        @media (max-width: 768px) {
          .hero-container {
            height: 80vh;
          }
          
          .hero-text-box {
            padding: 2rem;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
