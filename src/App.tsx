import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, X, ChevronRight, CheckCircle2, 
  Layers, Award, FileCheck, Box, Cpu, Calendar, Send, ExternalLink, 
  Plus, Trash2, Edit3, Lock, Unlock, Download, Save, Link
} from 'lucide-react';

// SVG logo chính thức của Trung tâm Quy hoạch và Kiểm định Cà Mau (CPI KD CAMAU)
const CaMauOfficialLogo = () => (
  <svg 
    width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
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
    <text x="100" y="188" fontFamily="'Arial Black', 'Impact', sans-serif" fontSize="27" fontWeight="900" fill="#EE1C25" textAnchor="middle" letterSpacing="1">
      CAMAU
    </text>
  </svg>
);

const Logo = () => (
  <svg width="18" height="18" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 hover:rotate-12">
    <path fill="rgb(84, 84, 84)" d="M 160 88 L 194 34 L 216 0 L 256 0 L 256 40 L 221.5 93.5 L 200 128 L 256 128 L 256 256 L 96 256 L 96 168 L 64.246 220 L 40 256 L 0 256 L 0 216 L 34 162 L 56 128 L 0 128 L 0 0 L 160 0 Z" />
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
  
  // Trạng thái Chế độ Quản trị
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [openPdfUrl, setOpenPdfUrl] = useState<string | null>(null);

  // Đường dẫn liên kết LinkedIn
  const [linkedinUrl, setLinkedinUrl] = useState<string>(() => {
    return localStorage.getItem('hieu_linkedin') || 'https://www.linkedin.com/in/tranminhhieu-bim';
  });

  // Khởi tạo State Dự Án
  const [bimProjects, setBimProjects] = useState<BIMProject[]>(() => {
    try {
      const saved = localStorage.getItem('hieu_bim_projects');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Lỗi đọc dữ liệu dự án từ LocalStorage', e);
    }
    return [
      {
        id: 'structural-coordination',
        name: 'Phối hợp Kết cấu Cao ốc Văn phòng',
        category: 'Structural BIM',
        desc: 'Mô hình hóa bê tông cốt thép & kết cấu thép phức tạp. Xử lý lệch cốt dầm sàn và kiểm soát xung đột hệ thống trước khi thi công thực tế tại hiện trường.',
        lod: 'LOD 400',
        tools: ['Revit Structural', 'Navisworks', 'Dynamo']
      },
      {
        id: 'parametric-families',
        name: 'Hệ Thư viện Tham số Revit Families',
        category: 'Parametric Design',
        desc: 'Thiết kế thư viện Family thông minh với đầy đủ tham số kích thước, thông tin vật liệu và cấu kiện liên kết giúp tăng tốc 40% quy trình thiết kế.',
        lod: 'LOD 350',
        tools: ['Revit Family', 'Dynamo Scripting']
      },
      {
        id: 'mep-integration',
        name: 'Tích hợp MEP Nhà máy Công nghiệp',
        category: 'MEP Integration',
        desc: 'Mô hình hóa chi tiết hệ thống đường ống kỹ thuật phức tạp (HVAC, PCCC, Cấp thoát nước, Điện) cho nhà xưởng diện tích lớn. Xuất bản vẽ thi công Shop Drawing.',
        lod: 'LOD 400',
        tools: ['Revit MEP', 'Navisworks Manage']
      }
    ];
  });

  // Khởi tạo State Chứng Chỉ
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    try {
      const saved = localStorage.getItem('hieu_bim_certs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Lỗi đọc dữ liệu chứng chỉ', e);
    }
    return [
      {
        id: 'cert-revit-pro',
        title: 'Autodesk Certified Professional: Revit for Structural Design',
        issuer: 'Autodesk Global Certification',
        signedBy: 'VP Autodesk Learning Services',
        status: 'Chứng chỉ quốc tế',
        date: 'Năm cấp: 2024',
        pdfUrl: 'https://images.autodesk.com/adsk/files/certified_professional_logo.pdf'
      },
      {
        id: 'cert-bim-manager',
        title: 'BIM Modeler & Coordination Specialist',
        issuer: 'Viện Công nghệ & Xây dựng Số (BIM Institute)',
        signedBy: 'Chủ tịch Hội đồng Khoa học',
        status: 'Đạt chuẩn kỹ năng hành nghề',
        date: 'Năm cấp: 2025',
        pdfUrl: '' // Empty để demo hiển thị "Chưa có tệp"
      }
    ];
  });

  // Đồng bộ hóa dữ liệu (kèm kiểm tra dung lượng để tránh crash trình duyệt)
  const safeSetLocalStorage = useCallback((key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      alert('⚠️ Bộ nhớ trình duyệt sắp đầy (Vượt quá 5MB). Vui lòng sử dụng URL thay vì tải trực tiếp tệp PDF hoặc xóa bớt chứng chỉ cũ.');
      console.error("QuotaExceededError:", e);
    }
  }, []);

  useEffect(() => { safeSetLocalStorage('hieu_bim_projects', JSON.stringify(bimProjects)); }, [bimProjects, safeSetLocalStorage]);
  useEffect(() => { safeSetLocalStorage('hieu_bim_certs', JSON.stringify(certificates)); }, [certificates, safeSetLocalStorage]);
  useEffect(() => { safeSetLocalStorage('hieu_linkedin', linkedinUrl); }, [linkedinUrl, safeSetLocalStorage]);

  // Forms
  const [projectForm, setProjectForm] = useState({
    id: '', name: '', category: 'Structural BIM', desc: '', lod: 'LOD 400', tools: ''
  });
  const [certForm, setCertForm] = useState({
    id: '', title: '', issuer: '', signedBy: '', status: 'Chứng chỉ đã được xác thực chữ ký số', date: 'Năm cấp: 2026', pdfUrl: ''
  });
  const [fittingForm, setFittingForm] = useState({
    name: '', phone: '', email: '', projectType: 'Architectural BIM', lodRequired: 'LOD 350', notes: ''
  });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTogglePlay = () => setIsVideoPlaying(!isVideoPlaying);
  const handleToggleMute = () => setIsVideoMuted(!isVideoMuted);

  useEffect(() => {
    if (videoRef.current) {
      if (isVideoPlaying) videoRef.current.play().catch(() => {});
      else videoRef.current.pause();
    }
  }, [isVideoPlaying]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isVideoMuted;
  }, [isVideoMuted]);

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

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Hệ thống chỉ chấp nhận tải lên định dạng tệp .PDF.');
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        alert('Kích thước tệp quá lớn! Vui lòng tải file dưới 3MB để tối ưu hóa bộ nhớ, hoặc dán đường dẫn URL trực tiếp.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertForm(prev => ({ ...prev, pdfUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name || !projectForm.desc) return;
    if (projectForm.id) {
      setBimProjects(prev => prev.map(p => p.id === projectForm.id ? {
        ...projectForm,
        id: projectForm.id,
        tools: projectForm.tools.split(',').map(t => t.trim())
      } : p));
    } else {
      // Giải cấu trúc loại bỏ id cũ để không bị ghi đè thuộc tính id mới tạo ra
      const { id: _, ...projectData } = projectForm;
      const newProject: BIMProject = {
        ...projectData,
        id: 'project_' + Date.now(),
        tools: projectForm.tools ? projectForm.tools.split(',').map(t => t.trim()) : ['Revit']
      };
      setBimProjects(prev => [...prev, newProject]);
    }
    setProjectForm({ id: '', name: '', category: 'Structural BIM', desc: '', lod: 'LOD 400', tools: '' });
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Anh có chắc chắn muốn xóa dự án BIM này không?')) {
      setBimProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title || !certForm.issuer || !certForm.pdfUrl) {
      alert('Vui lòng nhập tên chứng chỉ, cơ quan cấp và tệp/link PDF.');
      return;
    }
    if (certForm.id) {
      setCertificates(prev => prev.map(c => c.id === certForm.id ? certForm : c));
    } else {
      // Giải cấu trúc loại bỏ id cũ của form để tránh trùng lặp cảnh báo TS
      const { id: _, ...certData } = certForm;
      const newCert: Certificate = {
        ...certData,
        id: 'cert_' + Date.now()
      };
      setCertificates(prev => [...prev, newCert]);
    }
    setCertForm({ id: '', title: '', issuer: '', signedBy: '', status: 'Chứng chỉ đã được xác thực chữ ký số', date: 'Năm cấp: 2026', pdfUrl: '' });
  };

  const handleDeleteCert = (id: string) => {
    if (window.confirm('Anh có chắc muốn gỡ bỏ chứng chỉ này không?')) {
      setCertificates(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleDownloadBackup = () => {
    const backupData = { projects: bimProjects, certificates: certificates, linkedin: linkedinUrl };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hieu_BIM_Backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
    }, 1200);
  };

  const resetFittingForm = () => {
    setFittingForm({ name: '', phone: '', email: '', projectType: 'Architectural BIM', lodRequired: 'LOD 350', notes: '' });
    setFormSubmitted(false);
  };

  // Các Tabs hệ thống (Bổ sung thêm Tab Contact)
  const TABS = [
    { id: 'Profile', label: 'Hồ Sơ' },
    { id: 'Projects', label: 'Dự Án' },
    { id: 'Workflow', label: 'Quy Trình' },
    { id: 'Certificates', label: 'Chứng Chỉ' },
    { id: 'Contact', label: 'Liên Hệ' }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f0f0ee] font-sans antialiased text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background Video (Tối ưu performance) */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
        autoPlay muted loop playsInline preload="auto"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/30 pointer-events-none" />

      {/* Cấu trúc chính */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation Bar */}
        <header className="w-full px-4 sm:px-8 pt-4 sm:pt-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Logo/Brand Identity */}
            <div className="flex items-center gap-3.5 backdrop-blur-md bg-white/95 p-2.5 sm:p-3 rounded-2xl shadow-lg border border-white/40 transition-transform duration-300 hover:scale-[1.02]">
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
                  Trung tâm Quy hoạch & Kiểm định
                </span>
                <span className="text-[12px] font-extrabold text-blue-700 mt-1 flex items-center gap-1.5 leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
                  TKQH - Trần Minh Hiếu
                </span>
              </div>
            </div>

            {/* Điều hướng Tabs - Tối ưu Mobile cuộn ngang */}
            <nav className="flex items-center gap-2 self-stretch md:self-auto w-full md:w-auto">
              <button 
                onClick={() => setActiveTab(null)}
                className="flex items-center justify-center rounded-full w-11 h-11 shrink-0 backdrop-blur-md bg-white/80 hover:bg-white transition-all shadow-sm active:scale-95 border border-white/50" 
                aria-label="Trang chủ"
              >
                <Logo />
              </button>

              <div className="flex items-center gap-2 sm:gap-4 rounded-xl px-2 sm:px-4 py-2 backdrop-blur-md bg-white/80 border border-white/50 shadow-sm overflow-x-auto snap-x flex-1 scrollbar-hide">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
                    className={`shrink-0 snap-start text-[12px] sm:text-[13px] font-bold transition-all duration-300 relative px-3 py-1.5 rounded-lg ${
                      activeTab === tab.id 
                        ? 'bg-blue-600 text-white shadow-md scale-105' 
                        : 'text-gray-700 hover:text-blue-700 hover:bg-white/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>

          </div>
        </header>

        {/* Khu vực Nội dung Hero */}
        <main className="flex-1 flex items-end pb-24 sm:pb-28 lg:pb-32 px-6 sm:px-12 md:px-20 lg:px-28">
          <section className="max-w-md backdrop-blur-xl bg-white/85 p-6 sm:p-8 rounded-3xl border border-white/50 shadow-2xl animate-in slide-in-from-bottom-8 duration-700 ease-out">
            
            <button 
              onClick={() => {
                if (certificates.length > 0 && certificates[0].pdfUrl) {
                  setOpenPdfUrl(certificates[0].pdfUrl);
                } else {
                  setActiveTab('Certificates');
                }
              }}
              className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-blue-700 hover:text-blue-800 transition-colors mb-4 group bg-blue-50/80 px-3 py-1.5 rounded-full border border-blue-100"
            >
              ✓ Xác thực Autodesk Certified (Xem PDF)
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>

            <h1 className="text-[1.6rem] sm:text-[1.8rem] leading-[1.25] font-extrabold text-gray-900 tracking-tight mb-3">
              Mô hình hóa BIM chuẩn xác & Phối hợp MEP chuyên nghiệp.
            </h1>

            <p className="text-[13px] sm:text-[14px] text-gray-600 font-medium mb-6 leading-relaxed">
              Kiến tạo các mô hình số hóa 3D với độ chi tiết cao (LOD 300 - 500) và kiểm soát xung đột hệ thống hoàn hảo trước khi thi công thực tế tại công trường.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href={linkedinUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 text-[13px] font-bold text-white bg-blue-600 rounded-xl px-5 py-3.5 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98] group"
              >
                LinkedIn Cá Nhân
                <ExternalLink className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <button 
                onClick={() => setActiveTab('Contact')}
                className="inline-flex items-center justify-center gap-2 text-[13px] font-bold text-gray-800 bg-white border border-gray-200 rounded-xl px-5 py-3.5 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98] group"
              >
                Gửi Yêu Cầu <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </section>
        </main>

        {/* Các nút Controls (Bottom Left & Right) */}
        <div className="absolute bottom-6 left-6 sm:left-12 flex items-center gap-2 z-20">
          <button 
            onClick={() => isAdminMode ? setIsAdminMode(false) : setShowAdminLogin(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border shadow-lg backdrop-blur-md active:scale-95 ${
              isAdminMode 
                ? 'bg-amber-500/90 text-white border-amber-500 animate-pulse' 
                : 'bg-white/80 text-gray-700 hover:text-blue-700 hover:bg-white border-white/50'
            }`}
          >
            {isAdminMode ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {isAdminMode ? 'Admin Active' : 'Admin'}
          </button>

          {isAdminMode && (
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-1.5 bg-green-600/90 backdrop-blur-md text-white px-3 py-2 rounded-xl text-xs font-bold border border-green-500 hover:bg-green-600 transition-all shadow-lg active:scale-95"
            >
              <Download className="w-4 h-4" /> Data
            </button>
          )}
        </div>

        <div className="absolute bottom-6 right-6 sm:right-12 flex items-center gap-2 z-20">
          <button 
            onClick={handleTogglePlay}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-md text-gray-700 hover:bg-white hover:text-blue-600 transition-all border border-white/50 shadow-lg active:scale-95"
          >
            {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button 
            onClick={handleToggleMute}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-md text-gray-700 hover:bg-white hover:text-blue-600 transition-all border border-white/50 shadow-lg active:scale-95"
          >
            {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Khu vực hiển thị nội dung Tabs (Modal nổi) */}
      {activeTab && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300">
          
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header của Modal */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-700 shadow-sm">
                  {activeTab === 'Profile' && <Cpu className="w-5 h-5" />}
                  {activeTab === 'Projects' && <Layers className="w-5 h-5" />}
                  {activeTab === 'Workflow' && <Box className="w-5 h-5" />}
                  {activeTab === 'Certificates' && <Award className="w-5 h-5" />}
                  {activeTab === 'Contact' && <Calendar className="w-5 h-5" />}
                </span>
                <h3 className="text-[15px] font-extrabold text-gray-900">
                  {activeTab === 'Profile' && 'Hồ Sơ & Năng Lực'}
                  {activeTab === 'Projects' && 'Dự Án Đã Thực Hiện'}
                  {activeTab === 'Workflow' && 'Quy Trình Phối Hợp'}
                  {activeTab === 'Certificates' && 'Văn Bằng & Chứng Chỉ'}
                  {activeTab === 'Contact' && 'Liên Hệ Trao Đổi Dự Án'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setActiveTab(null);
                  resetFittingForm();
                }}
                className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nội dung động có thể cuộn */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200">
              
              {/* === TAB PROFILE === */}
              {activeTab === 'Profile' && (
                <section className="space-y-5 animate-in slide-in-from-right-4">
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100 shadow-sm">
                    <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-600" /> Triết lý & Định hướng
                    </h4>
                    <p className="text-[13px] text-blue-800/90 leading-relaxed">
                      Là một BIM Modeler làm việc chuyên nghiệp, tôi định hướng xây dựng các mô hình số có độ tin cậy tuyệt đối. Sự đồng bộ giữa các bộ môn Kiến trúc, Kết cấu và MEP giúp tối ưu hóa chi phí đầu tư, giảm thiểu tối đa rủi ro phát sinh tại hiện trường.
                    </p>
                  </div>
                  
                  <div className="relative border-l-2 border-gray-100 pl-5 space-y-6 py-2 ml-2">
                    <div className="relative">
                      <div className="absolute -left-[27px] top-1 bg-white border-2 border-blue-500 rounded-full w-3 h-3 shadow-sm" />
                      <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider">Mức Độ Chi Tiết</span>
                      <h5 className="text-sm font-bold text-gray-900 mt-1">LOD 300 - 500 Specialist</h5>
                      <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">Thiết kế cấu trúc hình học chuẩn hóa, tích hợp đầy đủ dữ liệu phi hình học nhằm hỗ trợ chế tạo cấu kiện và quản lý hoàn công.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[27px] top-1 bg-white border-2 border-blue-500 rounded-full w-3 h-3 shadow-sm" />
                      <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider">Phối Hợp Thiết Kế</span>
                      <h5 className="text-sm font-bold text-gray-900 mt-1">Kiểm Soát Xung Đột Hệ Thống</h5>
                      <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">Sử dụng Navisworks Manage kết hợp Revit để tự động hóa kiểm duyệt xung đột không gian hệ thống kỹ thuật MEP và dầm sàn kết cấu.</p>
                    </div>
                  </div>
                </section>
              )}

              {/* === TAB PROJECTS === */}
              {activeTab === 'Projects' && (
                <section className="space-y-4 animate-in slide-in-from-right-4">
                  {isAdminMode && (
                    <form onSubmit={handleSaveProject} className="p-4 sm:p-5 border border-dashed border-amber-300 rounded-2xl bg-amber-50/50 mb-5 space-y-3">
                      <h4 className="text-[13px] font-bold text-amber-900 uppercase flex items-center gap-1.5 mb-2">
                        <Plus className="w-4 h-4" /> {projectForm.id ? 'Sửa dự án BIM' : 'Thêm dự án BIM'}
                      </h4>
                      <input 
                        type="text" placeholder="Tên dự án..." value={projectForm.name} required
                        onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                        className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                      <textarea 
                        placeholder="Mô tả kỹ thuật..." value={projectForm.desc} required
                        onChange={e => setProjectForm({ ...projectForm, desc: e.target.value })}
                        className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 min-h-[80px] resize-y"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <select value={projectForm.category} onChange={e => setProjectForm({ ...projectForm, category: e.target.value })} className="text-[13px] p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-amber-500/20">
                          <option value="Structural BIM">Structural BIM</option>
                          <option value="Architectural BIM">Architectural BIM</option>
                          <option value="MEP Integration">MEP Integration</option>
                          <option value="Parametric Design">Parametric Design</option>
                        </select>
                        <select value={projectForm.lod} onChange={e => setProjectForm({ ...projectForm, lod: e.target.value })} className="text-[13px] p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-amber-500/20">
                          <option value="LOD 300">LOD 300</option>
                          <option value="LOD 350">LOD 350</option>
                          <option value="LOD 400">LOD 400</option>
                          <option value="LOD 500">LOD 500</option>
                        </select>
                      </div>
                      <input 
                        type="text" placeholder="Công cụ (Revit, Dynamo...)" value={projectForm.tools}
                        onChange={e => setProjectForm({ ...projectForm, tools: e.target.value })}
                        className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                      <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-[13px] font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                          <Save className="w-4 h-4" /> Lưu Dự Án
                        </button>
                        {projectForm.id && (
                          <button type="button" onClick={() => setProjectForm({ id: '', name: '', category: 'Structural BIM', desc: '', lod: 'LOD 400', tools: '' })} className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-[13px] font-bold px-4 rounded-xl transition-colors">
                            Hủy
                          </button>
                        )}
                      </div>
                    </form>
                  )}

                  {bimProjects.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">Chưa có dự án nào được cập nhật.</div>
                  ) : (
                    bimProjects.map((project) => (
                      <article key={project.id} className="border border-gray-100 hover:border-blue-200 hover:shadow-md bg-white rounded-2xl p-5 transition-all relative group">
                        {isAdminMode && (
                          <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setProjectForm({ ...project, tools: project.tools.join(', ') })} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteProject(project.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                          <h4 className="text-[15px] font-extrabold text-gray-900 pr-16">{project.name}</h4>
                          <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg shrink-0 border border-blue-100">{project.lod}</span>
                        </div>
                        <p className="text-[13px] text-gray-600 mb-4 leading-relaxed">{project.desc}</p>
                        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-50">
                          {project.tools.map((tool, i) => (
                            <span key={i} className="text-[11px] font-mono bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">{tool}</span>
                          ))}
                        </div>
                      </article>
                    ))
                  )}
                </section>
              )}

              {/* === TAB WORKFLOW === */}
              {activeTab === 'Workflow' && (
                <section className="space-y-3 animate-in slide-in-from-right-4">
                  {[
                    { q: "Bước 1: Tiếp nhận BEP & Lập kế hoạch", a: "Thu thập hồ sơ thiết kế cơ sở 2D hoặc tệp tin khảo sát, thống nhất Kế hoạch thực hiện BIM (BEP), hệ tọa độ gốc và tiêu chuẩn tên cấu kiện." },
                    { q: "Bước 2: Xây dựng mô hình 3D (Revit)", a: "Triển khai dựng hình chuẩn xác cấu trúc Kiến trúc, Kết cấu dầm sàn, thép chịu lực và các đường ống MEP tùy thuộc vào cấp độ LOD được duyệt." },
                    { q: "Bước 3: Phân tích xung đột (Navisworks)", a: "Tổng hợp mô hình, tiến hành kiểm tra xung đột vật lý bằng Navisworks Manage và lập báo cáo va chạm (Clash Detection) đề xuất giải pháp." },
                    { q: "Bước 4: Xuất bản vẽ thi công Shop Drawing", a: "Kết xuất bộ bản vẽ kỹ thuật chi tiết từ mô hình 3D, hỗ trợ bóc tách khối lượng (BOQ) chuẩn xác phục vụ đấu thầu và thi công." }
                  ].map((step, i) => (
                    <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
                      <button 
                        onClick={() => setActiveWorkflowStep(activeWorkflowStep === i ? null : i)}
                        className="w-full text-left p-4 hover:bg-gray-50 flex justify-between items-center transition-colors"
                      >
                        <span className="text-[13px] font-bold text-gray-800">{step.q}</span>
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${activeWorkflowStep === i ? 'rotate-90' : ''}`} />
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-300 ${activeWorkflowStep === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="p-4 pt-0 bg-white text-[13px] text-gray-600 leading-relaxed border-t border-gray-50 mt-2">
                          {step.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {/* === TAB CERTIFICATES === */}
              {activeTab === 'Certificates' && (
                <section className="space-y-4 animate-in slide-in-from-right-4">
                  
                  {isAdminMode && (
                    <div className="p-4 sm:p-5 border border-dashed border-blue-200 rounded-2xl bg-blue-50/50 mb-3 space-y-3">
                      <h4 className="text-[13px] font-bold text-blue-900 flex items-center gap-1.5">
                        <Link className="w-4 h-4" /> URL Link LinkedIn nút Hero
                      </h4>
                      <input 
                        type="url" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/..." 
                        className="w-full text-[13px] p-3 rounded-xl border border-blue-200 outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                      />
                    </div>
                  )}

                  <div className="p-4 sm:p-5 bg-green-50/70 rounded-2xl border border-green-100 flex items-start gap-3 shadow-sm">
                    <FileCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[13px] font-bold text-green-900">Tính Xác Thực Pháp Lý</h4>
                      <p className="text-[13px] text-green-700/90 leading-relaxed mt-1">
                        Chứng chỉ hành nghề số hóa đều được mã hóa PDF gốc.
                      </p>
                    </div>
                  </div>

                  {isAdminMode && (
                    <form onSubmit={handleSaveCert} className="p-4 sm:p-5 border border-dashed border-amber-300 rounded-2xl bg-amber-50/50 mb-5 space-y-4">
                      <h4 className="text-[13px] font-bold text-amber-900 uppercase flex items-center gap-1.5 mb-1">
                        <Plus className="w-4 h-4" /> {certForm.id ? 'Sửa văn bằng' : 'Thêm văn bằng'}
                      </h4>
                      
                      <div className="p-4 bg-white rounded-xl border border-gray-100 space-y-2 shadow-sm">
                        {/* Khắc phục lỗi cú pháp biên dịch bằng cách bao bọc nhãn text chứa ký tự so sánh trong Javascript block */}
                        <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                          {"Tải PDF (< 3MB)"}
                        </label>
                        <input type="file" accept="application/pdf" onChange={handlePdfFileChange} className="w-full text-[12px] cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[12px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"/>
                      </div>

                      <div className="flex items-center gap-3 text-gray-400">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Hoặc nhập URL</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                      </div>

                      <input type="url" placeholder="https://... (Link tệp trực tuyến)" value={certForm.pdfUrl} onChange={e => setCertForm({ ...certForm, pdfUrl: e.target.value })} className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white focus:ring-2 focus:ring-amber-500/20 font-mono text-blue-600"/>
                      
                      <input type="text" placeholder="Tiêu đề chứng chỉ..." value={certForm.title} required onChange={e => setCertForm({ ...certForm, title: e.target.value })} className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white focus:ring-2 focus:ring-amber-500/20"/>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Cơ quan cấp..." value={certForm.issuer} required onChange={e => setCertForm({ ...certForm, issuer: e.target.value })} className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white focus:ring-2 focus:ring-amber-500/20"/>
                        <input type="text" placeholder="Năm cấp..." value={certForm.date} required onChange={e => setCertForm({ ...certForm, date: e.target.value })} className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white focus:ring-2 focus:ring-amber-500/20"/>
                      </div>

                      <input type="text" placeholder="Người đại diện ký xác minh..." value={certForm.signedBy} onChange={e => setCertForm({ ...certForm, signedBy: e.target.value })} className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white focus:ring-2 focus:ring-amber-500/20"/>

                      <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-[13px] font-bold py-3 rounded-xl transition-colors shadow-sm flex justify-center items-center gap-1.5">
                          <Save className="w-4 h-4" /> Lưu
                        </button>
                        {certForm.id && (
                          <button type="button" onClick={() => setCertForm({ id: '', title: '', issuer: '', signedBy: '', status: '', date: '', pdfUrl: '' })} className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-[13px] font-bold px-4 rounded-xl transition-colors">
                            Hủy
                          </button>
                        )}
                      </div>
                    </form>
                  )}

                  <div className="space-y-4">
                    {certificates.map((cert) => (
                      <article key={cert.id} className="p-4 sm:p-5 rounded-2xl border border-gray-100 bg-white hover:shadow-md hover:border-blue-100 transition-all relative group">
                        {isAdminMode && (
                          <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setCertForm({ ...cert })} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteCert(cert.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                            {cert.date}
                          </span>
                          <span className="text-[11px] text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Hợp lệ
                          </span>
                        </div>
                        <h4 className="text-[14px] font-extrabold text-gray-900 mt-2 pr-16">{cert.title}</h4>
                        <p className="text-[12px] font-medium text-gray-500 mt-1">Cơ quan: {cert.issuer}</p>
                        
                        <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex items-center justify-between text-[11.5px]">
                          <span className="text-gray-400 italic">Ký bởi: {cert.signedBy || 'Không xác định'}</span>
                          {cert.pdfUrl ? (
                            <button 
                              onClick={() => setOpenPdfUrl(cert.pdfUrl)}
                              className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1.5 transition-colors bg-blue-50/50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-50"
                            >
                              Xem PDF <FileCheck className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-gray-400 font-medium flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg">
                              Chưa có tệp PDF
                            </span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* === TAB CONTACT (Tư Vấn) === */}
              {activeTab === 'Contact' && (
                <section className="animate-in slide-in-from-right-4">
                  {!formSubmitted ? (
                    <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5">
                      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <p className="text-[13px] text-blue-800 leading-relaxed font-medium">
                          Gửi thông tin sơ bộ về dự án để tôi chuẩn bị giải pháp mô hình hóa và phân tích kỹ thuật phù hợp nhất trước khi trao đổi trực tiếp.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Đơn vị / Tên đối tác *</label>
                          <input type="text" required value={fittingForm.name} onChange={e => setFittingForm({ ...fittingForm, name: e.target.value })} placeholder="Tên công ty hoặc họ tên bạn..." className="w-full text-[13px] p-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">SĐT Liên Hệ *</label>
                            <input type="tel" required value={fittingForm.phone} onChange={e => setFittingForm({ ...fittingForm, phone: e.target.value })} placeholder="09xx..." className="w-full text-[13px] p-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Email *</label>
                            <input type="email" required value={fittingForm.email} onChange={e => setFittingForm({ ...fittingForm, email: e.target.value })} placeholder="mail@congty.com" className="w-full text-[13px] p-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Bộ môn phối hợp chính</label>
                            <select value={fittingForm.projectType} onChange={e => setFittingForm({ ...fittingForm, projectType: e.target.value })} className="w-full text-[13px] p-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white shadow-sm">
                              <option value="Architectural BIM">Kiến Trúc</option>
                              <option value="Structural BIM">Kết Cấu</option>
                              <option value="MEP Coordination">Cơ Điện (MEP)</option>
                              <option value="Parametric Families">Family Tham Số</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Cấp độ thông tin LOD</label>
                            <select value={fittingForm.lodRequired} onChange={e => setFittingForm({ ...fittingForm, lodRequired: e.target.value })} className="w-full text-[13px] p-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white shadow-sm">
                              <option value="LOD 300">LOD 300 (Hồ sơ kỹ thuật)</option>
                              <option value="LOD 350">LOD 350 (Triển khai giao cắt)</option>
                              <option value="LOD 400">LOD 400 (Shop Drawing thi công)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Ghi chú yêu cầu riêng</label>
                          <textarea rows={3} value={fittingForm.notes} onChange={e => setFittingForm({ ...fittingForm, notes: e.target.value })} placeholder="Quy mô dự án, vướng mắc hệ thống hiện tại..." className="w-full text-[13px] p-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-y shadow-sm" />
                        </div>
                      </div>

                      <button type="submit" disabled={formLoading} className="w-full flex items-center justify-center gap-2 p-4 bg-blue-600 text-white font-bold text-[14px] rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-wait">
                        {formLoading ? 'Đang gửi thông tin...' : 'Gửi Yêu Cầu Tư Vấn'}
                        {!formLoading && <Send className="w-4 h-4" />}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-10 space-y-5 animate-in zoom-in-95 duration-300">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-500 rounded-full border border-green-100 shadow-sm mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-[16px] font-extrabold text-gray-900">Gửi Yêu Cầu Thành Công</h4>
                        <p className="text-[13px] text-gray-600 mt-2 max-w-sm mx-auto leading-relaxed">
                          Cảm ơn anh/chị <strong>{fittingForm.name}</strong>. Tôi đã ghi nhận yêu cầu xây dựng mô hình BIM {fittingForm.projectType} ở chuẩn {fittingForm.lodRequired}. Phản hồi sơ bộ sẽ được gửi qua Email trong vòng 24 giờ làm việc.
                        </p>
                      </div>
                      <button onClick={resetFittingForm} className="text-[13px] text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-5 py-2.5 rounded-xl border border-blue-100 transition-colors">
                        Gửi dự án khác
                      </button>
                    </div>
                  )}
                </section>
              )}

            </div>
            
            {/* Modal Footer */}
            <div className="p-3 bg-gray-50/50 border-t border-gray-100 text-center rounded-b-3xl">
              <p className="text-[11px] font-medium text-gray-400">
                Chuyên viên BIM Modeler - Trần Minh Hiếu
              </p>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL XEM PDF === */}
      {openPdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-5xl h-full sm:h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
            
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-[13px] font-bold text-gray-800 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" /> Trình Xem Chứng Chỉ PDF
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.open(openPdfUrl, '_blank')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Mở Tab Mới <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setOpenPdfUrl(null)} 
                  className="p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition-colors"
                  title="Đóng trình xem"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-200 relative w-full h-full">
              {/* Fallback cho Mobile Safari/Chrome chặn iframe URL ngoài */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-6 text-center z-0">
                <FileCheck className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-600 mb-4">Nếu tệp PDF không tự động tải, hãy mở trực tiếp qua tab mới.</p>
                <button 
                  onClick={() => window.open(openPdfUrl, '_blank')}
                  className="px-5 py-2.5 bg-blue-600 text-white font-bold text-[13px] rounded-xl hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
                >
                  Mở Tệp PDF <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              {/* Iframe hiển thị chính */}
              <iframe 
                src={openPdfUrl} 
                className="absolute inset-0 w-full h-full z-10 bg-white" 
                title="Trình xem PDF Chứng Chỉ"
                allow="fullscreen"
              />
            </div>
          </div>
        </div>
      )}

      {/* === MODAL ADMIN ĐĂNG NHẬP === */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-6 sm:p-8 rounded-3xl w-full max-w-sm shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <h4 className="text-[15px] font-extrabold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <Lock className="w-5 h-5 text-amber-500" /> Xác Minh Quản Trị
            </h4>
            <p className="text-[12px] text-gray-500 text-center mb-6 leading-relaxed">
              Nhập mã định danh để kích hoạt quyền hiệu chỉnh động trên website Portfolio này.
            </p>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input 
                type="password" required value={adminPassword} onChange={e => setAdminPassword(e.target.value)}
                placeholder="Mật mã hệ thống..." autoFocus
                className="w-full text-[14px] p-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-center font-mono tracking-widest shadow-inner bg-gray-50"
              />
              <div className="flex gap-2.5">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] py-3 rounded-xl transition-all shadow-md active:scale-95">
                  Xác Nhận
                </button>
                <button type="button" onClick={() => { setShowAdminLogin(false); setAdminPassword(''); }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] py-3 px-5 rounded-xl font-bold transition-all active:scale-95">
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}