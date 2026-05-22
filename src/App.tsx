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

  // ĐÃ CẬP NHẬT: Trỏ trực tiếp đường dẫn tĩnh vào 3 file PDF trong thư mục public
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('hieu_bim_certs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'cert-revit-arc',
        title: 'Autodesk Certified Professional: Revit Architecture Design',
        issuer: 'Autodesk Global Certification',
        signedBy: 'VP Autodesk Learning Services (Digital Signature Verified)',
        status: 'Chứng chỉ quốc tế bộ môn Kiến trúc - Đã xác thực',
        date: 'Năm cấp: 2024',
        pdfUrl: '/chungchi-revit-arc-autodesk.pdf'
      },
      {
        id: 'cert-revit-struc',
        title: 'Autodesk Certified Professional: Revit Structural Design',
        issuer: 'Autodesk Global Certification',
        signedBy: 'VP Autodesk Learning Services (Digital Signature Verified)',
        status: 'Chứng chỉ quốc tế bộ môn Kết cấu - Đã xác thực',
        date: 'Năm cấp: 2024',
        pdfUrl: '/chungchi-revit-struc-autodesk.pdf'
      },
      {
        id: 'cert-revit-mep',
        title: 'Autodesk Certified Professional: Revit MEP Systems Design',
        issuer: 'Autodesk Global Certification',
        signedBy: 'VP Autodesk Learning Services (Digital Signature Verified)',
        status: 'Chứng chỉ quốc tế bộ môn Cơ điện - Đã xác thực',
        date: 'Năm cấp: 2025',
        pdfUrl: '/chungchi-revit-mep-autodesk.pdf'
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
          pdfUrl: reader.result as string
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
        
        {/* Navigation Bar */}
        <header className="w-full px-4 sm:px-8 pt-4 sm:pt-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Top-Left Official Brand & Identity Block */}
            <div className="flex items-center gap-3.5 backdrop-blur-md bg-white/90 p-2.5 sm:p-3 rounded-2xl border border-white/50 shadow-md max-w-sm transition-all duration-300 hover:bg-white/95 hover:shadow-lg">
              <div className="relative shrink-0">
                <CaMauOfficialLogo />
                <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                  <span className="text-[8px] text-white font-extrabold leading-none">★</span>
                </div>
              </div>

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

            {/* Right Interactive Pill Container */}
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
            
            {/* Nút kiểm tra nhanh chứng chỉ đầu tiên */}
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

            <h1 className="text-[1.5rem] sm:text-[1.75rem] leading-[1.2] font-extrabold text-gray-900 tracking-tight mb-3">
              Mô hình hóa BIM chuẩn xác & Phối hợp Revit chuyên nghiệp.
            </h1>

            <p className="text-[13px] text-gray-600 font-medium mb-4 leading-relaxed">
              Kiến tạo các mô hình số hóa 3D thông tin cao (LOD 300 - 500) và kiểm tra xung đột hệ thống hoàn hảo trước khi vận hành thực tế tại công trình.
            </p>

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

        {/* Quản trị & Sao lưu dữ liệu */}
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
            title="Chế độ quản trị"
          >
            {isAdminMode ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {isAdminMode ? 'Admin Active' : 'Admin'}
          </button>

          {isAdminMode && (
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold border border-green-700 hover:bg-green-700 transition-all shadow-md"
              title="Xuất dữ liệu lưu trữ"
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
          
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] transition-transform duration-300 scale-100">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  {activeTab === 'Profile' && <Cpu className="w-5 h-5" />}
                  {activeTab === 'Projects' && <Layers className="w-5 h-5" />}
                  {activeTab === 'Workflow' && <Box className="w-5 h-5" />}
                  {activeTab === 'Certificates' && <Award className="w-5 h-5" />}
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  {activeTab === 'Profile' && 'Hồ Sơ Năng Lực & Tầm Nhìn'}
                  {activeTab === 'Projects' && 'Dự Án Mô Hình Hóa BIM Thực Chiến'}
                  {activeTab === 'Workflow' && 'Quy Trình Triển Khai Kỹ Thuật'}
                  {activeTab === 'Certificates' && 'Văn Bằng & Chứng Chỉ Đã Ký Số'}
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
                      Là một viên chức nhà nước hoạt động chuyên môn tại Sở Xây dựng tỉnh Cà Mau, tôi định hướng xây dựng các mô hình số có độ tin cậy kết cấu cao. Sự đồng bộ dữ liệu hình học và phi hình học giúp giảm thiểu tối đa rủi ro sửa chữa tại hiện trường.
                    </p>
                  </div>
                  
                  <div className="relative border-l-2 border-gray-100 pl-4 space-y-4 py-2">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 bg-white border-2 border-blue-500 rounded-full w-2.5 h-2.5" />
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Mức Độ Chi Tiết Cao</span>
                      <h5 className="text-xs font-semibold text-gray-900 mt-0.5">LOD 300 - LOD 500 Specialist</h5>
                      <p className="text-xs text-gray-500 mt-0.5">Thiết kế cấu trúc hình học chuẩn hóa, đồng thời tích hợp đầy đủ thông tin phi hình học nhằm hỗ trợ tốt nhất cho công tác chế tạo cấu kiện.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PROJECTS TAB */}
              {activeTab === 'Projects' && (
                <div className="space-y-4">
                  {isAdminMode && (
                    <form onSubmit={handleSaveProject} className="p-4 border border-dashed border-amber-300 rounded-2xl bg-amber-50/50 mb-4 space-y-3">
                      <h4 className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> {projectForm.id ? 'Chỉnh sửa dự án' : 'Thêm mới dự án'}
                      </h4>
                      <input 
                        type="text"
                        placeholder="Tên dự án..."
                        value={projectForm.name}
                        onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-white"
                        required
                      />
                      <textarea 
                        placeholder="Mô tả kỹ thuật triển khai..."
                        value={projectForm.desc}
                        onChange={e => setProjectForm({ ...projectForm, desc: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-white h-16 resize-none"
                        required
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-amber-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1">
                          <Save className="w-3.5 h-3.5" /> Lưu Dự Án
                        </button>
                      </div>
                    </form>
                  )}

                  {bimProjects.map((project) => (
                    <div key={project.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/40 relative group">
                      {isAdminMode && (
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          <button 
                            onClick={() => setProjectForm({
                              id: project.id,
                              name: project.name,
                              category: project.category,
                              desc: project.desc,
                              lod: project.lod,
                              tools: project.tools.join(', ')
                            })}
                            className="p-1 rounded bg-blue-50 text-blue-600"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteProject(project.id)} className="p-1 rounded bg-red-50 text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{project.category}</span>
                      <h4 className="text-sm font-bold text-gray-900 mt-1.5">{project.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{project.desc}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] font-extrabold bg-gray-900 text-white px-2 py-0.5 rounded">{project.lod}</span>
                        {project.tools.map((t, idx) => (
                          <span key={idx} className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* WORKFLOW TAB */}
              {activeTab === 'Workflow' && (
                <div className="space-y-3">
                  {[
                    { step: 1, name: 'Thu thập cấu trúc & Khảo sát Chênh cốt', detail: 'Đánh giá hồ sơ hiện trạng, cao độ dầm sàn kết cấu và thiết lập lưới trục dự án.' },
                    { step: 2, name: 'Mô hình hóa chi tiết cấu kiện (LOD 350+)', detail: 'Phân chia các lớp Layer, thiết lập tham số Family và dựng hình chuẩn xác theo bộ môn.' },
                    { step: 3, name: 'Kiểm tra va chạm & Xuất hồ sơ Shop Drawing', detail: 'Chạy ma trận xung đột không gian thông qua Navisworks và trích xuất dữ liệu.' }
                  ].map((item) => (
                    <div 
                      key={item.step}
                      onClick={() => setActiveWorkflowStep(activeWorkflowStep === item.step ? null : item.step)}
                      className="p-3.5 border border-gray-100 rounded-2xl bg-gray-50/50 cursor-pointer hover:border-blue-100 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">{item.step}</span>
                          <span className="text-xs font-bold text-gray-800">{item.name}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeWorkflowStep === item.step ? 'rotate-90 text-blue-600' : ''}`} />
                      </div>
                      {activeWorkflowStep === item.step && (
                        <p className="text-[11.5px] text-gray-500 mt-2 pl-8 border-l border-blue-500/30 ml-3 animate-in fade-in duration-150">{item.detail}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* CERTIFICATES TAB */}
              {activeTab === 'Certificates' && (
                <div className="space-y-4">
                  {isAdminMode && (
                    <form onSubmit={handleSaveCert} className="p-4 border border-dashed border-amber-300 rounded-2xl bg-amber-50/50 mb-4 space-y-3">
                      <h4 className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Thêm văn bằng chứng chỉ</h4>
                      <input 
                        type="text" 
                        placeholder="Tên chứng chỉ..." 
                        value={certForm.title} 
                        onChange={e => setCertForm({ ...certForm, title: e.target.value })} 
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-white" 
                        required 
                      />
                      <input 
                        type="file" 
                        accept="application/pdf" 
                        onChange={handlePdfFileChange} 
                        className="w-full text-xs" 
                      />
                      <button type="submit" className="w-full bg-amber-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1">
                        <Save className="w-3.5 h-3.5" /> Lưu cấu hình chứng chỉ
                      </button>
                    </form>
                  )}

                  {certificates.map((cert) => (
                    <div key={cert.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/40 relative group flex flex-col justify-between sm:flex-row sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <h4 className="text-xs font-bold text-gray-800">{cert.title}</h4>
                        </div>
                        <p className="text-[11px] text-gray-500 pl-5">{cert.issuer} • <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">{cert.date}</span></p>
                        <p className="text-[10px] text-gray-400 pl-5 italic">{cert.signedBy}</p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {isAdminMode && (
                          <button onClick={() => handleDeleteCert(cert.id)} className="p-1.5 rounded bg-red-50 text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <a 
                          href={cert.pdfUrl}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          Xem PDF <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Admin Pass Logic Popup */}
      {showAdminLogin && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <form onSubmit={handleAdminLogin} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-full max-w-xs space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <Lock className="w-5 h-5" />
              <h3 className="text-sm font-bold text-gray-900">Xác thực quyền quản trị</h3>
            </div>
            <input 
              type="password"
              placeholder="Nhập mật khẩu..."
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-amber-500"
              required
              autoFocus
            />
            <div className="flex gap-2 text-xs font-bold">
              <button type="submit" className="flex-1 bg-amber-600 text-white py-2 rounded-lg">Đăng Nhập</button>
              <button type="button" onClick={() => { setShowAdminLogin(false); setAdminPassword(''); }} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg">Hủy</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}