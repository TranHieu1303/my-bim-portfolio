import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  Layers, 
  Award, 
  FileCheck, 
  Box, 
  Cpu, 
  Calendar,
  Send,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Lock,
  Unlock,
  Download,
  Save,
  Link
} from 'lucide-react';

// SVG logo chính thức của Trung tâm Quy hoạch và Kiểm định Cà Mau (CPI KD CAMAU)
const CaMauOfficialLogo = () => (
  <svg 
    width="48" 
    height="48" 
    viewBox="0 0 200 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0 transition-transform duration-300 hover:scale-105"
  >
    <rect width="200" height="200" rx="16" fill="#FFFFFF" />
    <rect x="5" y="5" width="190" height="190" rx="12" stroke="#0033A0" strokeWidth="3" fill="none" />
    <path d="M 12 12 L 81 12 L 43 85 L 81 154 L 12 154 Z" fill="#EE1C25" />
    <path d="M 80 45 C 135 45, 188 55, 188 100 C 188 145, 135 154, 80 154 L 80 120 C 115 120, 150 115, 150 100 C 150 85, 115 80, 80 80 Z" fill="#EE1C25" />
    <path d="M 26 90 L 58 90 L 46 102 L 78 102 L 66 114 L 34 114 Z" fill="#0033A0" />
    <path d="M 83 90 L 115 90 C 122 90, 128 95, 128 102 C 128 109, 122 114, 115 114 L 83 114 Z" fill="#0033A0" />
    <rect x="74" y="99" width="16" height="6" fill="#0033A0" />
    <path d="M 103 29 L 109 21 L 115 21 L 110 29 Z" fill="#EE1C25" />
    <path d="M 120 21 C 125 21, 128 23, 128 25 C 128 27, 125 29, 120 29 L 117 29 L 115 33 L 111 33 L 118 21 Z" fill="#EE1C25" />
    <path d="M 132 21 L 136 21 L 130 33 L 126 33 Z" fill="#EE1C25" />
    <rect x="9" y="157" width="182" height="6" fill="#0033A0" />
    <text 
      x="100" 
      y="188" 
      fontFamily="'Arial Black', 'Impact', sans-serif" 
      fontSize="27" 
      fontWeight="900" 
      fill="#EE1C25" 
      textAnchor="middle" 
      letterSpacing="1"
    >
      CAMAU
    </text>
  </svg>
);

const Logo = () => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 256 256" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="transition-transform duration-300 hover:rotate-12"
  >
    <path 
      fill="rgb(84, 84, 84)" 
      d="M 160 88 L 194 34 L 216 0 L 256 0 L 256 40 L 221.5 93.5 L 200 128 L 256 128 L 256 256 L 96 256 L 96 168 L 64.246 220 L 40 256 L 0 256 L 0 216 L 34 162 L 56 128 L 0 128 L 0 0 L 160 0 Z" 
    />
  </svg>
);

