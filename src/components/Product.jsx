import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const BASE_URL = "http://thanhvu1406-001-site1.qtempurl.com";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/SanPham/${id}`);
        if (response.data.success) {
          setProduct(response.data.data);
          fetchRelatedProducts(response.data.data.maDanhMuc);
        } else {
          toast.error("Không tìm thấy sản phẩm");
          navigate('/products');
        }
      } catch (error) {
        toast.error("Lỗi khi tải sản phẩm: " + error.message);
        navigate('/products');
      }
      setLoading(false);
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const fetchRelatedProducts = async (categoryId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/SanPham`);
      if (response.data.success) {
        const related = response.data.data
          .filter(item => item.maDanhMuc === categoryId && item.maSanPham !== id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const addProductToCart = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate('/login');
      return;
    }
    if (product) {
      dispatch(addCart({ ...product, quantity: quantity }));
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
    }
  };

  const formatCurrency = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price).replace("VND", "VNĐ");
  };

  // Hàm xử lý URL ảnh
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/default-product.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}${imagePath.startsWith("/") ? imagePath : `/uploads/${imagePath}`}`;
  };

  const Loading = () => {
    return (
      <div className="product-detail-skeleton">
        <div className="row">
          <div className="col-md-6">
            <div className="image-skeleton"></div>
          </div>
          <div className="col-md-6">
            <div className="title-skeleton"></div>
            <div className="price-skeleton"></div>
            <div className="desc-skeleton"></div>
            <div className="quantity-skeleton"></div>
            <div className="buttons-skeleton"></div>
          </div>
        </div>
      </div>
    );
  };

  const ShowProduct = () => {
    return (
      <div className="product-detail">
        <div className="row">
          <div className="col-md-6">
            <div className="product-image-container">
              <img 
                src={getImageUrl(product?.hinhAnh)} 
                alt={product?.tenSanPham}
                className="product-detail-image"
                onError={(e) => { e.target.src = "/default-product.jpg"; }}
              />
              <div className="product-category-badge">
                {product?.maDanhMuc === "TQA" && "Tủ quần áo"}
                {product?.maDanhMuc === "BLV" && "Bàn"}
                {product?.maDanhMuc === "BG" && "Tủ nhỏ"}
                {product?.maDanhMuc === "DT" && "Khác"}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="product-detail-content">
              <h1 className="product-title">{product?.tenSanPham}</h1>
              <div className="product-price">{formatCurrency(product?.gia)}</div>
              <div className="product-rating">
                <span>★★★★</span><span className="star-outline">★</span>
                <span className="rating-count">(10 đánh giá)</span>
              </div>
              <div className="product-description">
                {product?.mota || "Sản phẩm nội thất gỗ cao cấp thiết kế đẹp, chất lượng cao. Với sự kết hợp tinh tế giữa truyền thống và hiện đại."}
              </div>
              <div className="product-meta">
                <div className="meta-item">
                  <span className="meta-label">Mã sản phẩm:</span>
                  <span className="meta-value">{product?.maSanPham}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Tình trạng:</span>
                  <span className="meta-value in-stock">Còn hàng</span>
                </div>
              </div>
              <div className="quantity-selector">
                <span className="quantity-label">Số lượng:</span>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn" 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >−</button>
                  <input 
                    type="text" 
                    className="quantity-input" 
                    value={quantity} 
                    readOnly 
                  />
                  <button 
                    className="quantity-btn" 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                  >+</button>
                </div>
              </div>
              <div className="product-actions">
                <button className="btn-add-to-cart" onClick={addProductToCart}>
                  <i className="fa fa-shopping-cart me-2"></i>
                  Thêm vào giỏ hàng
                </button>
                <button className="btn-buy-now">
                  <i className="fa fa-bolt me-2"></i>
                  Mua ngay
                </button>
              </div>
              <div className="product-share">
                <span className="share-label">Chia sẻ:</span>
                <div className="share-buttons">
                  <a href="#" className="share-btn"><i className="fa fa-facebook"></i></a>
                  <a href="#" className="share-btn"><i className="fa fa-twitter"></i></a>
                  <a href="#" className="share-btn"><i className="fa fa-pinterest"></i></a>
                  <a href="#" className="share-btn"><i className="fa fa-instagram"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <div className="section-heading">
              <h3 className="related-title">Sản phẩm tương tự</h3>
              <div className="heading-line"></div>
            </div>
            <div className="row">
              {relatedProducts.map((item) => (
                <div key={item.maSanPham} className="col-md-3 col-sm-6 mb-4">
                  <div className="related-product-card">
                    <div className="related-product-image">
                      <img 
                        src={getImageUrl(item.hinhAnh)} 
                        alt={item.tenSanPham}
                        onError={(e) => { e.target.src = "/default-product.jpg"; }}
                      />
                      <div className="related-product-overlay">
                        <Link to={`/product/${item.maSanPham}`} className="overlay-btn">
                          <i className="fa fa-eye"></i>
                        </Link>
                      </div>
                    </div>
                    <div className="related-product-info">
                      <h4 className="related-product-title">
                        <Link to={`/product/${item.maSanPham}`}>{item.tenSanPham}</Link>
                      </h4>
                      <div className="related-product-price">{formatCurrency(item.gia)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="product-detail-page">
      <div className="container py-5">
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link> / 
          <Link to="/products"> Sản phẩm</Link> / 
          <span>{product?.tenSanPham || "Chi tiết sản phẩm"}</span>
        </div>
        {loading ? <Loading /> : <ShowProduct />}
      </div>
      <style jsx>{`
        .product-detail-page {
          background-color: var(--background);
          padding: 20px 0 60px;
        }
        
        .breadcrumb {
          margin-bottom: 30px;
          font-size: 0.9rem;
          color: #6c757d;
        }
        
        .breadcrumb a {
          color: #3E2723;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .breadcrumb a:hover {
          color: #8B4513;
        }
        
        .product-detail {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          padding: 30px;
          margin-bottom: 40px;
        }
        
        .product-image-container {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }
        
        .product-detail-image {
          width: 100%;
          border-radius: 8px;
          object-fit: cover;
          aspect-ratio: 1 / 1;
        }
        
        .product-category-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background-color: rgba(139, 69, 19, 0.8);
          color: white;
          padding: 5px 12px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .product-detail-content {
          padding-left: 20px;
        }
        
        .product-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #3E2723;
          margin-bottom: 15px;
        }
        
        .product-price {
          font-size: 1.8rem;
          font-weight: 700;
          color: #8B4513;
          margin-bottom: 15px;
        }
        
        .product-rating {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          color: #FFB74D;
          font-size: 1.1rem;
        }
        
        .star-outline {
          opacity: 0.5;
        }
        
        .rating-count {
          margin-left: 10px;
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        .product-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 20px;
        }
        
        .product-meta {
          margin-bottom: 20px;
        }
        
        .meta-item {
          display: flex;
          margin-bottom: 5px;
        }
        
        .meta-label {
          width: 120px;
          color: #6c757d;
        }
        
        .meta-value {
          font-weight: 500;
          color: #3E2723;
        }
        
        .meta-value.in-stock {
          color: #2E7D32;
        }
        
        .quantity-selector {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
        }
        
        .quantity-label {
          margin-right: 15px;
          color: #3E2723;
          font-weight: 500;
        }
        
        .quantity-controls {
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .quantity-btn {
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #3E2723;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .quantity-btn:hover:not(:disabled) {
          background-color: rgba(139, 69, 19, 0.1);
        }
        
        .quantity-btn:disabled {
          color: #ccc;
          cursor: not-allowed;
        }
        
        .quantity-input {
          width: 50px;
          height: 40px;
          border: none;
          border-left: 1px solid #ddd;
          border-right: 1px solid #ddd;
          text-align: center;
          font-weight: 500;
        }
        
        .product-actions {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
        }
        
        .btn-add-to-cart, .btn-buy-now {
          flex: 1;
          height: 50px;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .btn-add-to-cart {
          background-color: rgba(139, 69, 19, 0.1);
          color: #8B4513;
          border: 1px solid #8B4513;
        }
        
        .btn-add-to-cart:hover {
          background-color: rgba(139, 69, 19, 0.2);
        }
        
        .btn-buy-now {
          background-color: #8B4513;
          color: white;
        }
        
        .btn-buy-now:hover {
          background-color: #6B3612;
        }
        
        .product-share {
          display: flex;
          align-items: center;
          margin-top: 30px;
        }
        
        .share-label {
          margin-right: 15px;
          color: #6c757d;
        }
        
        .share-buttons {
          display: flex;
        }
        
        .share-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #f5f5f5;
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3E2723;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .share-btn:hover {
          background-color: #8B4513;
          color: white;
        }
        
        /* Related Products */
        .related-products-section {
          margin-top: 60px;
        }
        
        .section-heading {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .related-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #3E2723;
          margin-bottom: 10px;
        }
        
        .heading-line {
          width: 60px;
          height: 3px;
          background-color: #8B4513;
          margin: 0 auto;
        }
        
        .related-product-card {
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .related-product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .related-product-image {
          position: relative;
          padding-top: 100%; /* Aspect ratio 1:1 */
          overflow: hidden;
        }
        
        .related-product-image img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.5s ease;
        }
        
        .related-product-card:hover .related-product-image img {
          transform: scale(1.1);
        }
        
        .related-product-overlay {
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
        
        .related-product-card:hover .related-product-overlay {
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
          color: #8B4513;
          text-decoration: none;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.3s ease;
        }
        
        .related-product-card:hover .overlay-btn {
          transform: translateY(0);
          opacity: 1;
        }
        
        .overlay-btn:hover {
          background-color: #8B4513;
          color: white;
        }
        
        .related-product-info {
          padding: 15px;
        }
        
        .related-product-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .related-product-title a {
          color: #3E2723;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .related-product-title a:hover {
          color: #8B4513;
        }
        
        .related-product-price {
          font-weight: 700;
          color: #8B4513;
        }
        
        /* Skeleton Styles */
        .product-detail-skeleton {
          width: 100%;
          min-height: 500px;
        }
        
        .image-skeleton {
          width: 100%;
          height: 400px;
          background-color: #f0f0f0;
          border-radius: 8px;
          animation: pulse 1.5s infinite;
        }
        
        .title-skeleton {
          width: 70%;
          height: 30px;
          background-color: #f0f0f0;
          margin-bottom: 20px;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }
        
        .price-skeleton {
          width: 40%;
          height: 25px;
          background-color: #f0f0f0;
          margin-bottom: 20px;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }
        
        .desc-skeleton {
          width: 100%;
          height: 100px;
          background-color: #f0f0f0;
          margin-bottom: 25px;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }
        
        .quantity-skeleton {
          width: 60%;
          height: 40px;
          background-color: #f0f0f0;
          margin-bottom: 25px;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }
        
        .buttons-skeleton {
          width: 100%;
          height: 50px;
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
          .product-detail-content {
            padding-left: 0;
            margin-top: 30px;
          }
          
          .product-title {
            font-size: 1.5rem;
          }
          
          .product-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Product; 