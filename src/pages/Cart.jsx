import React, { useEffect } from 'react';
import { Footer, Navbar } from '../components';
import { useSelector, useDispatch } from 'react-redux';
import { addCart, delCart } from '../redux/action';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Kiểm tra đăng nhập khi vào trang giỏ hàng
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem giỏ hàng!");
      navigate('/login');
    }
  }, [navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price).replace('VND', 'VNĐ');
  };

  const EmptyCart = () => {
    return (
      <div className="container text-center py-5">
        <h4 className="p-3 display-5">Giỏ hàng trống</h4>
        <Link to="/" className="btn btn-outline-dark mx-4">
          <i className="fa fa-arrow-left"></i> Tiếp tục mua sắm
        </Link>
      </div>
    );
  };

  const addItem = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm!");
      navigate('/login');
      return;
    }
    dispatch(addCart(product));
  };

  const removeItem = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Vui lòng đăng nhập để xóa sản phẩm!");
      navigate('/login');
      return;
    }
    dispatch(delCart(product));
  };

  const ShowCart = () => {
    let subtotal = state.items.reduce((sum, item) => sum + item.gia * item.qty, 0);
    let shipping = subtotal > 500000 ? 0 : 30000;
    let totalItems = state.items.reduce((sum, item) => sum + item.qty, 0);

    return (
      <div className="container py-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-header py-3">
                <h5 className="mb-0">Danh sách sản phẩm</h5>
              </div>
              <div className="card-body">
                {state.items.map((item) => (
                  <div key={item.maSanPham} className="row d-flex align-items-center mb-3">
                    <div className="col-lg-3">
                      <img 
                        src={item.hinhAnh.startsWith('/') ? 
                          `http://thanhvu1406-001-site1.qtempurl.com${item.hinhAnh}` : 
                          `http://thanhvu1406-001-site1.qtempurl.com/uploads/${item.hinhAnh}`
                        } 
                        alt={item.tenSanPham} 
                        width={100} 
                        height={75}
                        onError={(e) => { e.target.src = "/default-product.jpg"; }}
                      />
                    </div>
                    <div className="col-lg-5">
                      <p><strong>{item.tenSanPham}</strong></p>
                    </div>
                    <div className="col-lg-4">
                      <div className="d-flex align-items-center">
                        <button className="btn px-3" onClick={() => removeItem(item)}>-</button>
                        <span className="mx-3">{item.qty}</span>
                        <button className="btn px-3" onClick={() => addItem(item)}>+</button>
                      </div>
                      <p><strong>{item.qty} x {formatPrice(item.gia)}</strong></p>
                    </div>
                    <hr className="my-3" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-header py-3 bg-light">
                <h5 className="mb-0">Đơn hàng</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Sản phẩm ({totalItems})
                    <span>{formatPrice(subtotal)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    Phí vận chuyển
                    <span>{formatPrice(shipping)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                    <strong>Tổng tiền</strong>
                    <strong>{formatPrice(subtotal + shipping)}</strong>
                  </li>
                </ul>
                <Link to="/checkout" className="btn btn-dark btn-lg btn-block">
                  Đến thanh toán
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Giỏ hàng</h1>
        <hr />
        {state.items.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Cart;