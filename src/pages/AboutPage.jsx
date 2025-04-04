import React from 'react'
import { Footer, Navbar } from "../components";
const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Về chúng tôi</h1>
        <hr />
        <div className="row mb-5">
          <div className="col-md-6">
            <h3>Câu chuyện của chúng tôi</h3>
            <p className="lead">
              Team 4 - Wood là cửa hàng chuyên cung cấp các sản phẩm nội thất gỗ cao cấp được thành lập năm 2024 với sứ mệnh mang đến những sản phẩm chất lượng cao, thiết kế đẹp mắt và bền bỉ theo thời gian.
            </p>
            <p>
              Với đội ngũ thợ thủ công lành nghề và kinh nghiệm nhiều năm trong ngành, chúng tôi tự hào mang đến những sản phẩm gỗ được chế tác tỉ mỉ, kết hợp giữa vẻ đẹp truyền thống và công năng hiện đại, đáp ứng nhu cầu của khách hàng hiện đại.
            </p>
            <p>
              Mỗi sản phẩm của Team 4 - Wood đều được làm từ những loại gỗ tự nhiên chất lượng cao, được tuyển chọn kỹ lưỡng và xử lý bằng công nghệ hiện đại để đảm bảo độ bền và tính thẩm mỹ theo thời gian.
            </p>
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <img src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop" alt="Xưởng sản xuất đồ gỗ" className="img-fluid rounded shadow-sm" />
          </div>
        </div>

        <hr />
        <h2 className="text-center py-4">Giá trị cốt lõi</h2>
        <div className="row mb-5">
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <i className="fa fa-gem fa-3x mb-3 text-primary"></i>
                <h4 className="card-title">Chất lượng</h4>
                <p className="card-text">Chúng tôi cam kết mang đến những sản phẩm chất lượng cao nhất, sử dụng nguyên liệu tốt nhất và quy trình sản xuất nghiêm ngặt.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <i className="fa fa-heart fa-3x mb-3 text-primary"></i>
                <h4 className="card-title">Tận tâm</h4>
                <p className="card-text">Mỗi chi tiết trong sản phẩm đều được chúng tôi chăm chút tỉ mỉ, với tình yêu và niềm đam mê với nghề.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <i className="fa fa-leaf fa-3x mb-3 text-primary"></i>
                <h4 className="card-title">Bền vững</h4>
                <p className="card-text">Chúng tôi cam kết sử dụng nguồn gỗ bền vững, góp phần bảo vệ môi trường và tài nguyên thiên nhiên.</p>
              </div>
            </div>
          </div>
        </div>

        <hr />
        <h2 className="text-center py-4">Sản phẩm của chúng tôi</h2>
        <div className="row">
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">BÀN GỖ</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">GHẾ GỖ</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">TỦ GỖ</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">KHÁC</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AboutPage