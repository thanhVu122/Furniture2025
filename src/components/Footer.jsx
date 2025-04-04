import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-section">
      {/* Đường cong trang trí phía trên footer */}
      <div className="footer-curve">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100">
          <path fill="#FFF8F0" fillOpacity="1" d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
        </svg>
      </div>

      {/* Phần nội dung chính của footer */}
      <div className="footer-content">
        <div className="container">
          <div className="row">
            {/* Logo và giới thiệu */}
            <div className="col-lg-4 col-md-6 mb-5">
              <div className="footer-logo d-flex align-items-center mb-4">
                <div className="logo-icon">
                  <i className="fa fa-tree"></i>
                </div>
                <div className="logo-text">
                  <span className="brand-name">TEAM 4</span>
                  <span className="brand-tagline">WOOD</span>
                </div>
              </div>
              <p className="footer-description">
                Cửa hàng nội thất gỗ cao cấp với các sản phẩm chất lượng, uy tín và dịch vụ chăm sóc khách hàng tốt nhất.
              </p>
              <div className="social-links">
                <a href="#" className="social-link">
                  <i className="fa fa-facebook-f"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fa fa-instagram"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fa fa-twitter"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fa fa-pinterest"></i>
                </a>
              </div>
            </div>

            {/* Liên kết hữu ích */}
            <div className="col-lg-2 col-md-6 mb-5">
              <h5 className="footer-heading">Sản phẩm</h5>
              <ul className="footer-links">
                <li><Link to="/product">Tất cả sản phẩm</Link></li>
                <li><Link to="/product">Bàn ghế</Link></li>
                <li><Link to="/product">Tủ kệ</Link></li>
                <li><Link to="/product">Giường</Link></li>
              </ul>
            </div>

            {/* Hỗ trợ */}
            <div className="col-lg-2 col-md-6 mb-5">
              <h5 className="footer-heading">Liên kết</h5>
              <ul className="footer-links">
                <li><Link to="/about">Giới thiệu</Link></li>
                <li><Link to="/contact">Liên hệ</Link></li>
                <li><Link to="/login">Đăng nhập</Link></li>
                <li><Link to="/register">Đăng ký</Link></li>
              </ul>
            </div>

            {/* Thông tin liên hệ */}
            <div className="col-lg-4 col-md-6 mb-5">
              <h5 className="footer-heading">Liên hệ</h5>
              <ul className="contact-info">
                <li>
                  <i className="fa fa-map-marker-alt"></i>
                  <span>180 Cao Lỗ, Quận 8, TP. Hồ Chí Minh</span>
                </li>
                <li>
                  <i className="fa fa-envelope"></i>
                  <span>team4wood@gmail.com</span>
                </li>
                <li>
                  <i className="fa fa-phone"></i>
                  <span>+84 123 456 789</span>
                </li>
                <li>
                  <i className="fa fa-clock"></i>
                  <span>Thứ Hai - Chủ Nhật: 8:00 - 20:00</span>
                </li>
              </ul>
              <div className="subscribe-form mt-4">
                <input type="email" placeholder="Email của bạn" />
                <button type="submit"><i className="fa fa-paper-plane"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phần bản quyền */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p className="copyright">© {new Date().getFullYear()} Nhóm4 - Thứ 6 </p>
            </div>
            <div className="col-md-6">
              <div className="footer-bottom-links">
                <a href="#">Chính sách bảo mật</a>
                <a href="#">Điều khoản dịch vụ</a>
                <a href="#">Chính sách hoàn tiền</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-section {
          position: relative;
          background-color: #3E2723;
          color: rgba(255, 255, 255, 0.7);
          padding-top: 30px;
          margin-top: 80px;
        }

        .footer-curve {
          position: absolute;
          top: -100px;
          left: 0;
          width: 100%;
          height: 100px;
          overflow: hidden;
        }

        .footer-content {
          padding: 40px 0;
        }

        .footer-logo {
          margin-bottom: 20px;
        }

        .logo-icon {
          width: 45px;
          height: 45px;
          background-color: #8B4513;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 10px;
          color: white;
          font-size: 18px;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 1.3rem;
          color: white;
          line-height: 1.2;
        }

        .brand-tagline {
          font-size: 0.75rem;
          font-weight: 500;
          color: #D2B48C;
          letter-spacing: 2px;
        }

        .footer-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .social-links {
          display: flex;
          gap: 10px;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          color: #D2B48C;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background-color: #8B4513;
          color: white;
          transform: translateY(-3px);
        }

        .footer-heading {
          color: white;
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 10px;
        }

        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background-color: #8B4513;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          padding-left: 15px;
        }

        .footer-links a::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #8B4513;
          transform: translateY(-50%);
          transition: all 0.3s ease;
        }

        .footer-links a:hover {
          color: white;
          padding-left: 20px;
        }

        .footer-links a:hover::before {
          background-color: white;
          width: 8px;
          height: 8px;
        }

        .contact-info {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .contact-info li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 15px;
          font-size: 0.9rem;
        }

        .contact-info i {
          color: #8B4513;
          font-size: 16px;
          margin-right: 10px;
          margin-top: 3px;
        }

        .subscribe-form {
          position: relative;
          max-width: 300px;
        }

        .subscribe-form input {
          width: 100%;
          padding: 10px 50px 10px 15px;
          border: none;
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .subscribe-form input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .subscribe-form button {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: 45px;
          background-color: #8B4513;
          border: none;
          color: white;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .subscribe-form button:hover {
          background-color: #6B3612;
        }

        .footer-bottom {
          background-color: rgba(0, 0, 0, 0.2);
          padding: 20px 0;
          font-size: 0.85rem;
        }

        .copyright {
          margin: 0;
        }

        .footer-bottom-links {
          display: flex;
          justify-content: flex-end;
          gap: 20px;
        }

        .footer-bottom-links a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .footer-bottom-links a:hover {
          color: white;
        }

        @media (max-width: 768px) {
          .footer-bottom-links {
            justify-content: flex-start;
            margin-top: 10px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