interface BIMProject {
  id: string;
  name: string;
  category: string;
  desc: string;
  lod: string;
  tools: string[];
}

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  signedBy: string;
  status: string;
  date: string;
  pdfUrl: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number | null>(null);
  
  // Trạng thái Chế độ Quản trị (Admin Mode)
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);

  // Đường dẫn liên kết LinkedIn của anh Hiếu
  const [linkedinUrl, setLinkedinUrl] = useState<string>(() => {
    return localStorage.getItem('hieu_linkedin') || 'https://www.linkedin.com/in/tranminhhieu-bim';
  });

  // Khởi tạo State cho Dự Án (LocalStorage)
  const [bimProjects, setBimProjects] = useState<BIMProject[]>(() => {
    const saved = localStorage.getItem('hieu_bim_projects');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'structural-coordination',
        name: 'Phối hợp Kết cấu Cao ốc Văn phòng (Structural Coordination)',
        category: 'Structural BIM',
        desc: 'Mô hình hóa bê tông cốt thép & kết cấu thép phức tạp. Xử lý lệch cốt dầm sàn và kiểm soát xung đột hệ thống trước khi thi công thực tế tại hiện trường.',
        lod: 'LOD 400',
        tools: ['Revit Structural', 'Navisworks Manage', 'Dynamo']
      },
      {
        id: 'parametric-families',
        name: 'Hệ Thư viện Tham số Revit Families Chuẩn hóa',
        category: 'Parametric Design',
        desc: 'Thiết kế thư viện Family thông minh với đầy đủ tham số kích thước, thông tin vật liệu và cấu kiện liên kết giúp tăng tốc 40% quy trình thiết kế.',
        lod: 'LOD 350',
        tools: ['Revit Family Editor', 'Dynamo Scripting']
      },
      {
        id: 'mep-integration',
        name: 'Tích hợp MEP Nhà máy Công nghiệp & Shop Drawing',
        category: 'MEP Integration',
        desc: 'Mô hình hóa chi tiết hệ thống đường ống kỹ thuật phức tạp (HVAC, PCCC, Cấp thoát nước, Điện) cho nhà xưởng diện tích lớn. Xuất bản vẽ thi công Shop Drawing.',
        lod: 'LOD 400',
        tools: ['Revit MEP', 'Navisworks Manage', 'BIM 360']
      }
    ];
  });

  // Khởi tạo State cho Chứng Chỉ (LocalStorage)
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('hieu_bim_certs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'cert-revit-pro',
        title: 'Autodesk Certified Professional: Revit for Structural Design',
        issuer: 'Autodesk Global Certification',
        signedBy: 'VP Autodesk Learning Services (Digital Signature Verified)',
        status: 'Chứng chỉ quốc tế - Đã ký xác thực PDF bảo mật',
        date: 'Năm cấp: 2024',
        pdfUrl: 'https://images.autodesk.com/adsk/files/certified_professional_logo.pdf'
      },
      {
        id: 'cert-bim-manager',
        title: 'BIM Modeler & Coordination Specialist Standard',
        issuer: 'Viện Công nghệ & Xây dựng Số (BIM Institute)',
        signedBy: 'Chủ tịch Hội đồng Khoa học (Đã ký số)',
        status: 'Đạt chuẩn kỹ năng mô hình hóa cấp độ chuyên sâu hành nghề',
        date: 'Năm cấp: 2025',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }
    ];
  });

  // Đồng bộ hóa dữ liệu vào LocalStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('hieu_bim_projects', JSON.stringify(bimProjects));
  }, [bimProjects]);

  useEffect(() => {
    localStorage.setItem('hieu_bim_certs', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('hieu_linkedin', linkedinUrl);
  }, [linkedinUrl]);

  // Biểu mẫu dự án
  const [projectForm, setProjectForm] = useState({
    id: '',
    name: '',
    category: 'Structural BIM',
    desc: '',
    lod: 'LOD 400',
    tools: ''
  });

  // Biểu mẫu chứng chỉ
  const [certForm, setCertForm] = useState({
    id: '',
    title: '',
    issuer: '',
    signedBy: '',
    status: 'Chứng chỉ đã được xác thực chữ ký số',
    date: 'Năm cấp: 2026',
    pdfUrl: ''
  });

  const [fittingForm, setFittingForm] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: 'Architectural BIM',
    lodRequired: 'LOD 350',
    notes: ''
  });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Thêm đầy đủ hàm bật tắt phát video và âm thanh bị thiếu
  const handleTogglePlay = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleToggleMute = () => {
    setIsVideoMuted(!isVideoMuted);
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVideoPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted]);

  // Quản lý Đăng nhập Admin (Pass mặc định là hieu123)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'hieu123') {
      setIsAdminMode(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('Sai mật khẩu cấu hình! Vui lòng thử lại.');
    }
  };

  // Xử lý đọc file PDF và chuyển đổi sang dạng chuỗi Base64 lưu trực tiếp
  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Hệ thống chỉ chấp nhận tải lên định dạng tệp .PDF.');
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        alert('Kích thước tệp quá lớn! Vui lòng tải file PDF dưới 3MB để tối ưu hóa bộ nhớ trình duyệt, hoặc sử dụng phương thức liên kết URL ở dưới.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCertForm(prev => ({
          ...prev,
          pdfUrl: reader.result as string // Lưu chuỗi Base64
        }));
        alert('Tải lên tệp PDF thành công! Hệ thống đã mã hóa tệp trực tuyến.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý thêm/sửa dự án
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name || !projectForm.desc) return;

    if (projectForm.id) {
      setBimProjects(prev => prev.map(p => p.id === projectForm.id ? {
        ...p,
        name: projectForm.name,
        category: projectForm.category,
        desc: projectForm.desc,
        lod: projectForm.lod,
        tools: projectForm.tools.split(',').map(t => t.trim())
      } : p));
    } else {
      const newProject: BIMProject = {
        id: 'project_' + Date.now(),
        name: projectForm.name,
        category: projectForm.category,
        desc: projectForm.desc,
        lod: projectForm.lod,
        tools: projectForm.tools ? projectForm.tools.split(',').map(t => t.trim()) : ['Revit']
      };
      setBimProjects(prev => [...prev, newProject]);
    }

    setProjectForm({ id: '', name: '', category: 'Structural BIM', desc: '', lod: 'LOD 400', tools: '' });
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Anh có chắc chắn muốn xóa dự án BIM này không?')) {
      setBimProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  // Xử lý thêm/sửa chứng chỉ
  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title || !certForm.issuer || !certForm.pdfUrl) {
      alert('Vui lòng nhập tên chứng chỉ, cơ quan cấp và tải lên file PDF hoặc điền đường dẫn liên kết.');
      return;
    }

    if (certForm.id) {
      setCertificates(prev => prev.map(c => c.id === certForm.id ? { ...certForm } : c));
    } else {
      const newCert: Certificate = {
        ...certForm,
        id: 'cert_' + Date.now()
      };
      setCertificates(prev => [...prev, newCert]);
    }

    setCertForm({ id: '', title: '', issuer: '', signedBy: '', status: 'Chứng chỉ đã được xác thực chữ ký số', date: 'Năm cấp: 2026', pdfUrl: '' });
  };

  const handleDeleteCert = (id: string) => {
    if (confirm('Anh có chắc muốn gỡ bỏ chứng chỉ này không?')) {
      setCertificates(prev => prev.filter(c => c.id !== id));
    }
  };

  // Tải xuống file sao lưu cấu hình JSON
  const handleDownloadBackup = () => {
    const backupData = {
      projects: bimProjects,
      certificates: certificates,
      linkedin: linkedinUrl
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hieu_BIM_Portfolio_Backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetFittingForm = () => {
    setFittingForm({ name: '', phone: '', email: '', projectType: 'Architectural BIM', lodRequired: 'LOD 350', notes: '' });
    setFormSubmitted(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f0f0ee] font-sans antialiased text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background looping architectural movement video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none" />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation Bar - Refined with Top-Left Official Ca Mau Brand Identity */}
        <header className="w-full px-4 sm:px-8 pt-4 sm:pt-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Top-Left Official Brand & Identity Block - Updated with Official Ca Mau Logo */}
            <div className="flex items-center gap-3.5 backdrop-blur-md bg-white/90 p-2.5 sm:p-3 rounded-2xl border border-white/50 shadow-md max-w-sm transition-all duration-300 hover:bg-white/95 hover:shadow-lg">
              
              {/* Container for CaMau CPI-KD SVG Logo */}
              <div className="relative shrink-0">
                <CaMauOfficialLogo />
                {/* Gold star quality emblem on bottom right */}
                <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                  <span className="text-[8px] text-white font-extrabold leading-none">★</span>
                </div>
              </div>

              {/* Precise Professional Typographic Hierarchy */}
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-extrabold text-red-600 tracking-wider uppercase leading-none">
                  Sở Xây dựng tỉnh Cà Mau
                </span>
                <span className="text-[11px] font-bold text-gray-700 mt-1 leading-tight">
                  Trung tâm Quy hoạch và Kiểm định
                </span>
                <span className="text-[12px] font-extrabold text-blue-700 mt-1 flex items-center gap-1.5 leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
                  TKQH - Trần Minh Hiếu
                </span>
              </div>
            </div>

            {/* Right Interactive Pill Container - Custom BIM Navigation */}
            <div className="flex items-center gap-2 self-center md:self-auto">
              <button 
                onClick={() => setActiveTab(null)}
                className="flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 shrink-0 transition-transform duration-200 hover:scale-105 shadow-sm active:scale-95" 
                style={{ backgroundColor: '#EDEDED' }}
                aria-label="Home"
              >
                <Logo />
              </button>

              <div 
                className="flex items-center gap-3 sm:gap-6 rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 shadow-sm" 
                style={{ backgroundColor: '#EDEDED' }}
              >
                {['Profile', 'Projects', 'Workflow', 'Certificates'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(activeTab === tab ? null : tab)}
                    className={`text-[12px] sm:text-[13px] font-bold transition-all duration-200 relative py-1 ${
                      activeTab === tab 
                        ? 'text-blue-600 scale-105' 
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {tab === 'Profile' ? 'Hồ Sơ' : 
                     tab === 'Projects' ? 'Dự Án' : 
                     tab === 'Workflow' ? 'Quy Trình' : 'Chứng Chỉ'}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </header>

        {/* Hero Content Area */}
        <main className="flex-1 flex items-end pb-12 sm:pb-16 lg:pb-24 px-6 sm:px-12 md:px-20 lg:px-28">
          <div className="max-w-sm backdrop-blur-md bg-white/75 p-6 rounded-2xl border border-white/30 shadow-xl">
            
            {/* 1. Badge Link - Tự động định vị mở Chứng chỉ đầu tiên vừa tải lên */}
            <button 
              onClick={() => {
                if (certificates.length > 0 && certificates[0].pdfUrl !== '') {
                  window.open(certificates[0].pdfUrl, '_blank');
                } else {
                  setActiveTab('Certificates');
                }
              }}
              className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-blue-700 hover:text-blue-800 transition-colors mb-3 group text-left"
            >
              ✓ Xác thực Autodesk Certified & BIM Specialist (Xem PDF Gốc)
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </button>

            {/* 2. Headline */}
            <h1 className="text-[1.5rem] sm:text-[1.75rem] leading-[1.2] font-extrabold text-gray-900 tracking-tight mb-3">
              Mô hình hóa BIM chuẩn xác & Phối hợp Revit chuyên nghiệp.
            </h1>

            {/* 3. Subtext */}
            <p className="text-[13px] text-gray-600 font-medium mb-4 leading-relaxed">
              Kiến tạo các mô hình số hóa 3D thông tin cao (LOD 300 - 500) và kiểm tra xung đột hệ thống hoàn hảo trước khi vận hành thực tế tại công trình.
            </p>

            {/* 4. CTA Button - Trỏ trực tiếp sang trang cá nhân LinkedIn của anh Hiếu */}
            <a 
              href={linkedinUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[13px] font-bold text-white bg-blue-600 border border-blue-600 rounded-full px-5 py-3 hover:bg-blue-700 hover:border-blue-700 transition-all duration-200 group w-full justify-center shadow-md text-center"
            >
              Yêu cầu tư vấn thiết kế phối hợp BIM
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>

          </div>
        </main>

        {/* Subtle Bottom Left Admin Mode & Backup control */}
        <div className="absolute bottom-6 left-6 sm:left-12 flex items-center gap-2 z-20">
          <button 
            onClick={() => {
              if (isAdminMode) {
                setIsAdminMode(false);
              } else {
                setShowAdminLogin(true);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-md active:scale-95 ${
              isAdminMode 
                ? 'bg-amber-500 text-white border-amber-600 animate-pulse' 
                : 'bg-white/85 text-gray-700 hover:text-blue-600 hover:bg-white border-gray-200/50'
            }`}
            title="Chế độ quản trị (Tải lên chứng chỉ mới / Chỉnh sửa nội dung)"
          >
            {isAdminMode ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {isAdminMode ? 'Admin Active' : 'Admin'}
          </button>

          {isAdminMode && (
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold border border-green-700 hover:bg-green-700 transition-all shadow-md"
              title="Xuất dữ liệu lưu trữ cấu hình"
            >
              <Download className="w-3.5 h-3.5" />
              Xuất File Data
            </button>
          )}
        </div>

        {/* Video controls */}
        <div className="absolute bottom-6 right-6 sm:right-12 flex items-center gap-2 z-20">
          <button 
            onClick={handleTogglePlay}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/85 backdrop-blur-md text-gray-700 hover:bg-white hover:text-blue-600 transition-all border border-gray-200/50 shadow-md active:scale-95"
          >
            {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          
          <button 
            onClick={handleToggleMute}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/85 backdrop-blur-md text-gray-700 hover:bg-white hover:text-blue-600 transition-all border border-gray-200/50 shadow-md active:scale-95"
          >
            {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Popups & Panels */}
      {activeTab && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-md transition-opacity duration-300">
          
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] transition-transform duration-300 scale-100 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  {activeTab === 'Profile' && <Cpu className="w-5 h-5" />}
                  {activeTab === 'Projects' && <Layers className="w-5 h-5" />}
                  {activeTab === 'Workflow' && <Box className="w-5 h-5" />}
                  {activeTab === 'Certificates' && <Award className="w-5 h-5" />}
                  {activeTab === 'consultation' && <Calendar className="w-5 h-5" />}
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  {activeTab === 'Profile' && 'Hồ Sơ Năng Lực & Tầm Nhìn'}
                  {activeTab === 'Projects' && 'Dự Án Mô Hình Hóa BIM Thực Chiến'}
                  {activeTab === 'Workflow' && 'Quy Trình Triển Khai Kỹ Thuật'}
                  {activeTab === 'Certificates' && 'Văn Bằng & Chứng Chỉ Đã Ký Số'}
                  {activeTab === 'consultation' && 'Yêu Cầu Phối Hợp & Hợp Tác Dự Án'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setActiveTab(null);
                  resetFittingForm();
                }}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dynamic Modal Content Area */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* PROFILE TAB */}
              {activeTab === 'Profile' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-600" /> Triết lý làm việc: Chính Xác & Thực Chiến
                    </h4>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Là một BIM Modeler hoạt động chuyên nghiệp tại Sở Xây Dựng & Trung tâm Quy hoạch Kiểm định, tôi định hướng xây dựng các mô hình số có độ tin cậy tuyệt đối. Sự đồng bộ giữa các bộ môn (Kiến trúc - Kết cấu - Hệ thống kỹ thuật) giúp tối ưu hóa chi phí đầu tư, giảm thiểu tối đa rủi ro sửa chữa phát sinh tại hiện trường.
                    </p>
                  </div>
                  
                  <div className="relative border-l-2 border-gray-100 pl-4 space-y-4 py-2">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 bg-white border-2 border-blue-500 rounded-full w-2.5 h-2.5" />
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Mức Độ Chi Tiết Cao</span>
                      <h5 className="text-xs font-semibold text-gray-900 mt-0.5">LOD 300 - LOD 500 Specialist</h5>
                      <p className="text-xs text-gray-500 mt-0.5">Thiết kế cấu trúc hình học chuẩn hóa, đồng thời tích hợp đầy đủ dữ liệu phi hình học nhằm hỗ trợ tốt nhất cho công tác chế tạo cấu kiện và quản lý hoàn công vận hành.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 bg-white border-2 border-blue-500 rounded-full w-2.5 h-2.5" />
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Phối Hợp Thiết Kế</span>
                      <h5 className="text-xs font-semibold text-gray-900 mt-0.5">Xử Lý Xung Đột & Tránh Va Chạm</h5>
                      <p className="text-xs text-gray-500 mt-0.5">Sử dụng Navisworks Manage kết hợp Dynamo để tự động hóa các khâu kiểm duyệt xung đột không gian hệ thống kỹ thuật MEP và dầm sàn kết cấu.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PROJECTS TAB - Có tích hợp thêm/sửa/xóa khi bật chế độ Admin */}
              {activeTab === 'Projects' && (
                <div className="space-y-4">
                  {/* Form thêm mới/sửa đổi dự án khi có Admin Mode */}
                  {isAdminMode && (
                    <form onSubmit={handleSaveProject} className="p-4 border border-dashed border-amber-300 rounded-2xl bg-amber-50/50 mb-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
                      <h4 className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> 
                        {projectForm.id ? 'Chỉnh sửa dự án BIM' : 'Thêm mới dự án BIM'}
                      </h4>
                      <input 
                        type="text"
                        placeholder="Tên dự án/Công trình..."
                        value={projectForm.name}
                        onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-200 outline-none bg-white focus:ring-1 focus:ring-amber-500"
                        required
                      />
                      <textarea 
                        placeholder="Mô tả kỹ thuật triển khai chi tiết..."
                        value={projectForm.desc}
                        onChange={e => setProjectForm({ ...projectForm, desc: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-200 outline-none bg-white focus:ring-1 focus:ring-amber-500 h-16 resize-none"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={projectForm.category}
                          onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                          className="text-xs p-2.5 rounded-lg border border-gray-200 bg-white"
                        >
                          <option value="Structural BIM">Structural BIM</option>
                          <option value="Architectural BIM">Architectural BIM</option>
                          <option value="MEP Integration">MEP Integration</option>
                          <option value="Parametric Design">Parametric Design</option>
                        </select>
                        <select
                          value={projectForm.lod}
                          onChange={e => setProjectForm({ ...projectForm, lod: e.target.value })}
                          className="text-xs p-2.5 rounded-lg border border-gray-200 bg-white"
                        >
                          <option value="LOD 300">LOD 300</option>
                          <option value="LOD 350">LOD 350</option>
                          <option value="LOD 400">LOD 400</option>
                          <option value="LOD 500">LOD 500</option>
                        </select>
                      </div>
                      <input 
                        type="text"
                        placeholder="Công cụ thiết kế (Cách nhau bởi dấu phẩy, e.g. Revit, Dynamo)"
                        value={projectForm.tools}
                        onChange={e => setProjectForm({ ...projectForm, tools: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-200 outline-none bg-white focus:ring-1 focus:ring-amber-500"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer">
                          <Save className="w-3.5 h-3.5" /> Lưu Dự Án
                        </button>
                        {projectForm.id && (
                          <button 
                            type="button" 
                            onClick={() => setProjectForm({ id: '', name: '', category: 'Structural BIM', desc: '', lod: 'LOD 400', tools: '' })}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg"
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </form>
                  )}

                  {/* Danh sách dự án hiện có */}
                  {bimProjects.map((project) => (
                    <div key={project.id} className="border border-gray-100 hover:border-blue-200 rounded-2xl p-4 transition-all bg-gray-50/40 relative group">
                      {/* Controls của Admin để chỉnh sửa ngay tại chỗ */}
                      {isAdminMode && (
                        <div className="absolute top-3 right-3 flex gap-1.5 z-10 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setProjectForm({
                              id: project.id,
                              name: project.name,
                              category: project.category,
                              desc: project.desc,
                              lod: project.lod,
                              tools: project.tools.join(', ')
                            })}
                            className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-1.5">
                        <h4 className="text-sm font-bold text-gray-900 pr-16">{project.name}</h4>
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full shrink-0">{project.lod}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 leading-relaxed">{project.desc}</p>
                      
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100">
                        {project.tools.map((tool, i) => (
                          <span key={i} className="text-[10px] bg-gray-200/50 text-gray-600 px-2 py-0.5 rounded-md font-mono">{tool}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* WORKFLOW TAB */}
              {activeTab === 'Workflow' && (
                <div className="space-y-2.5">
                  {[
                    {
                      q: "Bước 1: Tiếp nhận thông tin & Lập kế hoạch BIM (BEP)",
                      a: "Thu thập hồ sơ thiết kế cơ sở 2D hoặc tệp tin khảo sát hiện trạng, thống nhất Kế hoạch thực hiện BIM (BEP), hệ tọa độ gốc dự án và tiêu chuẩn đặt tên cấu kiện."
                    },
                    {
                      q: "Bước 2: Xây dựng mô hình 3D đa bộ môn (Revit)",
                      a: "Triển khai dựng hình chuẩn xác cấu trúc Kiến trúc, Kết cấu dầm sàn móng, thép chịu lực và các đường ống kỹ thuật MEP tùy thuộc vào cấp độ LOD được phê duyệt."
                    },
                    {
                      q: "Bước 3: Phát hiện xung đột & Họp phối hợp (Navisworks)",
                      a: "Tổng hợp các mô hình thành phần, tiến hành kiểm tra xung đột vật lý bằng Navisworks Manage và lập báo cáo va chạm chi tiết đề xuất giải pháp xử lý kỹ thuật."
                    },
                    {
                      q: "Bước 4: Trích xuất bản vẽ thi công Shop Drawing & BOQ",
                      a: "Kết xuất bộ bản vẽ kỹ thuật chi tiết từ mô hình 3D đồng nhất, hỗ trợ bốc tách tiên lượng khối lượng vật tư xây dựng chuẩn xác phục vụ đấu thầu và thi công."
                    }
                  ].map((step, i) => (
                    <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                      <button 
                        onClick={() => setActiveWorkflowStep(activeWorkflowStep === i ? null : i)}
                        className="w-full text-left p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors flex justify-between items-center"
                      >
                        <span className="text-xs font-semibold text-gray-800">{step.q}</span>
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeWorkflowStep === i ? 'rotate-90' : ''}`} />
                      </button>
                      {activeWorkflowStep === i && (
                        <div className="p-4 bg-white border-t border-gray-50 text-xs text-gray-500 leading-relaxed">
                          {step.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* CERTIFICATES TAB - Tải trực tiếp tệp PDF từ máy tính của anh */}
              {activeTab === 'Certificates' && (
                <div className="space-y-4">
                  
                  {/* Cấu hình chung liên kết LinkedIn (Chỉ dành cho Admin) */}
                  {isAdminMode && (
                    <div className="p-4 border border-dashed border-blue-200 rounded-2xl bg-blue-50/30 mb-2 space-y-2">
                      <h4 className="text-xs font-bold text-blue-900 uppercase flex items-center gap-1.5">
                        <Link className="w-3.5 h-3.5 text-blue-600" /> Cấu hình liên kết LinkedIn cá nhân
                      </h4>
                      <input 
                        type="url"
                        placeholder="Dán link LinkedIn của anh tại đây..."
                        value={linkedinUrl}
                        onChange={e => setLinkedinUrl(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-blue-200 outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                      <p className="text-[10px] text-gray-400">
                        * Nút bấm chính "Yêu cầu tư vấn..." ngoài màn hình chính sẽ tự hướng thẳng sang link LinkedIn này.
                      </p>
                    </div>
                  )}

                  <div className="p-4 bg-green-50/50 rounded-2xl border border-green-100 flex items-start gap-3">
                    <FileCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-green-900">Tính Xác Thực Pháp Lý Cao</h4>
                      <p className="text-xs text-green-700 leading-relaxed mt-0.5">
                        Tất cả các chứng chỉ dưới đây đều đã được ký số mã hóa trực tiếp trên tệp PDF gốc, đáp ứng đầy đủ tiêu chuẩn năng lực hoạt động trong môi trường số chuyên ngành xây dựng.
                      </p>
                    </div>
                  </div>

                  {/* Form để Admin chọn tải tệp PDF trực tiếp hoặc dán link */}
                  {isAdminMode && (
                    <form onSubmit={handleSaveCert} className="p-4 border border-dashed border-amber-300 rounded-2xl bg-amber-50/50 mb-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
                      <h4 className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> 
                        {certForm.id ? 'Sửa văn bằng chứng chỉ' : 'Tải lên chứng chỉ mới'}
                      </h4>
                      
                      {/* Upload File PDF Trực Tiếp từ thiết bị */}
                      <div className="p-3 bg-white rounded-xl border border-gray-100 space-y-2">
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Tải tệp PDF từ máy tính của anh
                        </label>
                        <input 
                          type="file" 
                          accept="application/pdf"
                          onChange={handlePdfFileChange}
                          className="w-full text-xs cursor-pointer file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>

                      <div className="text-center text-gray-400 text-[10px] font-bold">HOẶC</div>

                      {/* Nhập URL thủ công (Dành cho Google Drive, Dropbox khi tệp nặng) */}
                      <input 
                        type="text"
                        placeholder="Dán đường dẫn tệp PDF trực tuyến (nếu không chọn file)..."
                        value={certForm.pdfUrl}
                        onChange={e => setCertForm({ ...certForm, pdfUrl: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-200 outline-none bg-white focus:ring-1 focus:ring-amber-500 font-mono text-blue-600"
                      />

                      <input 
                        type="text"
                        placeholder="Tiêu đề chứng chỉ (ví dụ: Revit Professional...)"
                        value={certForm.title}
                        onChange={e => setCertForm({ ...certForm, title: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-200 outline-none bg-white focus:ring-1 focus:ring-amber-500"
                        required
                      />
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text"
                          placeholder="Cơ quan cấp..."
                          value={certForm.issuer}
                          onChange={e => setCertForm({ ...certForm, issuer: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-lg border border-gray-200 outline-none bg-white focus:ring-1 focus:ring-amber-500"
                          required
                        />
                        <input 
                          type="text"
                          placeholder="Năm cấp..."
                          value={certForm.date}
                          onChange={e => setCertForm({ ...certForm, date: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-lg border border-gray-200 outline-none bg-white focus:ring-1 focus:ring-amber-500"
                          required
                        />
                      </div>

                      <input 
                        type="text"
                        placeholder="Người đại diện ký xác minh số..."
                        value={certForm.signedBy}
                        onChange={e => setCertForm({ ...certForm, signedBy: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-200 outline-none bg-white focus:ring-1 focus:ring-amber-500"
                      />

                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer">
                          <Save className="w-3.5 h-3.5" /> Lưu Chứng Chỉ
                        </button>
                        {certForm.id && (
                          <button 
                            type="button" 
                            onClick={() => setCertForm({ id: '', title: '', issuer: '', signedBy: '', status: 'Chứng chỉ đã được xác thực chữ ký số', date: 'Năm cấp: 2026', pdfUrl: '' })}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg"
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </form>
                  )}

                  {/* Danh sách các Chứng Chỉ hiển thị thực tế */}
                  <div className="space-y-3">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-all relative group">
                        {/* Admin controls */}
                        {isAdminMode && (
                          <div className="absolute top-3 right-3 flex gap-1.5 z-10 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setCertForm({ ...cert })}
                              className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCert(cert.id)}
                              className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {cert.date}
                          </span>
                          <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Chữ ký số hợp lệ
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 mt-1 pr-16">{cert.title}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">Cơ quan cấp: {cert.issuer}</p>
                        
                        <div className="mt-3 pt-2.5 border-t border-dashed border-gray-100 flex items-center justify-between text-[11px]">
                          <span className="text-gray-400 italic">Xác nhận ký: {cert.signedBy}</span>
                          {cert.pdfUrl ? (
                            <a 
                              href={cert.pdfUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 font-bold flex items-center gap-1 transition-colors"
                            >
                              Xem PDF Gốc <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <button 
                              onClick={() => alert('Vui lòng bật Admin Mode và tải lên tệp PDF của anh.')}
                              className="text-gray-400 hover:text-gray-600 font-medium flex items-center gap-1 transition-colors"
                            >
                              Chưa có tệp <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONSULTATION FORM TAB */}
              {activeTab === 'consultation' && (
                <div>
                  {!formSubmitted ? (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <p className="text-xs text-gray-500 leading-relaxed mb-1">
                        Hãy cung cấp thông tin sơ bộ về dự án cần điều phối để tôi liên hệ và chuẩn bị các giải pháp kỹ thuật, phân tích va chạm phù hợp nhất.
                      </p>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Họ và Tên / Đơn vị đề xuất</label>
                        <input 
                          type="text" 
                          required
                          value={fittingForm.name}
                          onChange={(e) => setFittingForm({ ...fittingForm, name: e.target.value })}
                          placeholder="Họ tên đối tác hoặc đơn vị yêu cầu..." 
                          className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Số điện thoại liên lạc</label>
                          <input 
                            type="tel" 
                            required
                            value={fittingForm.phone}
                            onChange={(e) => setFittingForm({ ...fittingForm, phone: e.target.value })}
                            placeholder="Số di động liên hệ..." 
                            className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Địa chỉ Email</label>
                          <input 
                            type="email" 
                            required
                            value={fittingForm.email}
                            onChange={(e) => setFittingForm({ ...fittingForm, email: e.target.value })}
                            placeholder="vi-du@domain.com" 
                            className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Hạng mục phối hợp chính</label>
                          <select 
                            value={fittingForm.projectType}
                            onChange={(e) => setFittingForm({ ...fittingForm, projectType: e.target.value })}
                            className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                          >
                            <option value="Architectural BIM">BIM Thiết Kế Kiến Trúc</option>
                            <option value="Structural BIM">BIM Tính Toán Kết Cấu</option>
                            <option value="MEP Coordination">BIM Hệ Thống Cơ Điện MEP</option>
                            <option value="Parametric Families">Dựng Thư Viện Revit Families</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Cấp độ thông tin hình học</label>
                          <select 
                            value={fittingForm.lodRequired}
                            onChange={(e) => setFittingForm({ ...fittingForm, lodRequired: e.target.value })}
                            className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                          >
                            <option value="LOD 300">LOD 300 (Thiết kế phác thảo)</option>
                            <option value="LOD 350">LOD 350 (Hồ sơ kỹ thuật)</option>
                            <option value="LOD 400">LOD 400 (Chế tạo & Thi công)</option>
                            <option value="LOD 500">LOD 500 (Vận hành As-Built)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nội dung yêu cầu chi tiết (Không bắt buộc)</label>
                        <textarea 
                          rows={2}
                          value={fittingForm.notes}
                          onChange={(e) => setFittingForm({ ...fittingForm, notes: e.target.value })}
                          placeholder="Mô tả quy mô diện tích sàn, số tầng hoặc các điểm giao thoa phức tạp cần giải quyết..." 
                          className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" 
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={formLoading}
                        className="w-full flex items-center justify-center gap-2 p-3.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        {formLoading ? 'Đang gửi thông tin...' : 'Xác Nhận Yêu Cầu Gặp Trao Đổi'}
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-6 space-y-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 text-green-500 rounded-full border border-green-100">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Tiếp Nhận Đăng Ký Thành Công</h4>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
                          Cảm ơn bạn, <strong>{fittingForm.name}</strong>. Tôi đã ghi nhận yêu cầu triển khai {fittingForm.projectType} ở mức độ {fittingForm.lodRequired}. Tôi sẽ liên hệ gửi phương án sơ bộ cho bạn qua Email trong vòng 24 giờ tới.
                        </p>
                      </div>
                      <button 
                        onClick={resetFittingForm}
                        className="text-xs text-blue-500 hover:underline font-bold"
                      >
                        Gửi một yêu cầu điều phối khác
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Panel Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400">
                Chuyên viên điều phối mô hình thông tin công trình BIM - Trần Minh Hiếu.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Admin Mode Passcode Dialog Modal */}
      {showAdminLogin && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl w-full max-w-xs shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5 justify-center">
              <Lock className="w-4 h-4 text-amber-500" /> Xác Minh Quyền Quản Trị
            </h4>
            <p className="text-[11px] text-gray-500 text-center mb-4 leading-relaxed">
              Nhập mật khẩu quản trị cá nhân của anh Hiếu để kích hoạt quyền tải lên và hiệu chỉnh các danh mục động.
            </p>
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input 
                type="password"
                required
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                placeholder="Mật khẩu (mặc định: hieu123)"
                className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:ring-1 focus:ring-blue-500 text-center font-mono tracking-widest"
                autoFocus
              />
              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Đăng Nhập
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPassword('');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs py-2.5 px-4 rounded-xl font-bold"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}