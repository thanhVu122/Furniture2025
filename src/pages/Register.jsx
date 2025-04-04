import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Footer } from "../components";
import axios from "axios";
import { toast } from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    nameUser: "",
    userName: "",
    email: "",
    password: "",
    comfrimPassword: "",
    phoneNumber: "",
    birthDay: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Kiểm tra username không chứa khoảng trắng
      if (formData.userName.includes(' ')) {
        toast.error("Tên đăng nhập không được chứa khoảng trắng");
        return;
      }

      // Kiểm tra email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Email không hợp lệ");
        return;
      }

      // Kiểm tra mật khẩu xác nhận
      if (formData.password !== formData.comfrimPassword) {
        toast.error("Mật khẩu xác nhận không khớp");
        return;
      }
    
      // Kiểm tra độ dài mật khẩu
      if (formData.password.length < 6) {
        toast.error("Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }
      
      // Kiểm tra mật khẩu có đủ mạnh
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!passwordRegex.test(formData.password)) {
        toast.error("Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số");
        return;
      }
    
      // Kiểm tra số điện thoại
      if (!/^(0|\+84)[0-9]{9,10}$/.test(formData.phoneNumber)) {
        toast.error("Số điện thoại không hợp lệ (phải bắt đầu bằng 0 hoặc +84 và có 10-11 số)");
        return;
      }

      // Format ngày sinh - nếu không có thì gửi null
      const formattedBirthDay = formData.birthDay ? new Date(formData.birthDay).toISOString() : null;

      // Chuẩn bị dữ liệu gửi đi
      const registerData = {
        NameUser: formData.nameUser.trim(),
        UserName: formData.userName.trim(),
        Email: formData.email.trim(),
        Password: formData.password,
        ComfrimPassword: formData.comfrimPassword,
        PhoneNumber: formData.phoneNumber.trim(),
        BirthDay: formattedBirthDay
      };

      console.log('Sending registration data:', registerData);

      const response = await axios({
        method: 'post',
        url: 'http://thanhvu1406-001-site1.qtempurl.com/api/Account/DangKi',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: registerData
      });

      console.log('API Response:', response.data);

      if (response.data.success) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        const errorMessage = response.data.message || "Đăng ký thất bại";
        console.error('Registration failed:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.data) {
        console.log('Error response:', error.response.data);
        
        if (typeof error.response.data === 'string') {
          toast.error(error.response.data);
        } else if (error.response.data.errors) {
          Object.values(error.response.data.errors).flat().forEach(err => {
            toast.error(err);
          });
        } else if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
        }
      } else {
        toast.error("Có lỗi xảy ra trong quá trình đăng ký");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Đăng ký</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="form my-3">
                <label htmlFor="userName" className="form-label">Tên đăng nhập</label>
                <input
                  type="text"
                  className="form-control"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Nhập tên đăng nhập (không chứa khoảng trắng)"
                  required
                />
                <small className="text-muted">Tên đăng nhập không được chứa khoảng trắng</small>
              </div>
              <div className="form my-3">
                <label htmlFor="nameUser" className="form-label">Họ tên</label>
                <input
                  type="text"
                  className="form-control"
                  id="nameUser"
                  name="nameUser"
                  value={formData.nameUser}
                  onChange={handleChange}
                  placeholder="Nhập họ tên"
                  required
                />
              </div>
              <div className="form my-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="abc@gmail.com"
                  required
                />
              </div>
              <div className="form my-3">
                <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="0xxxxxxxxx"
                  required
                />
              </div>
              <div className="form my-3">
                <label htmlFor="birthDay" className="form-label">Ngày sinh</label>
                <input
                  type="date"
                  className="form-control"
                  id="birthDay"
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleChange}
                />
              </div>
              <div className="form my-3">
                <label htmlFor="password" className="form-label">Mật khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
                <small className="form-text text-muted">
                  Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số
                </small>
              </div>
              <div className="form my-3">
                <label htmlFor="comfrimPassword" className="form-label">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  id="comfrimPassword"
                  name="comfrimPassword"
                  value={formData.comfrimPassword}
                  onChange={handleChange}
                  placeholder="Xác nhận mật khẩu"
                  required
                />
              </div>
              <div className="text-center">
                <button 
                  className="my-2 mx-auto btn btn-dark" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>
              </div>
            </form>
            <div className="text-center mt-3">
              <span>Đã có tài khoản? </span>
              <Link to="/login" className="text-decoration-underline text-info">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
