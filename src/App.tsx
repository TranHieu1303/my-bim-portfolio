import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, X, ChevronRight, CheckCircle2, 
  Layers, Award, FileCheck, Box, Cpu, Calendar, ExternalLink, 
  Plus, Trash2, Edit3, ShieldAlert, Save, Link, Lock, Download
} from 'lucide-react';

// LOGO HỔ CHIBI DỄ THƯƠNG ĐỘC QUYỀN (THIẾT KẾ BẰNG SVG VECTOR ĐỒ HỌA MƯỢT MÀ)
// Nguồn ảnh: Tự vẽ trực tiếp bằng code SVG chuyên nghiệp không bị vỡ ảnh hay dính bản quyền
const TigerChibiLogo = () => (
  <svg 
    width="54" 
    height="54" 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0 transition-transform duration-500 hover:scale-110 hover:rotate-6 select-none"
  >
    {/* Tai hổ trái */}
    <ellipse cx="28" cy="24" rx="11" ry="13" fill="#F97316" stroke="#451A03" strokeWidth="3" />
    <ellipse cx="28" cy="24" rx="6" ry="8" fill="#FED7AA" />
    
    {/* Tai hổ phải */}
    <ellipse cx="72" cy="24" rx="11" ry="13" fill="#F97316" stroke="#451A03" strokeWidth="3" />
    <ellipse cx="72" cy="24" rx="6" ry="8" fill="#FED7AA" />
    
    {/* Mặt hổ tròn chibi */}
    <circle cx="50" cy="52" r="36" fill="#F97316" stroke="#451A03" strokeWidth="3.5" />
    
    {/* Má trắng chibi */}
    <ellipse cx="26" cy="62" rx="10" ry="7" fill="#FFF" />
    <ellipse cx="74" cy="62" rx="10" ry="7" fill="#FFF" />
    
    {/* Vằn trán hổ */}
    <path d="M50 20 L50 28" stroke="#451A03" strokeWidth="4" strokeLinecap="round" />
    <path d="M44 22 L44 26" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
    <path d="M56 22 L56 26" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
    
    {/* Vằn má trái */}
    <path d="M18 48 L26 50" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
    <path d="M16 54 L24 55" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
    
    {/* Vằn má phải */}
    <path d="M82 48 L74 50" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
    <path d="M84 54 L76 55" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />

    {/* Mắt tròn xoe long lanh */}
    <circle cx="37" cy="46" r="6" fill="#451A03" />
    <circle cx="35" cy="44" r="2" fill="#FFF" />
    
    {/* Mắt phải */}
    <circle cx="63" cy="46" r="6" fill="#451A03" />
    <circle cx="61" cy="44" r="2" fill="#FFF" />
    
    {/* Má hồng dễ thương */}
    <ellipse cx="27" cy="54" rx="4" ry="2.5" fill="#F87171" opacity="0.7" />
    <ellipse cx="73" cy="54" rx="4" ry="2.5" fill="#F87171" opacity="0.7" />

    {/* Mũi hổ tam giác nhỏ */}
    <polygon points="46,53 54,53 50,57" fill="#451A03" />
    
    {/* Miệng cười chibi */}
    <path d="M46 60 Q50 63 50 60 Q50 63 54 60" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
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

interface WorkflowStep {
  id: string;
  title: string;
  desc: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<string | null>(null);
  
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [openPdfUrl, setOpenPdfUrl] = useState<string | null>(null);
  const [logoClickCount, setLogoClickCount] = useState<number>(0);

  const [linkedinUrl, setLinkedinUrl] = useState<string>(() => {
    return localStorage.getItem('hieu_linkedin') || 'https://www.linkedin.com/in/tranminhhieu-bim';
  });

  const [profileText, setProfileText] = useState<string>(() => {
    return localStorage.getItem('hieu_profile_text') || "";
  });

  const [bimProjects, setBimProjects] = useState<BIMProject[]>(() => {
    const saved = localStorage.getItem('hieu_bim_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [workflows, setWorkflows] = useState<WorkflowStep[]>(() => {
    const saved = localStorage.getItem('hieu_workflows');
    return saved ? JSON.parse(saved) : [];
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('hieu_bim_certs');
    return saved ? JSON.parse(saved) : [];
  });

  const safeSetLocalStorage = useCallback((key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      alert('⚠️ Dung lượng vượt giới hạn! Vui lòng sử dụng địa chỉ liên kết (URL) thay vì tải tệp trực tiếp.');
      console.error("QuotaExceededError:", e);
    }
  }, []);

  useEffect(() => { safeSetLocalStorage('hieu_profile_text', profileText); }, [profileText, safeSetLocalStorage]);
  useEffect(() => { safeSetLocalStorage('hieu_bim_projects', JSON.stringify(bimProjects)); }, [bimProjects, safeSetLocalStorage]);
  useEffect(() => { safeSetLocalStorage('hieu_workflows', JSON.stringify(workflows)); }, [workflows, safeSetLocalStorage]);
  useEffect(() => { safeSetLocalStorage('hieu_bim_certs', JSON.stringify(certificates)); }, [certificates, safeSetLocalStorage]);
  useEffect(() => { safeSetLocalStorage('hieu_linkedin', linkedinUrl); }, [linkedinUrl, safeSetLocalStorage]);

  const [projectForm, setProjectForm] = useState({ id: '', name: '', category: 'Kết cấu BIM', desc: '', lod: 'LOD 400', tools: '' });
  const [workflowForm, setWorkflowForm] = useState({ id: '', title: '', desc: '' });
  const [certForm, setCertForm] = useState({ id: '', title: '', issuer: '', signedBy: '', status: 'Hợp lệ', date: '2026', pdfUrl: '' });
  const [fittingForm, setFittingForm] = useState({ name: '', phone: '', email: '', projectType: 'Thiết kế phối hợp BIM', lodRequired: 'LOD 400', notes: '' });
  
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

  const handleLogoClick = () => {
    const nextCount = logoClickCount + 1;
    if (nextCount >= 5) {
      setShowAdminLogin(true);
      setLogoClickCount(0);
    } else {
      setLogoClickCount(nextCount);
      const timer = setTimeout(() => setLogoClickCount(0), 3000);
      return () => clearTimeout(timer);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'hieu123') {
      setIsAdminMode(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('Mật mã quản trị chưa chính xác! Vui lòng thử lại.');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã lưu nội dung giới thiệu bản thân thành công!');
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name || !projectForm.desc) return;
    
    if (projectForm.id) {
      setBimProjects(prev => prev.map(p => p.id === projectForm.id ? {
        id: projectForm.id,
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
    setProjectForm({ id: '', name: '', category: 'Kết cấu BIM', desc: '', lod: 'LOD 400', tools: '' });
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Anh có chắc chắn muốn xóa dự án này không?')) {
      setBimProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSaveWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workflowForm.title || !workflowForm.desc) return;
    if (workflowForm.id) {
      setWorkflows(prev => prev.map(w => w.id === workflowForm.id ? workflowForm : w));
    } else {
      const newStep: WorkflowStep = {
        id: 'wf_' + Date.now(),
        title: workflowForm.title,
        desc: workflowForm.desc
      };
      setWorkflows(prev => [...prev, newStep]);
    }
    setWorkflowForm({ id: '', title: '', desc: '' });
  };

  const handleDeleteWorkflow = (id: string) => {
    if (window.confirm('Anh có chắc chắn muốn xóa bước quy trình này không?')) {
      setWorkflows(prev => prev.filter(w => w.id !== id));
    }
  };

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Hệ thống chỉ chấp nhận định dạng tệp .PDF');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('Tệp quá nặng! Vui lòng tải file dưới 2MB hoặc sử dụng dán link trực tuyến phía dưới để tối ưu hóa.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertForm(prev => ({ ...prev, pdfUrl: reader.result as string }));
        alert('Đã tải và mã hóa tệp PDF thành công!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title || !certForm.issuer) {
      alert('Vui lòng điền tên chứng chỉ và cơ quan cấp.');
      return;
    }
    if (certForm.id) {
      setCertificates(prev => prev.map(c => c.id === certForm.id ? certForm : c));
    } else {
      const newCert: Certificate = {
        id: 'cert_' + Date.now(),
        title: certForm.title,
        issuer: certForm.issuer,
        signedBy: certForm.signedBy,
        status: certForm.status,
        date: certForm.date,
        pdfUrl: certForm.pdfUrl
      };
      setCertificates(prev => [...prev, newCert]);
    }
    setCertForm({ id: '', title: '', issuer: '', signedBy: '', status: 'Hợp lệ', date: '2026', pdfUrl: '' });
  };

  const handleDeleteCert = (id: string) => {
    if (window.confirm('Anh có chắc muốn gỡ bỏ chứng chỉ này không?')) {
      setCertificates(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleDownloadBackup = () => {
    const backupData = { profileText, projects: bimProjects, workflows, certificates, linkedin: linkedinUrl };
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
    setFittingForm({ name: '', phone: '', email: '', projectType: 'Thiết kế phối hợp BIM', lodRequired: 'LOD 400', notes: '' });
    setFormSubmitted(false);
  };

  const TABS = [
    { id: 'Profile', label: 'Hồ Sơ' },
    { id: 'Projects', label: 'Dự Án' },
    { id: 'Workflow', label: 'Quy Trình' },
    { id: 'Certificates', label: 'Chứng Chỉ' },
    { id: 'Contact', label: 'Liên Hệ' }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f0f0ee] font-sans antialiased text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
        autoPlay muted loop playsInline preload="auto"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/35 pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        
        <header className="w-full px-4 sm:px-8 pt-4 sm:pt-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div 
              onClick={handleLogoClick}
              className="flex items-center gap-3.5 backdrop-blur-md bg-white/95 p-2.5 sm:p-3 rounded-2xl shadow-lg border border-white/40 cursor-pointer select-none active:scale-[0.98] transition-all duration-200"
              title="Nhấp liên tục 5 lần để đăng nhập Quản trị"
            >
              <TigerChibiLogo />
              <div className="flex flex-col text-left">
                <span className="text-[13px] font-black text-blue-700 tracking-wide leading-tight">
                  Trần Minh Hiếu
                </span>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-0.5">
                  BIM Modeler Portfolio
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-2 self-stretch md:self-auto w-full md:w-auto">
              <button 
                onClick={() => setActiveTab(null)}
                className="flex items-center justify-center rounded-full w-11 h-11 shrink-0 backdrop-blur-md bg-white/80 hover:bg-white transition-all shadow-sm border border-white/50" 
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

        <main className="flex-1 flex items-end pb-24 sm:pb-28 lg:pb-32 px-6 sm:px-12 md:px-20 lg:px-28">
          <section className="max-w-md backdrop-blur-xl bg-white/85 p-6 sm:p-8 rounded-3xl border border-white/50 shadow-2xl">
            
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
              ✓ Xác thực Văn Bằng / Chứng Chỉ (Xem PDF)
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>

            <h1 className="text-[1.6rem] sm:text-[1.8rem] leading-[1.25] font-extrabold text-gray-900 tracking-tight mb-3">
              Mô hình hóa BIM chuẩn xác & Phối hợp chuyên nghiệp.
            </h1>

            <p className="text-[13px] sm:text-[14px] text-gray-600 font-medium mb-6 leading-relaxed">
              Kiến tạo các mô hình số hóa 3D với độ chi tiết cao và kiểm soát xung đột hệ thống hoàn hảo trước khi thi công thực tế tại công trường.
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

        {isAdminMode && (
          <div className="absolute bottom-6 left-6 sm:left-12 flex items-center gap-2 z-20">
            <button 
              onClick={() => setIsAdminMode(false)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white border border-amber-600 shadow-lg backdrop-blur-md active:scale-95 transition-all animate-pulse"
            >
              <Lock className="w-4 h-4" /> Thoát Admin
            </button>
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-1.5 bg-green-600/90 backdrop-blur-md text-white px-3 py-2 rounded-xl text-xs font-bold border border-green-500 hover:bg-green-600 transition-all shadow-lg active:scale-95"
            >
              <Download className="w-4 h-4" /> Sao Lưu Data
            </button>
          </div>
        )}

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

      {activeTab && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300">
          
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[90vh]">
            
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
                  {activeTab === 'Profile' && 'Hồ Sơ & Giới Thiệu'}
                  {activeTab === 'Projects' && 'Dự Án BIM Cá Nhân'}
                  {activeTab === 'Workflow' && 'Quy Trình Triển Lãm'}
                  {activeTab === 'Certificates' && 'Văn Bằng & Chứng Chỉ'}
                  {activeTab === 'Contact' && 'Liên Hệ Trao Đổi'}
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

            <div className="p-5 sm:p-6 overflow-y-auto flex-1">
              
              {/* === TAB HỒ SƠ === */}
              {activeTab === 'Profile' && (
                <section className="space-y-4">
                  {isAdminMode ? (
                    <form onSubmit={handleSaveProfile} className="space-y-3">
                      <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Viết nội dung giới thiệu bản thân</label>
                      <textarea 
                        rows={8}
                        value={profileText} 
                        onChange={e => setProfileText(e.target.value)}
                        placeholder="Hãy tự giới thiệu kỹ năng, vai trò và mong muốn hợp tác của anh tại đây..."
                        className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y bg-gray-50"
                      />
                      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                        <Save className="w-4 h-4" /> Lưu Lời Giới Thiệu
                      </button>
                    </form>
                  ) : (
                    profileText ? (
                      <div className="p-5 bg-gradient-to-br from-blue-50/50 to-indigo-50/35 rounded-2xl border border-blue-100 shadow-sm">
                        <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">{profileText}</p>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-400 italic text-[13px]">Nội dung đang trống. Hãy click 5 lần vào Logo và dùng quyền Admin để biên soạn.</div>
                    )
                  )}
                </section>
              )}

              {/* === TAB DỰ ÁN === */}
              {activeTab === 'Projects' && (
                <section className="space-y-4">
                  {isAdminMode && (
                    <form onSubmit={handleSaveProject} className="p-4 sm:p-5 border border-dashed border-blue-300 rounded-2xl bg-blue-50/50 mb-5 space-y-3">
                      <h4 className="text-[13px] font-bold text-blue-900 uppercase flex items-center gap-1.5 mb-2">
                        <Plus className="w-4 h-4" /> {projectForm.id ? 'Sửa thông tin dự án' : 'Thêm dự án BIM mới'}
                      </h4>
                      <input 
                        type="text" placeholder="Tên công trình/dự án..." value={projectForm.name} required
                        onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                        className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white focus:ring-2 focus:ring-blue-500/20"
                      />
                      <textarea 
                        placeholder="Mô tả các hạng mục điều phối kỹ thuật..." value={projectForm.desc} required
                        onChange={e => setProjectForm({ ...projectForm, desc: e.target.value })}
                        className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white focus:ring-2 focus:ring-blue-500/20 min-h-[80px]"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input 
                          type="text" placeholder="Phân loại (vd: Kết cấu BIM)" value={projectForm.category}
                          onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                          className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none"
                        />
                        <input 
                          type="text" placeholder="Chuẩn LOD (vd: LOD 400)" value={projectForm.lod}
                          onChange={e => setProjectForm({ ...projectForm, lod: e.target.value })}
                          className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none"
                        />
                      </div>
                      <input 
                        type="text" placeholder="Các công cụ dùng (cách nhau bằng dấu phẩy: Revit, Dynamo...)" value={projectForm.tools}
                        onChange={e => setProjectForm({ ...projectForm, tools: e.target.value })}
                        className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none"
                      />
                      <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                          <Save className="w-4 h-4" /> Lưu Dự Án
                        </button>
                        {projectForm.id && (
                          <button type="button" onClick={() => setProjectForm({ id: '', name: '', category: 'Kết cấu BIM', desc: '', lod: 'LOD 400', tools: '' })} className="bg-gray-200 text-gray-700 text-[13px] font-bold px-4 rounded-xl">
                            Hủy
                          </button>
                        )}
                      </div>
                    </form>
                  )}

                  {bimProjects.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 italic text-[13px]">Danh sách dự án trống. Hãy sử dụng quyền Admin để tạo dự án mới.</div>
                  ) : (
                    bimProjects.map((project) => (
                      <article key={project.id} className="border border-gray-100 hover:border-blue-200 hover:shadow-md bg-white rounded-2xl p-5 transition-all relative group">
                        {isAdminMode && (
                          <div className="absolute top-4 right-4 flex gap-2 z-10">
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

              {/* === TAB QUY TRÌNH === */}
              {activeTab === 'Workflow' && (
                <section className="space-y-3">
                  {isAdminMode && (
                    <form onSubmit={handleSaveWorkflow} className="p-4 sm:p-5 border border-dashed border-blue-300 rounded-2xl bg-blue-50/50 mb-5 space-y-3">
                      <h4 className="text-[13px] font-bold text-blue-900 uppercase flex items-center gap-1.5 mb-2">
                        <Plus className="w-4 h-4" /> {workflowForm.id ? 'Sửa bước quy trình' : 'Thêm bước quy trình mới'}
                      </h4>
                      <input 
                        type="text" placeholder="Tên bước (vd: Bước 1: Tiếp nhận BEP...)" value={workflowForm.title} required
                        onChange={e => setWorkflowForm({ ...workflowForm, title: e.target.value })}
                        className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white focus:ring-2"
                      />
                      <textarea 
                        placeholder="Mô tả chi tiết triển khai bước..." value={workflowForm.desc} required
                        onChange={e => setWorkflowForm({ ...workflowForm, desc: e.target.value })}
                        className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white focus:ring-2 min-h-[80px]"
                      />
                      <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold py-3 rounded-xl transition-colors">
                          Lưu Bước Quy Trình
                        </button>
                        {workflowForm.id && (
                          <button type="button" onClick={() => setWorkflowForm({ id: '', title: '', desc: '' })} className="bg-gray-200 text-gray-700 text-[13px] font-bold px-4 rounded-xl">
                            Hủy
                          </button>
                        )}
                      </div>
                    </form>
                  )}

                  {workflows.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 italic text-[13px]">Chưa có quy trình được thiết lập. Hãy bật Admin để thêm mới.</div>
                  ) : (
                    workflows.map((step) => (
                      <div key={step.id} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md relative">
                        {isAdminMode && (
                          <div className="absolute top-3 right-12 flex gap-2 z-10">
                            <button onClick={() => setWorkflowForm(step)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteWorkflow(step.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <button 
                          onClick={() => setActiveWorkflowStep(activeWorkflowStep === step.id ? null : step.id)}
                          className="w-full text-left p-4 hover:bg-gray-50 flex justify-between items-center transition-colors"
                        >
                          <span className="text-[13px] font-bold text-gray-800 pr-20">{step.title}</span>
                          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${activeWorkflowStep === step.id ? 'rotate-90' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${activeWorkflowStep === step.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="p-4 pt-0 bg-white text-[13px] text-gray-600 leading-relaxed border-t border-gray-50 mt-2 whitespace-pre-wrap">
                            {step.desc}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </section>
              )}

              {/* === TAB CHỨNG CHỈ === */}
              {activeTab === 'Certificates' && (
                <section className="space-y-4">
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
                      <h4 className="text-[13px] font-bold text-green-900">Tính Xác Thực Văn Bằng</h4>
                      <p className="text-[13px] text-green-700/90 leading-relaxed mt-1">
                        Chứng chỉ được bảo đảm tính pháp lý khi được kết nối trực tiếp đến nguồn tệp lưu trữ PDF gốc.
                      </p>
                    </div>
                  </div>

                  {isAdminMode && (
                    <form onSubmit={handleSaveCert} className="p-4 sm:p-5 border border-dashed border-amber-300 rounded-2xl bg-amber-50/50 mb-5 space-y-4">
                      <h4 className="text-[13px] font-bold text-amber-900 uppercase flex items-center gap-1.5 mb-1">
                        <Plus className="w-4 h-4" /> {certForm.id ? 'Sửa văn bằng' : 'Thêm văn bằng mới'}
                      </h4>
                      
                      <div className="p-4 bg-white rounded-xl border border-gray-100 space-y-2 shadow-sm">
                        <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                          {"Mã hóa File từ máy tính của anh (< 2MB)"}
                        </label>
                        <input type="file" accept="application/pdf" onChange={handlePdfFileChange} className="w-full text-[12px] cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[12px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"/>
                        <p className="text-[10px] text-amber-600 italic">* Lưu ý: Để mọi người đều có thể xem được, khuyên dùng dán URL Drive/GitHub công khai ở phía dưới.</p>
                      </div>

                      <div className="flex items-center gap-3 text-gray-400">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">HOẶC DÁN ĐƯỜNG DẪN PDF CÔNG KHAI</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                      </div>

                      <input 
                        type="url" 
                        placeholder="Dán link PDF Google Drive, Dropbox hoặc GitHub..." 
                        value={certForm.pdfUrl} 
                        onChange={e => setCertForm({ ...certForm, pdfUrl: e.target.value })} 
                        className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white focus:ring-2 focus:ring-amber-500/20 font-mono text-blue-600"
                      />
                      
                      <input type="text" placeholder="Tiêu đề chứng chỉ..." value={certForm.title} required onChange={e => setCertForm({ ...certForm, title: e.target.value })} className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white focus:ring-2 focus:ring-amber-500/20"/>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Cơ quan cấp..." value={certForm.issuer} required onChange={e => setCertForm({ ...certForm, issuer: e.target.value })} className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white" />
                        <input type="text" placeholder="Năm cấp..." value={certForm.date} required onChange={e => setCertForm({ ...certForm, date: e.target.value })} className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white" />
                      </div>

                      <input type="text" placeholder="Người ký xác minh..." value={certForm.signedBy} onChange={e => setCertForm({ ...certForm, signedBy: e.target.value })} className="w-full text-[13px] p-3 rounded-xl border border-gray-200 outline-none bg-white"/>

                      <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-[13px] font-bold py-3 rounded-xl transition-colors shadow-sm flex justify-center items-center gap-1.5">
                          <Save className="w-4 h-4" /> Lưu
                        </button>
                        {certForm.id && (
                          <button type="button" onClick={() => setCertForm({ id: '', title: '', issuer: '', signedBy: '', status: 'Hợp lệ', date: '2026', pdfUrl: '' })} className="bg-gray-200 text-gray-700 text-[13px] font-bold px-4 rounded-xl transition-colors">
                            Hủy
                          </button>
                        )}
                      </div>
                    </form>
                  )}

                  <div className="space-y-4">
                    {certificates.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 italic text-[13px]">Danh sách văn bằng đang trống. Hãy dùng quyền Admin tải lên chứng chỉ của anh.</div>
                    ) : (
                      certificates.map((cert) => (
                        <article key={cert.id} className="p-4 sm:p-5 rounded-2xl border border-gray-100 bg-white hover:shadow-md hover:border-blue-100 transition-all relative group">
                          {isAdminMode && (
                            <div className="absolute top-4 right-4 flex gap-2 z-10">
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
                              Năm cấp: {cert.date}
                            </span>
                            <span className="text-[11px] text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {cert.status || 'Hợp lệ'}
                            </span>
                          </div>
                          <h4 className="text-[14px] font-extrabold text-gray-900 mt-2 pr-16">{cert.title}</h4>
                          <p className="text-[12px] font-medium text-gray-500 mt-1">Cơ quan: {cert.issuer}</p>
                          
                          <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex items-center justify-between text-[11.5px]">
                            <span className="text-gray-400 italic">Ký xác nhận: {cert.signedBy || 'Hệ thống'}</span>
                            {cert.pdfUrl ? (
                              <button 
                                onClick={() => setOpenPdfUrl(cert.pdfUrl)}
                                className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1.5 transition-colors bg-blue-50/50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-50"
                              >
                                Xem PDF <FileCheck className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="text-gray-400 font-medium flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg">
                                Chưa liên kết PDF
                              </span>
                            )}
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </section>
              )}

              {/* === TAB CONTACT === */}
              {activeTab === 'Contact' && (
                <section>
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

                        <div>
                          <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Ghi chú yêu cầu riêng</label>
                          <textarea rows={3} value={fittingForm.notes} onChange={e => setFittingForm({ ...fittingForm, notes: e.target.value })} placeholder="Quy mô dự án, vướng mắc hệ thống hiện tại..." className="w-full text-[13px] p-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-y shadow-sm" />
                        </div>
                      </div>

                      <button type="submit" disabled={formLoading} className="w-full flex items-center justify-center gap-2 p-4 bg-blue-600 text-white font-bold text-[14px] rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-wait">
                        {formLoading ? 'Đang gửi thông tin...' : 'Gửi Yêu Cầu Tư Vấn'}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-10 space-y-5">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-500 rounded-full border border-green-100 shadow-sm mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-[16px] font-extrabold text-gray-900">Gửi Yêu Cầu Thành Công</h4>
                        <p className="text-[13px] text-gray-600 mt-2 max-w-sm mx-auto leading-relaxed">
                          Cảm ơn anh/chị <strong>{fittingForm.name}</strong>. Tôi đã ghi nhận yêu cầu triển khai của anh/chị. Phản hồi sẽ được gửi sớm nhất có thể.
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md">
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
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-200 relative w-full h-full">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white p-6 sm:p-8 rounded-3xl w-full max-w-sm shadow-2xl border border-gray-100">
            <h4 className="text-[15px] font-extrabold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" /> Xác Minh Quản Trị
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