import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { Link, useParams, useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { Footer, Navbar } from "../components";
import toast from "react-hot-toast";

const BASE_URL = "http://thanhvu1406-001-site1.qtempurl.com";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${BASE_URL}/api/SanPham/${id}`);
        if (data.success) {
          setProduct(data.data);

          const { data: similarData } = await axios.get(`${BASE_URL}/api/SanPham`, {
            params: { category: data.data.maDanhMuc },
          });

          if (similarData.success) {
            setSimilarProducts(similarData.data);
          }
        }
      } catch (error) {
        toast.error("Lỗi khi tải sản phẩm: " + error.message);
      }
      setLoading(false);
      setLoading2(false);
    };
    getProduct();
  }, [id]);

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

  const formatPrice = (price) => new Intl.NumberFormat("vi-VN", {
    style: "currency", currency: "VND", minimumFractionDigits: 0
  }).format(price).replace("VND", "VNĐ");

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return "/default-product.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}${imagePath.startsWith("/") ? imagePath : `/uploads/${imagePath}`}`;
  };

  if (loading) {
    return (
      <div className="container text-center my-5">
        <Skeleton height={400} width={400} />
        <Skeleton height={30} width={250} />
        <Skeleton height={90} />
        <Skeleton height={50} width={120} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container my-5 py-2">
        <div className="row">
          <div className="col-md-6 text-center">
            <img
              className="card-img-top p-3"
              src={getFullImageUrl(product.hinhAnh)}
              alt={product.tenSanPham}
              height={250}
              onError={(e) => { e.target.src = "/default-product.jpg"; }}
            />
          </div>
          <div className="col-md-6 py-5">
            <h4 className="text-uppercase text-muted">{product.maDanhMuc}</h4>
            <h1 className="display-5">{product.tenSanPham}</h1>
            <h3 className="display-6 my-4 text-danger">{formatPrice(product.gia)}</h3>
            <p className="lead">{product.mota || "Không có mô tả"}</p>
            <button className="btn btn-outline-dark" onClick={() => addProductToCart(product)}>
              Thêm vào giỏ hàng
            </button>
            <Link to="/cart" className="btn btn-dark mx-3">
              Đến giỏ hàng
            </Link>
          </div>
        </div>

        <div className="row my-5 py-5">
          <h2 className="text-center">Có thể bạn sẽ thích</h2>
          {loading2 ? <Skeleton height={200} width={200} count={4} /> : (
            <Marquee pauseOnHover={true} speed={50}>
              {similarProducts.map((item) => (
                <div key={item.maSanPham} className="card mx-4 text-center" style={{ width: "250px" }}>
                  <img className="card-img-top p-3"
                    src={getFullImageUrl(item.hinhAnh)}
                    alt={item.tenSanPham} height={300}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.tenSanPham.substring(0, 20)}...</h5>
                    <p className="lead text-danger">{formatPrice(item.gia)}</p>
                  </div>
                  <div className="card-body">
                    <Link to={`/product/${item.maSanPham}`} className="btn btn-outline-dark m-1">
                      Xem chi tiết
                    </Link>
                    <button className="btn btn-dark m-1" onClick={() => addProductToCart(item)}>
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
            </Marquee>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
