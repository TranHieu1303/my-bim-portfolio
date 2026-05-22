import React, { useState } from 'react';

// 1. ĐỊNH NGHĨA DỮ LIỆU CHỨNG CHỈ (Thay đổi tên file khớp với thư mục public)
const MY_CERTIFICATES = [
  {
    id: "arc",
    title: "Autodesk Certified Professional: Revit for Architectural Design",
    issuer: "Autodesk",
    fileName: "chungchi-revit arc-autodesk.pdf"
  },
  {
    id: "mep",
    title: "Autodesk Certified Professional: Revit for MEP Design",
    issuer: "Autodesk",
    fileName: "chungchi-revit mep-autodesk.pdf"
  },
  {
    id: "struc",
    title: "Autodesk Certified Professional: Revit for Structural Design",
    issuer: "Autodesk",
    fileName: "chungchi-revit struc-autodesk.pdf"
  }
];

// Đường dẫn LinkedIn của bạn (Hãy đổi chữ 'tranminhhieu' thành ID chuẩn của bạn nếu cần)
const LINKEDIN_URL = "https://www.linkedin.com/in/tranminhhieu"; 

export default function App() {
  // Quản lý Tab hiện tại (Hồ sơ, Dự án, Quy trình, Chứng chỉ)
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'process' | 'certs'>('home');
  
  // Trạng thái đăng nhập của Admin
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '123456') { // Thay mật khẩu admin của bạn ở đây
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
    } else {
      alert('Sai mật khẩu!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased selection:bg-blue-500 selection:text-white relative">
      
      {/* THANH ĐIỀU HƯỚNG (NAVBAR) - Cố định ở trên */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo Sở Xây Dựng Cà Mau (Cần thay bằng logo SVG thực tế) */}
          <div className="flex items-center space-x-2">
            <div className="bg-red-500 text-white text-[10px] font-bold p-1 rounded-md leading-tight text-center">
              SỞ XÂY DỰNG<br/>CÀ MAU
            </div>
            <div className="text-xs border-l border-gray-300 pl-2">
              <p className="font-bold text-gray-700 text-[11px]">Trung tâm Quy hoạch và Kiểm định</p>
              <p className="text-blue-600 font-semibold text-[10px]">✦ TKQM - Trần Minh Hiếu</p>
            </div>
          </div>

          {/* Các nút Tab chức năng */}
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl text-xs font-bold">
            {['home', 'projects', 'process', 'certs'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)} 
                className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {tab === 'home' ? 'Hồ Sơ' : tab === 'projects' ? 'Dự Án' : tab === 'process' ? 'Quy Trình' : 'Chứng Chỉ'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* NỘI DUNG CHÍNH (THAY ĐỔI THEO TAB) */}
      <main className="pt-24 pb-16 max-w-6xl mx-auto px-4 z-10 relative">
        
        {/* TAB 1: HỒ SƠ CHÍNH - Giao diện gốc chuyên nghiệp */}
        {activeTab === 'home' && (
          <div className="flex flex-col items-center justify-center text-center py-12 relative min-h-[70vh]">
            
            {/* 1. KHU VỰC CÁNH TAY ROBOT 3D (Ở GIỮA, SẮC NÉT) */}
            {/* Đây là vị trí đặt hình ảnh cánh tay robot sắc nét của bạn */}
            <div className="flex justify-center items-center mb-12 relative">
              <img 
                src="/path-to-your-actual-sharp-hand-image.png" // !!! THAY BẰNG ĐƯỜNG DẪN ẢNH CÁNH TAY SẮC NÉT CỦA BẠN !!!
                alt="Cánh tay Robot 3D Chuyên Nghiệp" 
                className="w-full max-w-sm h-auto drop-shadow-2xl opacity-90 object-contain z-10"
              />
              <div className="absolute -inset-1 bg-gradient-to-t from-gray-50 via-gray-50/10 to-gray-50 z-20"></div> {/* Tạo hiệu ứng mờ nhẹ ở gốc */}
            </div>

            {/* 2. KHUNG THÔNG TIN CHỨNG CHỈ (GÓC DƯỚI TRÁI, CHUẨN VỊ TRÍ) */}
            <div className="md:absolute md:bottom-8 md:left-4 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 text-left max-w-sm w-full mt-6 md:mt-0 z-30 transition-transform hover:-translate-y-1">
              <p className="text-[10px] text-blue-600 font-extrabold mb-1.5 flex items-center">
                <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md mr-1.5">✓ Xác thực</span> 
                Autodesk Certified & BIM Specialist
              </p>
              <h3 className="text-sm font-bold text-gray-900 mb-3.5 leading-snug">
                Mô hình hóa BIM chuẩn xác & Phối hợp Revit chuyên nghiệp.
              </h3>
              
              {/* Nút bấm xem PDF gốc - Khách click vào sẽ mở ngay lập tức tab PDF đầu tiên */}
              <a 
                href={`/${MY_CERTIFICATES[0].fileName}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex w-full justify-center items-center text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl transition-colors shadow-md"
              >
                Xem PDF Gốc (Revit Arc) →
              </a>
            </div>

            {/* 3. NÚT LIÊN HỆ LINKEDIN (GÓC DƯỚI PHẢI, CHUẨN VỊ TRÍ) */}
            <div className="md:absolute md:bottom-8 md:right-4 mt-6 md:mt-0 z-30">
              <a 
                href={LINKEDIN_URL}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-bold text-white bg-[#0077b5] hover:bg-[#006297] px-5 py-2.5 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Kết nối qua LinkedIn
              </a>
            </div>
          </div>
        )}

        {/* CÁC TAB KHÁC (GIỮ NGUYÊN HOẠT ĐỘNG ỔN ĐỊNH) */}
        {/* TAB 2: DỰ ÁN */}
        {activeTab === 'projects' && (
          <div className="py-8 text-center text-gray-500">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Danh sách Dự án BIM</h2>
            <p className="text-sm">Các dự án công trình đang được cập nhật...</p>
          </div>
        )}

        {/* TAB 3: QUY TRÌNH */}
        {activeTab === 'process' && (
          <div className="py-8 text-center text-gray-500">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Quy trình Phối hợp BIM</h2>
            <p className="text-sm">Tiêu chuẩn chuyển đổi thông tin phối hợp Revit (LOD 300 - LOD 500).</p>
          </div>
        )}

        {/* TAB 4: DANH SÁCH CHỨNG CHỈ (HIỂN THỊ ĐỒNG LOẠT CHO KHÁCH) */}
        {activeTab === 'certs' && (
          <div className="py-6">
            <div className="mb-8 text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Hệ thống Chứng chỉ Chuyên ngành</h2>
              <p className="text-xs text-gray-500">Được xác thực chính thức từ Autodesk toàn cầu</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MY_CERTIFICATES.map((cert) => (
                <div key={cert.id} className="bg-white border border-gray-200/60 p-5 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="text-blue-600 mb-3 bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1.5 leading-snug">{cert.title}</h4>
                    <p className="text-[11px] text-gray-400 mb-4">Tổ chức cấp: {cert.issuer}</p>
                  </div>
                  
                  {/* Đường link mở trực tiếp file PDF tương ứng nằm trong thư mục public */}
                  <a 
                    href={`/${cert.fileName}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline flex items-center space-x-1"
                  >
                    <span>Xem bản sao PDF gốc</span>
                    <span>↗</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* NÚT VÀ FORM ĐĂNG NHẬP ADMIN (ĐỂ GÓC DƯỚI TRÁI) */}
      <footer className="fixed bottom-4 left-4 z-50">
        {!isAdminLoggedIn ? (
          <button 
            onClick={() => setShowAdminLogin(!showAdminLogin)} 
            className="text-[10px] font-bold text-gray-400 hover:text-gray-600 bg-white/80 px-2 py-1 rounded border border-gray-200 shadow-sm"
          >
            Quản trị
          </button>
        ) : (
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
            ✓ Đã đăng nhập Admin
          </span>
        )}

        {showAdminLogin && (
          <form onSubmit={handleLogin} className="absolute bottom-8 left-0 bg-white p-3 rounded-xl shadow-xl border border-gray-200 w-48 flex flex-col space-y-2">
            <input 
              type="password" 
              placeholder="Nhập mã đăng nhập..." 
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="text-xs border p-1.5 rounded-lg w-full focus:outline-blue-500"
            />
            <div className="flex space-x-1 text-[11px]">
              <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-1 rounded-md">Vào</button>
              <button type="button" onClick={() => setShowAdminLogin(false)} className="bg-gray-100 text-gray-600 py-1 px-2 rounded-md">Hủy</button>
            </div>
          </form>
        )}
      </footer>
    </div>
  );
}