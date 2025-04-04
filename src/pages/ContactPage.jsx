import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Giả lập gửi email
    setTimeout(() => {
      toast.success("Tin nhắn của bạn đã được gửi thành công!");
      setFormData({ name: "", email: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Liên hệ chúng tôi</h1>
        <hr />
        <div className="row mb-5">
          <div className="col-md-6 mb-4">
            <h3>Thông tin liên hệ</h3>
            <div className="d-flex mb-4">
              <i className="fa fa-map-marker-alt mt-1 me-3 text-primary" style={{ fontSize: "1.5rem" }}></i>
              <div>
                <h5 className="mb-1">Địa chỉ</h5>
                <p>180 Cao Lỗ, Quận 8, TP. Hồ Chí Minh</p>
              </div>
            </div>
            <div className="d-flex mb-4">
              <i className="fa fa-phone-alt mt-1 me-3 text-primary" style={{ fontSize: "1.5rem" }}></i>
              <div>
                <h5 className="mb-1">Điện thoại</h5>
                <p>+84 123 456 789</p>
              </div>
            </div>
            <div className="d-flex mb-4">
              <i className="fa fa-envelope mt-1 me-3 text-primary" style={{ fontSize: "1.5rem" }}></i>
              <div>
                <h5 className="mb-1">Email</h5>
                <p>team4wood@gmail.com</p>
              </div>
            </div>
            <div className="d-flex mb-4">
              <i className="fa fa-clock mt-1 me-3 text-primary" style={{ fontSize: "1.5rem" }}></i>
              <div>
                <h5 className="mb-1">Giờ làm việc</h5>
                <p>Thứ Hai - Thứ Bảy: 8:00 - 20:00<br />Chủ Nhật: 9:00 - 18:00</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="card-title mb-4">Gửi tin nhắn</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Họ tên</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nhập tên của bạn"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="abc@gmail.com"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">Tin nhắn</label>
                    <textarea
                      rows={5}
                      className="form-control"
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Nhập tin nhắn"
                      required
                    />
                  </div>
                  <div className="text-center">
                    <button
                      className="btn btn-primary px-4"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Đang gửi..." : "Gửi tin nhắn"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card mb-4 shadow-sm">
              <div className="card-body p-0">
                <h3 className="card-title p-3 mb-0">Vị trí của chúng tôi</h3>
                <div className="ratio ratio-16x9">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9594525532666!2d106.6755017758305!3d10.737608559906896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fad141cc503%3A0x588cd490c8ebd678!2zMTgwIENhbyBM4buXLCBQaMaw4budbmcgNCwgUXXhuq1uIDgsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1743688749663!5m2!1svi!2s" 
                    width="600" 
                    height="450" 
                    style={{ border: 0 }}
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                  </iframe>
                  {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9594525532666!2d106.6755017758305!3d10.737608559906896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fad141cc503%3A0x588cd490c8ebd678!2zMTgwIENhbyBM4buXLCBQaMaw4budbmcgNCwgUXXhuq1uIDgsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1743688749663!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
