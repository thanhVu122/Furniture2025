import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BASE_URL = "http://thanhvu1406-001-site1.qtempurl.com";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/SanPham`);
        if (response.data.success) {
          setProducts(response.data.data);
          setFilteredProducts(response.data.data);
        } else {
          toast.error("Không có sản phẩm nào");
        }
      } catch (error) {
        toast.error("Lỗi khi tải sản phẩm: " + error.message);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const addProductToCart = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate('/login');
      return;
    }
    dispatch(addCart(product));
    toast.success("Đã thêm vào giỏ hàng");
  };

  const filterByCategory = (category) => {
    setActiveCategory(category);
    setFilteredProducts(category ? products.filter((item) => item.maDanhMuc === category) : products);
  };

  const formatCurrency = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price).replace("VND", "VNĐ");
  };

  // Hàm xử lý URL ảnh để tránh lỗi 404
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/default-product.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}${imagePath.startsWith("/") ? imagePath : `/uploads/${imagePath}`}`;
  };

  const LoadingSkeleton = () => {
    return (
      <>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="product-card-skeleton">
              <div className="skeleton-img"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-desc"></div>
              <div className="skeleton-price"></div>
              <div className="skeleton-buttons"></div>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="products-section">
      <div className="container py-5">
        <div className="section-heading text-center mb-5">
          <h5 className="pre-title">Bộ sưu tập</h5>
          <h2 className="section-title">Sản phẩm nội thất gỗ</h2>
          <div className="heading-line"></div>
        </div>

        <div className="category-filter text-center mb-5">
          <button 
            className={`filter-btn ${activeCategory === "" ? "active" : ""}`} 
            onClick={() => filterByCategory("")}
          >
            Tất cả
          </button>
          <button 
            className={`filter-btn ${activeCategory === "TQA" ? "active" : ""}`} 
            onClick={() => filterByCategory("TQA")}
          >
            Tủ quần áo
          </button>
          <button 
            className={`filter-btn ${activeCategory === "BLV" ? "active" : ""}`} 
            onClick={() => filterByCategory("BLV")}
          >
            Bàn
          </button>
          <button 
            className={`filter-btn ${activeCategory === "BG" ? "active" : ""}`} 
            onClick={() => filterByCategory("BG")}
          >
            Tủ nhỏ
          </button>
          <button 
            className={`filter-btn ${activeCategory === "DT" ? "active" : ""}`} 
            onClick={() => filterByCategory("DT")}
          >
            Khác
          </button>
        </div>

        <div className="row">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            filteredProducts.map((product) => (
              <div key={product.maSanPham} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div className="product-card">
                  <div className="product-image">
                    <img
                      src={getImageUrl(product.hinhAnh)}
                      alt={product.tenSanPham}
                      onError={(e) => { e.target.src = "/default-product.jpg"; }}
                    />
                    <div className="product-overlay">
                      <button 
                        className="overlay-btn add-to-cart"
                        onClick={() => addProductToCart(product)}
                      >
                        <i className="fa fa-shopping-cart"></i>
                      </button>
                      <Link to={`/product/${product.maSanPham}`} className="overlay-btn view-details">
                        <i className="fa fa-eye"></i>
                      </Link>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{product.tenSanPham}</h3>
                    <p className="product-desc">{product.mota || "Sản phẩm nội thất gỗ cao cấp"}</p>
                    <div className="product-price">{formatCurrency(product.gia)}</div>
                    <div className="product-buttons">
                      <Link to={`/product/${product.maSanPham}`} className="btn-view">Xem chi tiết</Link>
                      <button className="btn-cart" onClick={() => addProductToCart(product)}>
                        <i className="fa fa-shopping-cart me-2"></i>Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .products-section {
          padding: 40px 0;
          background-color: var(--background);
        }
        
        .section-heading {
          margin-bottom: 40px;
        }
        
        .pre-title {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #8B4513;
          margin-bottom: 0.5rem;
          position: relative;
          display: inline-block;
        }
        
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #3E2723;
          margin-bottom: 1rem;
        }
        
        .heading-line {
          width: 80px;
          height: 3px;
          background-color: #8B4513;
          margin: 0 auto;
        }
        
        .category-filter {
          margin-bottom: 30px;
        }
        
        .filter-btn {
          background: none;
          border: none;
          padding: 8px 16px;
          margin: 0 5px 10px;
          font-weight: 500;
          color: #3E2723;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .filter-btn::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background-color: #8B4513;
          transition: all 0.3s ease;
        }
        
        .filter-btn:hover::after,
        .filter-btn.active::after {
          width: calc(100% - 20px);
        }
        
        .filter-btn.active {
          font-weight: 600;
          color: #8B4513;
        }
        
        .product-card {
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .product-image {
          position: relative;
          overflow: hidden;
          padding-top: 75%; /* Aspect ratio */
        }
        
        .product-image img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.5s ease;
        }
        
        .product-card:hover .product-image img {
          transform: scale(1.1);
        }
        
        .product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(62, 39, 35, 0.2);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: all 0.3s ease;
        }
        
        .product-card:hover .product-overlay {
          opacity: 1;
        }
        
        .overlay-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 5px;
          color: #8B4513;
          font-size: 16px;
          cursor: pointer;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.3s ease;
          border: none;
        }
        
        .product-card:hover .overlay-btn {
          transform: translateY(0);
          opacity: 1;
        }
        
        .overlay-btn.add-to-cart {
          transition-delay: 0.1s;
        }
        
        .overlay-btn.view-details {
          transition-delay: 0.2s;
        }
        
        .overlay-btn:hover {
          background-color: #8B4513;
          color: white;
        }
        
        .product-info {
          padding: 20px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        
        .product-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #3E2723;
          margin-bottom: 10px;
          transition: all 0.3s ease;
        }
        
        .product-card:hover .product-title {
          color: #8B4513;
        }
        
        .product-desc {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 15px;
          flex-grow: 1;
        }
        
        .product-price {
          font-weight: 700;
          font-size: 1.1rem;
          color: #8B4513;
          margin-bottom: 15px;
        }
        
        .product-buttons {
          display: flex;
          gap: 10px;
        }
        
        .btn-view, .btn-cart {
          flex: 1;
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          text-align: center;
        }
        
        .btn-view {
          background-color: transparent;
          border: 1px solid #8B4513;
          color: #8B4513;
        }
        
        .btn-view:hover {
          background-color: rgba(139, 69, 19, 0.1);
        }
        
        .btn-cart {
          background-color: #8B4513;
          color: white;
        }
        
        .btn-cart:hover {
          background-color: #6B3612;
        }
        
        /* Skeleton Styles */
        .product-card-skeleton {
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          height: 100%;
          padding: 15px;
        }
        
        .skeleton-img {
          width: 100%;
          height: 200px;
          background-color: #f0f0f0;
          margin-bottom: 15px;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }
        
        .skeleton-title {
          width: 80%;
          height: 20px;
          background-color: #f0f0f0;
          margin-bottom: 10px;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }
        
        .skeleton-desc {
          width: 100%;
          height: 60px;
          background-color: #f0f0f0;
          margin-bottom: 15px;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }
        
        .skeleton-price {
          width: 40%;
          height: 20px;
          background-color: #f0f0f0;
          margin-bottom: 15px;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }
        
        .skeleton-buttons {
          width: 100%;
          height: 40px;
          background-color: #f0f0f0;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0.6;
          }
        }
        
        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }
          
          .product-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Products;
