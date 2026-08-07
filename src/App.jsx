import React, { useState, useRef } from 'react';
import {
  Bell,
  Bookmark,
  Grid,
  LogOut,
  Eye,
  EyeOff,
  Copy,
  Send,
  CreditCard,
  Receipt,
  Wallet,
  GraduationCap,
  QrCode,
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Sparkles,
  X,
  ChevronRight,
  Utensils,
  School,
  Store,
  Building2,
  Smartphone,
  Link2,
  Trophy,
  Home,
  PieChart,
  TrendingUp,
  User,
  ArrowLeftRight,
  Check,
  Download,
  Share2,
  Users,
  ChevronLeft,
  Zap
} from 'lucide-react';

import { initialStudentsData } from './dummyData';
import MerchantKantin from './components/MerchantKantin';
import SchoolTreasury from './components/SchoolTreasury';

export default function App() {
  // Global Shared State for Students Data
  const [studentsData, setStudentsData] = useState(initialStudentsData);
  const [selectedStudentId, setSelectedStudentId] = useState('akbar');

  // Top Level Mode: 'parent' (Screen 1 & 2) | 'merchant' (Screen 3 POS) | 'treasury' (Screen 4 B2B Portal)
  const [appMode, setAppMode] = useState('parent');

  // Active Mode Ecosystem: 'sekolah' (K-12) | 'kampus' (University)
  const [currentMode, setCurrentMode] = useState('sekolah');

  // Screen inside Parent Mode: 'home' (Screen 1) | 'education' (Screen 2)
  const [currentScreen, setCurrentScreen] = useState('home');
  const [activeTab, setActiveTab] = useState('home');
  const [showBalance, setShowBalance] = useState(true);

  // Live Toast & Push Notification System
  const [toastMessage, setToastMessage] = useState(null);
  const [pushNotification, setPushNotification] = useState(null);

  // Modals state
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showKprModal, setShowKprModal] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [showStudentSelectorSheet, setShowStudentSelectorSheet] = useState(false);
  const [activeCampusSheet, setActiveCampusSheet] = useState(null);

  // Ref & Drag state for Promo Carousel
  const promoCarouselRef = useRef(null);
  const [isDraggingCarousel, setIsDraggingCarousel] = useState(false);
  const [carouselStartX, setCarouselStartX] = useState(0);
  const [carouselScrollLeft, setCarouselScrollLeft] = useState(0);

  const handleCarouselMouseDown = (e) => {
    if (!promoCarouselRef.current) return;
    setIsDraggingCarousel(true);
    setCarouselStartX(e.pageX - promoCarouselRef.current.offsetLeft);
    setCarouselScrollLeft(promoCarouselRef.current.scrollLeft);
  };

  const handleCarouselMouseUp = () => {
    setIsDraggingCarousel(false);
  };

  const handleCarouselMouseMove = (e) => {
    if (!isDraggingCarousel || !promoCarouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - promoCarouselRef.current.offsetLeft;
    const walk = (x - carouselStartX) * 1.5;
    promoCarouselRef.current.scrollLeft = carouselScrollLeft - walk;
  };

  // Current active student object
  const student = studentsData[selectedStudentId] || studentsData.akbar;

  // Trigger Toast Notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Trigger Push Notification Banner (Top of Screen)
  const triggerPushNotification = (msg) => {
    setPushNotification(msg);
    setTimeout(() => setPushNotification(null), 5000);
  };

  // Handle slider change for daily allowance limit in Screen 2
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setStudentsData((prev) => ({
      ...prev,
      [selectedStudentId]: {
        ...prev[selectedStudentId],
        dailyLimit: newLimit
      }
    }));
  };

  // Handle Transaction Processed by Merchant POS (Screen 3 Engine)
  const handleProcessTransaction = ({ studentId, amount, itemSummary, cartItems }) => {
    const targetStudent = studentsData[studentId];
    const newSpent = targetStudent.spentToday + amount;
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const newHistoryRecord = {
      id: Date.now(),
      title: itemSummary,
      time: nowTime,
      price: amount,
      status: 'Berhasil'
    };

    setStudentsData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        spentToday: newSpent,
        canteenHistory: [newHistoryRecord, ...prev[studentId].canteenHistory]
      }
    }));

    // Trigger push notification banner visible across modes
    triggerPushNotification(`🔔 Transaksi Kantin: ${targetStudent.name} baru saja membeli ${itemSummary} (Rp ${amount.toLocaleString('id-ID')})`);
  };

  // Copy Account Number
  const handleCopyAccount = () => {
    navigator.clipboard?.writeText('0223383830');
    triggerToast('Nomor rekening 0223383830 disalin!');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start p-0 md:p-6 text-slate-800 selection:bg-[#72DFD0]">
      
      {/* Top Desktop Navigation Header & Ecosystem Mode Switcher */}
      <div className="w-full max-w-7xl mb-4 px-4 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#72DFD0] text-slate-900 p-2.5 rounded-2xl font-bold flex items-center justify-center shadow-lg shadow-[#72DFD0]/20">
            <GraduationCap className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-white text-xl font-extrabold tracking-tight">wondr for Education</h1>
              <span className="bg-[#D4F933] text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Ecosystem v3.5</span>
            </div>
            <p className="text-slate-400 text-xs font-medium">Platform Keuangan Sekolah, POS Kantin & Portal Bendahara B2B BNI Open API</p>
          </div>
        </div>

        {/* TOP NAVBAR SIMULATOR TOGGLE: Mode Sekolah vs Mode Kampus */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/60 shadow-xl gap-1">
            <button
              onClick={() => {
                setCurrentMode('sekolah');
                triggerToast('Mode Aktif: Mode Sekolah (K-12)');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                currentMode === 'sekolah'
                  ? 'bg-[#72DFD0] text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎒 Mode Sekolah (K-12)
            </button>
            <button
              onClick={() => {
                setCurrentMode('kampus');
                triggerToast('Mode Aktif: Mode Kampus (University)');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                currentMode === 'kampus'
                  ? 'bg-[#72DFD0] text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎓 Mode Kampus (University)
            </button>
          </div>

          {/* MODE SWITCHER BUTTONS (4 Screens Access) */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/60 shadow-xl">
            <button
              onClick={() => { setAppMode('parent'); setCurrentScreen('home'); }}
              className={`px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                appMode === 'parent' && currentScreen === 'home'
                  ? 'bg-[#72DFD0] text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Screen 1: Home
            </button>

            <button
              onClick={() => { setAppMode('parent'); setCurrentScreen('education'); }}
              className={`px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                appMode === 'parent' && currentScreen === 'education'
                  ? 'bg-[#72DFD0] text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              {currentMode === 'kampus' ? 'Screen 2: Student Hub' : 'Screen 2: Parent Hub'}
            </button>

            <button
              onClick={() => setAppMode('merchant')}
              className={`px-3 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 ${
                appMode === 'merchant'
                  ? 'bg-gradient-to-r from-[#FF7A00] to-[#F37021] text-white shadow-lg shadow-[#F37021]/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4 text-amber-300" />
              Screen 3: POS Kantin
            </button>

            <button
              onClick={() => setAppMode('treasury')}
              className={`px-3 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 ${
                appMode === 'treasury'
                  ? 'bg-[#005E6A] text-white shadow-lg shadow-[#005E6A]/40 ring-1 ring-teal-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#72DFD0]" />
              Screen 4: Portal B2B
            </button>
          </div>
        </div>
      </div>

      {/* SCREEN 4: FULL DESKTOP B2B SCHOOL PORTAL (Renders 100% width, outside mobile frame) */}
      {appMode === 'treasury' ? (
        <div className="w-full max-w-7xl animate-in fade-in duration-300">
          <SchoolTreasury currentMode={currentMode} onTriggerNotification={triggerPushNotification} />
        </div>
      ) : (
        /* SCREEN 1, 2, 3: MOBILE PHONE FRAME CONTAINER */
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Side Panel: Interactive Guide */}
          <div className="hidden md:block md:col-span-4 lg:col-span-4 space-y-4">
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 p-5 rounded-3xl text-slate-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4F933]" />
                  Modul Ekosistem wondr
                </h2>
                <span className="text-[10px] bg-slate-700 text-[#72DFD0] px-2 py-0.5 rounded-full font-mono">
                  BNI Open API
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Ekosistem terintegrasi menghubungkan Aplikasi Orang Tua, Mesin Kasir Kantin, dan Portal Keuangan Bendahara Sekolah:
              </p>

              <div className="space-y-2 text-xs">
                <button
                  onClick={() => { setAppMode('parent'); setCurrentScreen('home'); }}
                  className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    appMode === 'parent' && currentScreen === 'home' ? 'bg-[#72DFD0]/10 border-[#72DFD0] text-white' : 'bg-slate-900/40 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-[#72DFD0]" />
                    <span>1. wondr Mobile App</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => { setAppMode('parent'); setCurrentScreen('education'); }}
                  className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    appMode === 'parent' && currentScreen === 'education' ? 'bg-[#72DFD0]/10 border-[#72DFD0] text-white' : 'bg-slate-900/40 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-[#D4F933]" />
                    <span>2. Parent Control Hub</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setAppMode('merchant')}
                  className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    appMode === 'merchant' ? 'bg-[#F37021]/10 border-[#F37021] text-white' : 'bg-slate-900/40 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Store className="w-4 h-4 text-amber-400" />
                    <span>3. Canteen Merchant POS</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setAppMode('treasury')}
                  className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    appMode === 'treasury' ? 'bg-teal-500/10 border-teal-400 text-white' : 'bg-slate-900/40 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-teal-400" />
                    <span>4. Portal Sekolah (Full Desktop)</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Profile Switcher Card */}
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 p-4 rounded-3xl text-slate-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">Simulasi Profil Siswa</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setSelectedStudentId('akbar'); triggerToast('Profil aktif: Akbar (SMA 1 Surabaya)'); }}
                  className={`p-2.5 rounded-2xl text-left border transition-all flex items-center gap-2.5 ${
                    selectedStudentId === 'akbar'
                      ? 'bg-[#72DFD0]/10 border-[#72DFD0] text-white'
                      : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <img src={studentsData.akbar.avatar} alt="Akbar" className="w-8 h-8 rounded-full border border-emerald-400" />
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs truncate">Akbar</p>
                    <p className="text-[10px] text-slate-400 truncate">SMA 1 Surabaya</p>
                  </div>
                </button>

                <button
                  onClick={() => { setSelectedStudentId('aisha'); triggerToast('Profil aktif: Aisha (SMP 2 Surabaya)'); }}
                  className={`p-2.5 rounded-2xl text-left border transition-all flex items-center gap-2.5 ${
                    selectedStudentId === 'aisha'
                      ? 'bg-[#72DFD0]/10 border-[#72DFD0] text-white'
                      : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <img src={studentsData.aisha.avatar} alt="Aisha" className="w-8 h-8 rounded-full border border-purple-400" />
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs truncate">Aisha</p>
                    <p className="text-[10px] text-slate-400 truncate">SMP 2 Surabaya</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Center Mobile Smartphone Frame Container */}
          <div className="col-span-1 md:col-span-8 lg:col-span-8 flex justify-center">
            
            {/* Smartphone Frame (max-width: 412px) */}
            <div className="w-full max-w-[412px] bg-[#F8FAFC] min-h-[850px] max-h-[92vh] rounded-[48px] border-[8px] border-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col relative overflow-hidden ring-1 ring-slate-800 select-none">
              
              {/* Status Bar */}
              <div className="bg-[#F8FAFC] pt-3 px-6 pb-2 flex items-center justify-between text-xs font-semibold text-slate-900 shrink-0 z-30 relative">
                <span>09:41</span>
                
                <div className="w-24 h-4 bg-slate-950 rounded-full absolute left-1/2 -translate-x-1/2 top-2.5 flex items-center justify-end px-2">
                  <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800"></div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-900">
                  <span className="text-[10px] font-extrabold tracking-tighter">5G</span>
                  <div className="w-5 h-2.5 border border-slate-900 rounded-xs p-0.5 flex items-center">
                    <div className="h-full w-full bg-slate-900 rounded-2xs"></div>
                  </div>
                </div>
              </div>

              {/* PUSH NOTIFICATION BANNER */}
              {pushNotification && (
                <div className="absolute top-10 left-3 right-3 bg-slate-900/95 text-white text-xs font-semibold p-3 rounded-2xl shadow-2xl z-50 border border-emerald-500/50 animate-in slide-in-from-top-4 duration-300 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 font-bold mt-0.5">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div className="flex-1 pr-2">
                    <p className="text-[10px] text-[#72DFD0] font-bold">Notifikasi Transaksi Real-Time</p>
                    <p className="text-[11px] leading-snug mt-0.5">{pushNotification}</p>
                  </div>
                  <button onClick={() => setPushNotification(null)} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* TOAST ALERT OVERLAY */}
              {toastMessage && (
                <div className="absolute top-10 left-4 right-4 bg-slate-900/95 text-white text-xs font-medium py-3 px-4 rounded-2xl shadow-2xl z-50 flex items-center justify-between border border-slate-700 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#72DFD0] animate-ping"></div>
                    <span>{toastMessage}</span>
                  </div>
                  <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* MAIN MOBILE CONTENT */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative flex flex-col">
                
                {/* SCREEN 3: KASIR KANTIN POS ENGINE */}
                {appMode === 'merchant' && (
                  <MerchantKantin
                    currentMode={currentMode}
                    studentsData={studentsData}
                    selectedStudentId={selectedStudentId}
                    onSelectStudent={(id) => setSelectedStudentId(id)}
                    onProcessTransaction={handleProcessTransaction}
                    onTriggerNotification={triggerPushNotification}
                  />
                )}

                {/* SCREEN 1 & 2: PARENT WONDR APP */}
                {appMode === 'parent' && (
                  <>
                    {/* SCREEN 1: WONDR HOME PAGE */}
                    {currentScreen === 'home' && (
                      <div className="p-4 space-y-4 pb-24 animate-in fade-in duration-300">
                        
                        {/* Top Header */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={currentMode === 'kampus' ? student.avatar : "https://i.pravatar.cc/150?img=32"}
                                alt={currentMode === 'kampus' ? "Akbar Putra" : "Karnisa"}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                              />
                              <div>
                                <p className="text-[11px] text-slate-500 font-medium">
                                  {currentMode === 'kampus' ? 'Selamat Pagi, Akbar!' : 'Selamat Pagi,'}
                                </p>
                                <h2 className="text-slate-900 font-extrabold text-xs md:text-sm tracking-tight leading-tight">
                                  {currentMode === 'kampus' ? 'Dashboard Keuangan Mahasiswa (Akbar - Unair)' : 'Hai, Karnisa!'}
                                </h2>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-slate-700">
                              <button
                                onClick={() => setShowNotificationDrawer(true)}
                                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center relative shadow-xs border border-slate-100 text-slate-700"
                              >
                                <Bell className="w-4 h-4" />
                                <span className="w-2 h-2 bg-red-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white"></span>
                              </button>

                              <button className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center shadow-xs border border-slate-100 text-slate-700">
                                <Bookmark className="w-4 h-4" />
                              </button>

                              <button className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center shadow-xs border border-slate-100 text-slate-700">
                                <Grid className="w-4 h-4" />
                              </button>

                              <button className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center shadow-xs border border-slate-100 text-red-500">
                                <LogOut className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* 3 Pill Tabs */}
                          <div className="flex items-center bg-slate-200/70 p-1 rounded-full text-xs font-bold text-slate-600">
                            <button
                              onClick={() => setActiveTab('insights')}
                              className={`flex-1 py-1.5 text-center rounded-full transition-all ${
                                activeTab === 'insights' ? 'bg-[#D4F933] text-slate-950 shadow-xs' : 'hover:text-slate-900'
                              }`}
                            >
                              Insights
                            </button>
                            <button
                              onClick={() => setActiveTab('transaksi')}
                              className={`flex-1 py-1.5 text-center rounded-full transition-all ${
                                activeTab === 'transaksi' ? 'bg-[#D4F933] text-slate-950 shadow-xs' : 'hover:text-slate-900'
                              }`}
                            >
                              Transaksi
                            </button>
                            <button
                              onClick={() => setActiveTab('growth')}
                              className={`flex-1 py-1.5 text-center rounded-full transition-all ${
                                activeTab === 'growth' ? 'bg-[#D4F933] text-slate-950 shadow-xs' : 'hover:text-slate-900'
                              }`}
                            >
                              Growth
                            </button>
                          </div>
                        </div>

                        {/* BNI Taplus Main Card */}
                        <div className="bg-gradient-to-br from-[#FF7A00] via-[#F37021] to-[#D85A10] p-5 rounded-3xl text-white shadow-xl shadow-[#F37021]/25 relative overflow-hidden border border-orange-400/30">
                          <div className="absolute right-4 top-4 opacity-90">
                            <img src="/assets/bni-logo.png" alt="BNI Logo" className="h-6 object-contain bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-xs" />
                          </div>

                          <div className="space-y-4">
                            <div>
                              <span className="text-[10px] tracking-wider uppercase bg-black/20 text-orange-100 font-semibold px-2 py-0.5 rounded-full border border-white/10">
                                {currentMode === 'kampus' ? 'KTM Co-Brand BNI Unair' : 'Utama'}
                              </span>
                              <h3 className="font-extrabold text-base tracking-wide mt-1">
                                {currentMode === 'kampus' ? 'BNI Taplus Muda' : 'BNI Taplus'}
                              </h3>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 text-orange-100 text-xs font-medium">
                                <span>{currentMode === 'kampus' ? 'Saldo Tabungan Mahasiswa' : 'Saldo Rekening Utama'}</span>
                                <button onClick={() => setShowBalance(!showBalance)} className="hover:text-white">
                                  {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                              <p className="text-2xl font-black tracking-tight mt-0.5">
                                {showBalance ? (currentMode === 'kampus' ? 'Rp4.850.000' : 'Rp28.000.000') : '••••••••••••'}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs">
                              <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-xl">
                                <span className="font-mono text-slate-100 font-semibold">0223383830</span>
                                <button onClick={handleCopyAccount} className="hover:text-amber-200">
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <button className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-xl font-bold text-[11px]">
                                + Top Up
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Grid Menu "Fitur pilihan kamu" */}
                        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-sm">Fitur pilihan kamu</h3>
                            <button className="text-xs text-[#00A396] font-semibold hover:underline">Kelola</button>
                          </div>

                          <div className="grid grid-cols-3 gap-3 pt-1">
                            <button className="flex flex-col items-center gap-2 group">
                              <div className="w-13 h-13 rounded-2xl bg-[#E6FBF8] text-[#00A396] flex items-center justify-center shadow-xs">
                                <Send className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-semibold text-slate-700">Transfer</span>
                            </button>

                            <button className="flex flex-col items-center gap-2 group">
                              <div className="w-13 h-13 rounded-2xl bg-[#E6FBF8] text-[#00A396] flex items-center justify-center shadow-xs">
                                <CreditCard className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-semibold text-slate-700">Tapcash</span>
                            </button>

                            <button className="flex flex-col items-center gap-2 group">
                              <div className="w-13 h-13 rounded-2xl bg-[#E6FBF8] text-[#00A396] flex items-center justify-center shadow-xs">
                                <Receipt className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-semibold text-slate-700">Bayar & Beli</span>
                            </button>

                            <button className="flex flex-col items-center gap-2 group">
                              <div className="w-13 h-13 rounded-2xl bg-[#E6FBF8] text-[#00A396] flex items-center justify-center shadow-xs">
                                <Wallet className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-semibold text-slate-700">E-Wallet</span>
                            </button>

                            {/* Edukasi / Kampus Hub */}
                            <button
                              onClick={() => setCurrentScreen('education')}
                              className="flex flex-col items-center gap-2 group relative"
                            >
                              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#72DFD0] to-[#00B4A2] text-slate-950 flex items-center justify-center shadow-md shadow-[#72DFD0]/40 border-2 border-white animate-pulse-glow">
                                <GraduationCap className="w-7 h-7 text-slate-950" />
                                <span className="absolute -top-2 -right-1 bg-[#D4F933] text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full uppercase border border-slate-900">
                                  BARU
                                </span>
                              </div>
                              <span className="text-xs font-bold text-slate-900">
                                {currentMode === 'kampus' ? 'Campus Hub' : 'Edukasi & Anak'}
                              </span>
                            </button>

                            <button className="flex flex-col items-center gap-2 group">
                              <div className="w-13 h-13 rounded-2xl bg-[#E6FBF8] text-[#00A396] flex items-center justify-center shadow-xs">
                                <QrCode className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-semibold text-slate-700">Virtual Account</span>
                            </button>
                          </div>
                        </div>

                        {/* Promo Hub Banner */}
                        <div
                          onClick={() => setCurrentScreen('education')}
                          className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 rounded-3xl text-white shadow-md cursor-pointer hover:border-[#72DFD0]/50 border border-slate-800 transition-all flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#72DFD0] text-slate-950 flex items-center justify-center shrink-0">
                              <School className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-bold text-xs">
                                  {currentMode === 'kampus' ? 'wondr Campus Hub' : 'wondr Education Hub'}
                                </span>
                                <span className="text-[10px] bg-[#D4F933] text-slate-950 font-bold px-1.5 rounded">Baru</span>
                              </div>
                              <p className="text-[11px] text-slate-300 mt-0.5">
                                {currentMode === 'kampus'
                                  ? `UKT Semester 5 Lunas • Rp 6.500.000 [LUNAS via wondr]`
                                  : `SPP Lunas • Sisa Pagu Jajan ${student.name.split(' ')[0]}: Rp${(student.dailyLimit - student.spentToday).toLocaleString('id-ID')} / Rp${student.dailyLimit.toLocaleString('id-ID')} (Hari Ini)`}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>

                        {/* Transaksi Terakhir List */}
                        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-sm">Transaksi Terakhir</h3>
                            <button className="text-xs text-[#00A396] font-semibold hover:underline">Lihat Semua</button>
                          </div>

                          <div className="space-y-2">
                            {student.canteenHistory.slice(0, 3).map((item) => (
                              <div key={item.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-teal-100 text-[#00A396]">
                                    <Utensils className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">{item.title}</p>
                                    <p className="text-[10px] text-slate-500">
                                      {item.time} • {currentMode === 'kampus' ? 'KTM BNI Co-Brand' : 'QRIS BNI Junior'}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-bold text-slate-900">-Rp {item.price.toLocaleString('id-ID')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SCREEN 2: PARENT CONTROL HUB vs STUDENT HUB */}
                    {currentScreen === 'education' && (
                      <div className="p-3.5 space-y-3.5 pb-24 animate-in fade-in duration-300">
                        
                        {/* Screen Top Navigation Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setCurrentScreen('home')}
                              className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-800 shadow-xs border border-slate-100"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h2 className="text-slate-900 font-extrabold text-sm">
                                  {currentMode === 'kampus' ? 'Dashboard Keuangan Mahasiswa' : 'wondr for Education'}
                                </h2>
                                <img src="/assets/wondr-logo.png" alt="wondr logo" className="h-3 object-contain" />
                              </div>
                              <p className="text-[10px] text-slate-500 font-semibold">
                                {currentMode === 'kampus' ? 'Akbar Putra (Unair) • Student Hub' : 'Hub Kontrol Orang Tua & Keuangan Sekolah'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Student Profile Selector Card */}
                        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-[#72DFD0] shadow-xs"
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h3 className="font-extrabold text-slate-900 text-xs">{student.name}</h3>
                                  <span className="bg-slate-100 text-slate-700 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-slate-200">
                                    {currentMode === 'kampus' ? 'Mahasiswa S1' : student.grade}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium">
                                  {currentMode === 'kampus' ? 'Sistem Informasi • Unair (NIM 18239012)' : `${student.school} • NIS ${student.nis}`}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => setShowStudentSelectorSheet(true)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-1.5 rounded-xl flex items-center gap-1 text-xs font-bold"
                            >
                              <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                            </button>
                          </div>

                          {currentMode === 'kampus' && (
                            <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white px-2.5 py-1 rounded-xl border border-emerald-500/40 shadow-xs flex items-center justify-between text-xs">
                              <span className="font-extrabold text-[#72DFD0] text-[11px] flex items-center gap-1">
                                ⭐ Mahasiswa Utama <span className="text-slate-300 font-normal">• Free Transfer 20x/Bln</span>
                              </span>
                              <span className="bg-[#D4F933] text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">Active</span>
                            </div>
                          )}
                        </div>

                        {/* TAB 1: HOME (Student Hub Main Clean Dashboard) */}
                        {activeTab === 'home' && (
                          <div className="space-y-3.5 animate-in fade-in duration-300">
                            
                            {/* Saldo Card BNI Taplus Muda */}
                            <div className="bg-gradient-to-br from-[#FF7A00] via-[#F37021] to-[#D85A10] p-4 rounded-2xl text-white shadow-lg shadow-[#F37021]/20 relative overflow-hidden border border-orange-400/30">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-[9px] tracking-wider uppercase bg-black/20 text-orange-100 font-bold px-2 py-0.5 rounded-full border border-white/10">
                                    {currentMode === 'kampus' ? 'KTM Co-Brand BNI Unair' : 'Utama'}
                                  </span>
                                  <h3 className="font-extrabold text-sm tracking-wide mt-1">
                                    {currentMode === 'kampus' ? 'BNI Taplus Muda' : 'BNI Taplus'}
                                  </h3>
                                </div>
                                <img src="/assets/bni-logo.png" alt="BNI Logo" className="h-5 object-contain bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-xs" />
                              </div>

                              <div className="mt-3">
                                <div className="flex items-center gap-2 text-orange-100 text-xs font-medium">
                                  <span>{currentMode === 'kampus' ? 'Saldo Tabungan Mahasiswa' : 'Saldo Rekening Utama'}</span>
                                  <button onClick={() => setShowBalance(!showBalance)} className="hover:text-white">
                                    {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                                <p className="text-2xl font-black tracking-tight mt-0.5">
                                  {showBalance ? (currentMode === 'kampus' ? 'Rp4.850.000' : 'Rp28.000.000') : '••••••••••••'}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/20 text-xs">
                                <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-xl">
                                  <span className="font-mono text-slate-100 font-semibold">0223383830</span>
                                  <button onClick={handleCopyAccount} className="hover:text-amber-200">
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <button onClick={() => triggerToast('Fitur Top Up Saldo Siap')} className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-xl font-bold text-[11px]">
                                  + Top Up
                                </button>
                              </div>
                            </div>

                            {/* SECTION 1: LAYANAN KAMPUS & KEUANGAN (Ringkas Grid 6 Icons) */}
                            {currentMode === 'kampus' ? (
                              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                    <GraduationCap className="w-4 h-4 text-[#00A396]" />
                                    Layanan Kampus & Keuangan
                                  </h3>
                                  <span className="text-[10px] text-slate-400 font-semibold">Ketuk rincian</span>
                                </div>

                                <div className="grid grid-cols-3 gap-2.5">
                                  {/* Icon 1: UKT+ Portal */}
                                  <button
                                    onClick={() => setActiveCampusSheet('ukt')}
                                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#E6FBF8] border border-slate-200/80 hover:border-[#72DFD0] flex flex-col items-center gap-1.5 relative transition-all group"
                                  >
                                    <div className="w-10 h-10 rounded-xl bg-[#E6FBF8] text-[#00A396] flex items-center justify-center shadow-xs">
                                      <Receipt className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">UKT+ Portal</span>
                                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-white font-black text-[8px] px-1.5 py-0.5 rounded-full uppercase shadow-xs">
                                      Lunas
                                    </span>
                                  </button>

                                  {/* Icon 2: Kas Ormawa */}
                                  <button
                                    onClick={() => setActiveCampusSheet('ormawa')}
                                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#E6FBF8] border border-slate-200/80 hover:border-[#72DFD0] flex flex-col items-center gap-1.5 relative transition-all group"
                                  >
                                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shadow-xs">
                                      <Building2 className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">Kas Ormawa</span>
                                    <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[8px] px-1.5 py-0.5 rounded-full uppercase shadow-xs">
                                      1 Pending
                                    </span>
                                  </button>

                                  {/* Icon 3: Top Up KTM (TapCash) */}
                                  <button
                                    onClick={() => setActiveCampusSheet('tapcash')}
                                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#E6FBF8] border border-slate-200/80 hover:border-[#72DFD0] flex flex-col items-center gap-1.5 relative transition-all group"
                                  >
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shadow-xs">
                                      <CreditCard className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">Top Up KTM</span>
                                    <span className="text-[8px] bg-orange-50 text-orange-700 font-extrabold px-1 rounded">TapCash</span>
                                  </button>

                                  {/* Icon 4: Split Bill */}
                                  <button
                                    onClick={() => setActiveCampusSheet('splitbill')}
                                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#E6FBF8] border border-slate-200/80 hover:border-[#72DFD0] flex flex-col items-center gap-1.5 relative transition-all group"
                                  >
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                                      <Users className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">Split Bill</span>
                                  </button>

                                  {/* Icon 5: Connected E-Wallet */}
                                  <button
                                    onClick={() => setActiveCampusSheet('ewallet')}
                                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#E6FBF8] border border-slate-200/80 hover:border-[#72DFD0] flex flex-col items-center gap-1.5 relative transition-all group"
                                  >
                                    <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center shadow-xs">
                                      <Link2 className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">E-Wallet & Debit</span>
                                  </button>

                                  {/* Icon 6: Budgeting / Pagu */}
                                  <button
                                    onClick={() => setActiveCampusSheet('budgeting')}
                                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#E6FBF8] border border-slate-200/80 hover:border-[#72DFD0] flex flex-col items-center gap-1.5 relative transition-all group"
                                  >
                                    <div className="w-10 h-10 rounded-xl bg-[#D4F933] text-slate-950 flex items-center justify-center shadow-xs">
                                      <Sliders className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">Budgeting</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Sekolah Mode: Parent Control Hub (K-12 Mode) */
                              <div className="space-y-3.5">
                                {/* Card 2: Status Pembayaran SPP */}
                                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-3 text-white flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="bg-[#72DFD0] text-slate-950 p-1 rounded-lg">
                                        <Receipt className="w-3.5 h-3.5" />
                                      </div>
                                      <h3 className="font-bold text-xs tracking-wide">Status Pembayaran SPP</h3>
                                    </div>
                                    <span className="text-[10px] text-[#72DFD0] font-bold">{student.sppPeriod}</span>
                                  </div>

                                  <div className="p-3 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="text-[10px] text-slate-500 font-medium">Tagihan SPP Bulanan</p>
                                        <p className="text-lg font-extrabold text-slate-900">{student.sppAmount}</p>
                                      </div>

                                      <div className="flex flex-col items-end gap-0.5">
                                        <span className="bg-emerald-500 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                          <CheckCircle2 className="w-3 h-3" />
                                          {student.sppStatus}
                                        </span>
                                        <span className="bg-[#E6FBF8] text-[#00A396] font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#72DFD0]/40">
                                          <RefreshCw className="w-2.5 h-2.5" />
                                          Autodebit Aktif
                                        </span>
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => setShowReceiptModal(true)}
                                      className="w-full bg-[#E6FBF8] hover:bg-[#72DFD0]/30 text-[#00897B] font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 border border-[#72DFD0]/40 transition-colors"
                                    >
                                      <Receipt className="w-3.5 h-3.5" /> Lihat Bukti Bayar & Detail SPP
                                    </button>
                                  </div>
                                </div>

                                {/* Card 3: Pagu Harian & Kontrol Jajan Anak (Daily Pagu Slider & Budget Control) */}
                                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="bg-[#D4F933] text-slate-950 p-1.5 rounded-xl">
                                        <Sliders className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <h3 className="font-bold text-slate-900 text-xs">Pagu Harian & Kontrol Jajan Anak</h3>
                                        <p className="text-[10px] text-slate-500 font-medium">Batas transaksi harian kartu jajan {student.name.split(' ')[0]}</p>
                                      </div>
                                    </div>
                                    <span className="text-[9px] font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                                      NFC TapCash Active
                                    </span>
                                  </div>

                                  {/* Dynamic Pagu Banner */}
                                  <div className="bg-[#E6FBF8]/60 p-2.5 rounded-xl border border-[#72DFD0]/40 space-y-1.5">
                                    <div className="flex items-center justify-between text-xs font-bold">
                                      <span className="text-slate-700">Terpakai Hari Ini</span>
                                      <span className="text-slate-900 font-extrabold text-xs">
                                        Rp {student.spentToday.toLocaleString('id-ID')} / <span className="text-[#00A396]">Rp {student.dailyLimit.toLocaleString('id-ID')}</span>
                                      </span>
                                    </div>

                                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden p-0.5">
                                      <div
                                        className="h-full bg-gradient-to-r from-[#72DFD0] via-[#00B4A2] to-[#00A396] rounded-full transition-all duration-500"
                                        style={{
                                          width: `${Math.min(100, Math.round((student.spentToday / student.dailyLimit) * 100))}%`
                                        }}
                                      ></div>
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] text-slate-700 font-semibold pt-0.5">
                                      <span>SPP Lunas • Sisa Pagu Jajan {student.name.split(' ')[0]}: <b className="text-emerald-700">Rp {Math.max(0, student.dailyLimit - student.spentToday).toLocaleString('id-ID')} / Rp {student.dailyLimit.toLocaleString('id-ID')} (Hari Ini)</b></span>
                                    </div>
                                  </div>

                                  {/* Interactive Range Slider */}
                                  <div className="space-y-2 pt-1 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                      <label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                        <Sliders className="w-3.5 h-3.5 text-[#00A396]" /> Atur Batas Pagu Harian
                                      </label>
                                      <span className="text-xs font-extrabold text-[#00A396] bg-[#E6FBF8] px-2 py-0.5 rounded-md border border-[#72DFD0]/40">
                                        Rp {student.dailyLimit.toLocaleString('id-ID')}
                                      </span>
                                    </div>

                                    <input
                                      type="range"
                                      min="10000"
                                      max="50000"
                                      step="5000"
                                      value={student.dailyLimit}
                                      onChange={handleLimitChange}
                                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00A396]"
                                    />

                                    <div className="grid grid-cols-4 gap-1 pt-0.5">
                                      {[10000, 20000, 30000, 50000].map((preset) => (
                                        <button
                                          key={preset}
                                          onClick={() => {
                                            setStudentsData(prev => ({
                                              ...prev,
                                              [selectedStudentId]: { ...prev[selectedStudentId], dailyLimit: preset }
                                            }));
                                            triggerToast(`Pagu Jajan ${student.name.split(' ')[0]} diubah ke Rp ${preset.toLocaleString('id-ID')}`);
                                          }}
                                          className={`py-1 rounded-lg text-[10px] font-bold border transition-all ${
                                            student.dailyLimit === preset ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                                          }`}
                                        >
                                          {preset / 1000}rb
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Emergency Auto-Approval Toggle Switch */}
                                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between mt-2">
                                    <div className="space-y-0.5 pr-2">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-extrabold text-slate-900 text-xs">Emergency Auto-Approve Canteen</span>
                                        <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-md uppercase ${
                                          student.emergencyAutoApprove !== false
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-slate-300 text-slate-700'
                                        }`}>
                                          {student.emergencyAutoApprove !== false ? 'ON' : 'OFF'}
                                        </span>
                                      </div>
                                      <p className="text-[9.5px] text-slate-500 font-medium leading-tight">
                                        Auto-approve max Rp15.000/day if parent is unresponsive for 30s
                                      </p>
                                    </div>

                                    <button
                                      onClick={() => {
                                        const newState = student.emergencyAutoApprove === false;
                                        setStudentsData(prev => ({
                                          ...prev,
                                          [selectedStudentId]: { ...prev[selectedStudentId], emergencyAutoApprove: newState }
                                        }));
                                        triggerToast(newState ? '⚡ Emergency Auto-Approve Diaktifkan (Max Rp 15.000 Overdraft)' : '🔒 Emergency Auto-Approve Dimatikan');
                                      }}
                                      className={`w-10 h-5.5 rounded-full p-0.5 transition-colors relative flex items-center shrink-0 ${
                                        student.emergencyAutoApprove !== false ? 'bg-[#00A396]' : 'bg-slate-300'
                                      }`}
                                    >
                                      <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform ${
                                        student.emergencyAutoApprove !== false ? 'translate-x-4.5' : 'translate-x-0'
                                      }`} />
                                    </button>
                                  </div>
                                </div>

                                {/* Card 4: Request Uang Saku & Transaksi Kantin Terakhir */}
                                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                                  {/* Request Top-Up Widget */}
                                  <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200/80 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="font-extrabold text-amber-900 text-xs flex items-center gap-1.5">
                                        <Bell className="w-3.5 h-3.5 text-amber-600" /> 📩 Request Uang Saku / Top-Up (1 Pending)
                                      </span>
                                      <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">NEW</span>
                                    </div>
                                    <p className="text-[11px] text-slate-700 leading-snug">
                                      <b>{student.name.split(' ')[0]}</b> meminta tambahan pagu <b>Rp 10.000</b> untuk jajan ekstrakurikuler sore ini.
                                    </p>
                                    <button
                                      onClick={() => {
                                        setStudentsData(prev => ({
                                          ...prev,
                                          [selectedStudentId]: { ...prev[selectedStudentId], dailyLimit: prev[selectedStudentId].dailyLimit + 10000 }
                                        }));
                                        triggerToast(`✅ Permintaan Top-Up Rp 10.000 disetujui! Pagu ${student.name.split(' ')[0]} bertambah!`);
                                      }}
                                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-1.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve Top-Up Instant (Rp 10.000)
                                    </button>
                                  </div>

                                  {/* Transaksi Kantin Terakhir */}
                                  <div className="space-y-2 pt-1 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                        <Utensils className="w-3.5 h-3.5 text-[#00A396]" /> Transaksi Kantin Terakhir {student.name.split(' ')[0]}
                                      </h4>
                                      <span className="text-[10px] text-slate-400 font-semibold">TapCash NFC</span>
                                    </div>

                                    <div className="space-y-1.5">
                                      {student.canteenHistory.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                                          <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-teal-100 text-[#00A396] shrink-0">
                                              <Utensils className="w-3.5 h-3.5" />
                                            </div>
                                            <div>
                                              <p className="font-bold text-slate-900 text-xs">{item.title}</p>
                                              <p className="text-[10px] text-slate-500">{item.time} • TapCash Kartu Jajan</p>
                                            </div>
                                          </div>
                                          <span className="font-extrabold text-slate-900 text-xs">-Rp {item.price.toLocaleString('id-ID')}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Card 5: Quick Action Grid / Buttons */}
                                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                                  <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-[#00A396]" /> Aksi Cepat Kontrol Orang Tua
                                  </h3>

                                  <div className="grid grid-cols-3 gap-2">
                                    <button
                                      onClick={() => triggerToast(`⚙️ Gunakan slider di atas untuk mengatur limit pagu ${student.name.split(' ')[0]}`)}
                                      className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-center transition-colors"
                                    >
                                      <Sliders className="w-4 h-4 text-[#00A396] mx-auto mb-1" />
                                      <span className="font-extrabold text-[10px] text-teal-900 block leading-tight">Atur Limit Jajan</span>
                                    </button>

                                    <button
                                      onClick={() => triggerToast(`💳 Top-Up Pagu Instant Rp 20.000 ke Kartu Jajan ${student.name.split(' ')[0]} Berhasil!`)}
                                      className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-center transition-colors"
                                    >
                                      <CreditCard className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                                      <span className="font-extrabold text-[10px] text-orange-900 block leading-tight">Top-Up Pagu Instant</span>
                                    </button>

                                    <button
                                      onClick={() => triggerToast(`📜 Menampilkan Log Transaksi Kantin Lengkap ${student.name.split(' ')[0]}`)}
                                      className="p-2 rounded-xl bg-cyan-50 hover:bg-cyan-100/80 border border-cyan-200 text-center transition-colors"
                                    >
                                      <Utensils className="w-4 h-4 text-cyan-700 mx-auto mb-1" />
                                      <span className="font-extrabold text-[10px] text-cyan-900 block leading-tight">Lihat Transaksi Kantin</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Card 6: Reward Banner */}
                                <div
                                  onClick={() => setShowKprModal(true)}
                                  className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-emerald-500/10 p-3 rounded-2xl border border-amber-300/60 shadow-xs cursor-pointer hover:border-amber-400"
                                >
                                  <div className="flex items-start gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                                      <Sparkles className="w-4 h-4 text-slate-950" />
                                    </div>
                                    <div className="space-y-0.5">
                                      <span className="text-amber-800 font-extrabold text-xs block">
                                        🌟 Reward Kedisiplinan SPP BNI
                                      </span>
                                      <p className="text-[11px] text-slate-800 font-semibold leading-snug">
                                        Anda berhak mendapatkan <span className="text-[#00897B] font-bold underline">KPR Flexi BNI Bunga 2.75%</span> Pre-Approved!
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* SECTION 2: CAROUSEL BANNER HORIZONTAL (Fitur Pilihan & Promo) */}
                            {currentMode === 'kampus' && (
                              <div className="space-y-2 pt-1">
                                <div className="flex items-center justify-between px-1">
                                  <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    Fitur Pilihan & Promo
                                  </h3>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => promoCarouselRef.current?.scrollBy({ left: -240, behavior: 'smooth' })}
                                      className="p-1 text-slate-400 hover:text-slate-700 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors"
                                      title="Geser Kiri"
                                    >
                                      <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => promoCarouselRef.current?.scrollBy({ left: 240, behavior: 'smooth' })}
                                      className="px-2 py-0.5 text-[10px] text-[#00A396] hover:text-teal-700 font-bold rounded-md bg-teal-50 hover:bg-teal-100 transition-colors flex items-center gap-0.5"
                                    >
                                      Geser ke kanan →
                                    </button>
                                  </div>
                                </div>

                                <div
                                  ref={promoCarouselRef}
                                  onMouseDown={handleCarouselMouseDown}
                                  onMouseLeave={handleCarouselMouseUp}
                                  onMouseUp={handleCarouselMouseUp}
                                  onMouseMove={handleCarouselMouseMove}
                                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                  className="flex items-stretch gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 pt-1 px-0.5 cursor-grab active:cursor-grabbing select-none"
                                >
                                  
                                  {/* Card 1 Carousel: Nabung 26-Minggu */}
                                  <div className="w-[85%] min-w-[275px] max-w-[285px] snap-center bg-gradient-to-br from-amber-500/10 via-amber-50 to-emerald-500/10 p-3.5 rounded-2xl border border-amber-300/80 shadow-xs space-y-2 shrink-0 flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <Trophy className="w-4 h-4 text-amber-600" />
                                        <h4 className="font-extrabold text-slate-900 text-xs">Nabung 26-Minggu</h4>
                                      </div>
                                      <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                                        Streak 🔥 Wk 4
                                      </span>
                                    </div>

                                    <div className="space-y-1 bg-white/90 p-2.5 rounded-xl border border-amber-200 text-xs">
                                      <div className="flex items-center justify-between font-extrabold text-[11px]">
                                        <span className="text-slate-700">Minggu 4 / 26</span>
                                        <span className="text-emerald-700">Rp 400.000 / Rp 2.600.000</span>
                                      </div>
                                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-amber-400 to-[#00A396] rounded-full" style={{ width: '15.3%' }}></div>
                                      </div>
                                      <p className="text-[9px] text-slate-500 pt-0.5">Bunga 5.25% p.a. • Target: Wisuda & Liburan</p>
                                    </div>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        triggerToast('🔥 Deposit Minggu ke-5 (Rp 100.000) Berhasil! Streak Nabung Bertambah!');
                                      }}
                                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-1.5 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                                    >
                                      <Trophy className="w-3.5 h-3.5" /> Setor Wk 5 (Rp 100.000)
                                    </button>
                                  </div>

                                  {/* Card 2 Carousel: Benefit Student BNI Co-Brand */}
                                  <div className="w-[85%] min-w-[275px] max-w-[285px] snap-center bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-3.5 rounded-2xl border border-emerald-500/40 shadow-xs space-y-2 shrink-0 flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <Sparkles className="w-4 h-4 text-[#D4F933]" />
                                        <h4 className="font-extrabold text-white text-xs">Benefit Student Co-Brand</h4>
                                      </div>
                                      <span className="bg-[#D4F933] text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">PROMO</span>
                                    </div>

                                    <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                                      Dapatkan <span className="text-[#72DFD0] font-bold underline">Cashback 15%</span> Merchant Kampus & Beasiswa Talent BNI Pre-Approved!
                                    </p>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        triggerToast('🌟 Promo Cashback 15% Merchant Kampus Diaktifkan!');
                                      }}
                                      className="w-full bg-[#72DFD0] hover:bg-[#00B4A2] text-slate-950 font-extrabold text-xs py-1.5 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                                    >
                                      Klaim Promo Cashback
                                    </button>
                                  </div>

                                </div>
                              </div>
                            )}

                          </div>
                        )}

                        {/* TAB 2: TRANSAKSI (Detail Histori UKT, Transfer & Direct Pay E-Commerce) */}
                        {activeTab === 'transaksi' && (
                          <div className="space-y-3.5 animate-in fade-in duration-300">
                            {/* UKT+ Card */}
                            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-3 text-white flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="bg-[#72DFD0] text-slate-950 p-1 rounded-lg">
                                    <Receipt className="w-3.5 h-3.5" />
                                  </div>
                                  <h3 className="font-bold text-xs tracking-wide">
                                    {currentMode === 'kampus' ? 'UKT+ Portal (Host-to-Host BNI)' : 'Status Pembayaran SPP'}
                                  </h3>
                                </div>
                                <span className="text-[10px] text-[#72DFD0] font-bold">
                                  {currentMode === 'kampus' ? 'Semester 5 (2026/2027)' : student.sppPeriod}
                                </span>
                              </div>

                              <div className="p-3 space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-[10px] text-slate-500 font-medium">
                                      {currentMode === 'kampus' ? 'Status UKT Semester 5' : 'Tagihan SPP Bulanan'}
                                    </p>
                                    <p className="text-lg font-extrabold text-slate-900">
                                      {currentMode === 'kampus' ? 'Rp 6.500.000' : student.sppAmount}
                                    </p>
                                  </div>

                                  <div className="flex flex-col items-end gap-0.5">
                                    <span className="bg-emerald-500 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                      <CheckCircle2 className="w-3 h-3" />
                                      {currentMode === 'kampus' ? 'LUNAS via wondr' : student.sppStatus}
                                    </span>
                                    <span className="bg-[#E6FBF8] text-[#00A396] font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#72DFD0]/40">
                                      <RefreshCw className="w-2.5 h-2.5" />
                                      {currentMode === 'kampus' ? 'Auto-Sync SPC H2H' : 'Autodebit Aktif'}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => setShowReceiptModal(true)}
                                  className="w-full bg-[#E6FBF8] hover:bg-[#72DFD0]/30 text-[#00897B] font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 border border-[#72DFD0]/40 transition-colors"
                                >
                                  <Receipt className="w-3.5 h-3.5" />
                                  {currentMode === 'kampus' ? 'Lihat Bukti Bayar UKT & Rincian SKS' : 'Lihat Bukti Bayar & Detail SPP'}
                                </button>
                              </div>
                            </div>

                            {/* Connected E-Wallet & Direct Debit */}
                            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                                  <Link2 className="w-3.5 h-3.5 text-[#00A396]" /> Connected E-Wallet & Direct Debit
                                </h3>
                                <span className="text-[9px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">Pilar 2 Direct Link</span>
                              </div>

                              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                                <div className="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-xl text-[10px] font-bold text-slate-800 flex items-center gap-1.5 shrink-0">
                                  <img src="/assets/gopay-logo.png" alt="GoPay" className="w-3.5 h-3.5 object-contain" /> GoPay ⚡
                                </div>
                                <div className="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-xl text-[10px] font-bold text-slate-800 flex items-center gap-1.5 shrink-0">
                                  <img src="/assets/shopeepay-logo.png" alt="ShopeePay" className="w-3.5 h-3.5 object-contain" /> ShopeePay ⚡
                                </div>
                                <div className="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-xl text-[10px] font-bold text-slate-800 flex items-center gap-1.5 shrink-0">
                                  <img src="/assets/bni-logo.png" alt="KTM TapCash" className="w-3.5 h-3.5 object-contain" /> KTM TapCash BNI
                                </div>
                                <div className="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-xl text-[10px] font-bold text-slate-800 flex items-center gap-1.5 shrink-0">
                                  <img src="/assets/pln-logo.png" alt="PLN" className="w-3.5 h-3.5 object-contain" /> PLN Kos Auto-Debit
                                </div>
                              </div>
                            </div>

                            {/* Transaksi Terakhir */}
                            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                              <h3 className="font-bold text-slate-900 text-xs">Transaksi Terakhir</h3>
                              <div className="space-y-2">
                                {student.canteenHistory.slice(0, 3).map((item) => (
                                  <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-teal-100 text-[#00A396]">
                                        <Utensils className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <p className="font-bold text-slate-900">{item.title}</p>
                                        <p className="text-[10px] text-slate-500">{item.time} • KTM BNI Co-Brand</p>
                                      </div>
                                    </div>
                                    <span className="font-bold text-slate-900">-Rp {item.price.toLocaleString('id-ID')}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TAB 3: INSIGHT (Pagu Mandiri / Monthly Budgeting Slider) */}
                        {activeTab === 'insights' && (
                          <div className="space-y-3.5 animate-in fade-in duration-300">
                            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="bg-[#D4F933] text-slate-950 p-1 rounded-lg">
                                    <Sliders className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-slate-900 text-xs">
                                      {currentMode === 'kampus' ? 'Pagu Mandiri Mahasiswa / Monthly Budgeting' : 'Pagu Jajan Kantin'}
                                    </h3>
                                    <p className="text-[9px] text-slate-500 font-medium">
                                      {currentMode === 'kampus' ? 'Alokasi anggaran bulanan mahasiswa mandiri (Akbar - Unair)' : 'Batas transaksi harian kartu jajan siswa'}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                <div className="flex items-center justify-between text-xs font-bold">
                                  <span className="text-slate-600">Alokasi Terpakai Bulan Ini</span>
                                  <span className="text-slate-900 font-extrabold text-xs">
                                    Rp {student.spentToday.toLocaleString('id-ID')} / <span className="text-[#00A396]">Rp {student.dailyLimit.toLocaleString('id-ID')}</span>
                                  </span>
                                </div>

                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden p-0.5">
                                  <div
                                    className="h-full bg-gradient-to-r from-[#72DFD0] via-[#00B4A2] to-[#00A396] rounded-full transition-all duration-500"
                                    style={{
                                      width: `${Math.min(100, Math.round((student.spentToday / student.dailyLimit) * 100))}%`
                                    }}
                                  ></div>
                                </div>

                                <div className="flex items-center justify-between text-[9px] text-slate-500 font-semibold">
                                  <span>Sisa Pagu: Rp {Math.max(0, student.dailyLimit - student.spentToday).toLocaleString('id-ID')}</span>
                                  <span>{Math.round((student.spentToday / student.dailyLimit) * 100)}% Terpakai</span>
                                </div>
                              </div>

                              <div className="space-y-2 pt-1 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                    <Sliders className="w-3.5 h-3.5 text-[#00A396]" /> Atur Batas Pagu Mandiri
                                  </label>
                                  <span className="text-xs font-extrabold text-[#00A396] bg-[#E6FBF8] px-2 py-0.5 rounded-md border border-[#72DFD0]/40">
                                    Rp {student.dailyLimit.toLocaleString('id-ID')}
                                  </span>
                                </div>

                                <input
                                  type="range"
                                  min="10000"
                                  max="50000"
                                  step="5000"
                                  value={student.dailyLimit}
                                  onChange={handleLimitChange}
                                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00A396]"
                                />

                                <div className="grid grid-cols-4 gap-1 pt-0.5">
                                  {[10000, 20000, 30000, 50000].map((preset) => (
                                    <button
                                      key={preset}
                                      onClick={() => {
                                        setStudentsData(prev => ({
                                          ...prev,
                                          [selectedStudentId]: { ...prev[selectedStudentId], dailyLimit: preset }
                                        }));
                                        triggerToast(`Pagu diubah ke Rp ${preset.toLocaleString('id-ID')}`);
                                      }}
                                      className={`py-1 rounded-lg text-[10px] font-bold border transition-all ${
                                        student.dailyLimit === preset ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                                      }`}
                                    >
                                      {preset / 1000}rb
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TAB 4: GROWTH (Modul Nabung 26-Minggu & Investasi Reksa Dana) */}
                        {activeTab === 'growth' && (
                          <div className="space-y-3.5 animate-in fade-in duration-300">
                            {/* Nabung 26-Minggu Modul Lengkap */}
                            <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-emerald-500/10 p-3.5 rounded-2xl border border-amber-300/80 shadow-xs space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <Trophy className="w-4 h-4 text-amber-600" />
                                  <h3 className="font-extrabold text-slate-900 text-xs">🏆 Tantangan Nabung 26-Minggu</h3>
                                </div>
                                <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                                  Streak 🔥 Wk 4
                                </span>
                              </div>

                              <div className="space-y-1.5 bg-white/90 p-3 rounded-xl border border-amber-200 text-xs">
                                <div className="flex items-center justify-between font-extrabold text-[11px]">
                                  <span className="text-slate-700">Minggu 4 / 26</span>
                                  <span className="text-emerald-700">Rp 400.000 / Rp 2.600.000</span>
                                </div>

                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-amber-400 to-[#00A396] rounded-full" style={{ width: '15.3%' }}></div>
                                </div>

                                <p className="text-[10px] text-slate-600 pt-1 font-semibold">
                                  💡 Target: Dana Wisuda & Liburan Semester (Bunga Spesial 5.25% p.a.)
                                </p>
                              </div>

                              <button
                                onClick={() => triggerToast('🔥 Deposit Minggu ke-5 (Rp 100.000) Berhasil! Streak Nabung Bertambah!')}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                              >
                                <Trophy className="w-4 h-4" /> Setor Wk 5 (Rp 100.000) & Keep Streak!
                              </button>
                            </div>

                            {/* Reksa Dana & Tabungan Masa Depan Mahasiswa BNI */}
                            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                                  <TrendingUp className="w-4 h-4 text-[#00A396]" /> Reksa Dana Mahasiswa BNI
                                </h3>
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">Low Risk</span>
                              </div>
                              <p className="text-[11px] text-slate-600">
                                Mulai investasi dari <b>Rp 10.000</b> via BNI Asset Management. Return historis 6.2% p.a.
                              </p>
                              <button
                                onClick={() => triggerToast('📈 Modul Investasi Reksa Dana BNI Siap!')}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl"
                              >
                                Jelajahi Reksa Dana BNI
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </>
                )}

              </div>

              {/* Bottom Nav Bar - Genuine wondr retail style */}
              <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 flex items-center justify-around z-30 relative shrink-0">
                <button
                  onClick={() => { setAppMode('parent'); setCurrentScreen('home'); }}
                  className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                    appMode === 'parent' && currentScreen === 'home' ? 'text-[#00A396] font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="text-[10px]">Home</span>
                </button>

                <button
                  onClick={() => { setAppMode('parent'); setCurrentScreen('home'); setActiveTab('transaksi'); triggerToast('Menu Transaksi Active'); }}
                  className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                    appMode === 'parent' && activeTab === 'transaksi' && currentScreen === 'home' ? 'text-[#00A396] font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <ArrowLeftRight className="w-5 h-5" />
                  <span className="text-[10px]">Transaksi</span>
                </button>

                <button
                  onClick={() => { setAppMode('parent'); setCurrentScreen('home'); setActiveTab('insights'); triggerToast('Menu Insight Active'); }}
                  className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                    appMode === 'parent' && activeTab === 'insights' && currentScreen === 'home' ? 'text-[#00A396] font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <PieChart className="w-5 h-5" />
                  <span className="text-[10px]">Insight</span>
                </button>

                <button
                  onClick={() => { setAppMode('parent'); setCurrentScreen('home'); setActiveTab('growth'); triggerToast('Menu Growth Active'); }}
                  className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                    appMode === 'parent' && activeTab === 'growth' && currentScreen === 'home' ? 'text-[#00A396] font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-[10px]">Growth</span>
                </button>

                <button
                  onClick={() => triggerToast(currentMode === 'kampus' ? 'Profil Mahasiswa: Akbar Putra' : 'Profil Utama: Ibu Karnisa')}
                  className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all text-slate-400 hover:text-slate-600"
                >
                  <User className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Profile</span>
                </button>
              </div>

              {/* Home Bar Indicator */}
              <div className="bg-white py-1 flex justify-center shrink-0">
                <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
              </div>

              {/* MODALS */}
              {showReceiptModal && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-end justify-center p-0">
                  <div className="bg-white w-full rounded-t-3xl p-5 space-y-4 border-t border-slate-200 animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <img src="/assets/bni-logo.png" alt="BNI" className="h-4 object-contain" />
                        <h3 className="font-extrabold text-slate-900 text-sm">Bukti Pembayaran SPP</h3>
                      </div>
                      <button onClick={() => setShowReceiptModal(false)} className="p-1 text-slate-400">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                      <div className="text-center pb-2 border-b border-dashed border-slate-300">
                        <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase inline-block">
                          LUNAS (Autodebit)
                        </span>
                        <p className="font-extrabold text-slate-900 text-base mt-1">{student.sppAmount}</p>
                      </div>
                      <div className="space-y-1 pt-1 text-slate-600">
                        <div className="flex justify-between"><span>Nama Siswa</span><span className="font-bold text-slate-900">{student.name}</span></div>
                        <div className="flex justify-between"><span>Sekolah</span><span className="font-bold text-slate-900">{student.school}</span></div>
                        <div className="flex justify-between"><span>Periode</span><span className="font-bold text-slate-900">{student.sppPeriod}</span></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button onClick={() => { triggerToast('Bukti diunduh'); setShowReceiptModal(false); }} className="py-2.5 rounded-2xl bg-slate-100 font-bold text-xs">
                        <Download className="w-4 h-4 inline mr-1" /> Unduh
                      </button>
                      <button onClick={() => { triggerToast('Bukti disalin'); setShowReceiptModal(false); }} className="py-2.5 rounded-2xl bg-[#72DFD0] text-slate-950 font-bold text-xs">
                        <Share2 className="w-4 h-4 inline mr-1" /> Bagikan
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showKprModal && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-end justify-center p-0">
                  <div className="bg-white w-full rounded-t-3xl p-5 space-y-4 border-t border-slate-200 animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-slate-900 text-sm">Reward Special BNI</h3>
                      <button onClick={() => setShowKprModal(false)} className="p-1 text-slate-400">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-2xl space-y-1">
                      <h4 className="font-extrabold text-base">BNI KPR Flexi Bunga 2.75% p.a.</h4>
                      <p className="text-xs text-orange-100">Reward atas disiplin SPP 12 bulan berturut-turut.</p>
                    </div>
                    <button onClick={() => { triggerToast('Pengajuan KPR diproses!'); setShowKprModal(false); }} className="w-full py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs">
                      Ajukan Sekarang
                    </button>
                  </div>
                </div>
              )}

              {showStudentSelectorSheet && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-end justify-center p-0">
                  <div className="bg-white w-full rounded-t-3xl p-5 space-y-4 border-t border-slate-200 animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-slate-900 text-sm">Pilih Siswa (Kartu Anak)</h3>
                      <button onClick={() => setShowStudentSelectorSheet(false)} className="p-1 text-slate-400">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => { setSelectedStudentId('akbar'); setShowStudentSelectorSheet(false); triggerToast('Profil berpindah ke Akbar'); }}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between ${
                          selectedStudentId === 'akbar' ? 'border-[#72DFD0] bg-[#E6FBF8]/50' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={studentsData.akbar.avatar} alt="Akbar" className="w-9 h-9 rounded-full object-cover" />
                          <div><h4 className="font-bold text-xs text-slate-900">Akbar Putra</h4><p className="text-[10px] text-slate-500">SMA 1 Surabaya</p></div>
                        </div>
                        {selectedStudentId === 'akbar' && <Check className="w-4 h-4 text-[#00A396]" />}
                      </button>

                      <button
                        onClick={() => { setSelectedStudentId('aisha'); setShowStudentSelectorSheet(false); triggerToast('Profil berpindah ke Aisha'); }}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between ${
                          selectedStudentId === 'aisha' ? 'border-[#72DFD0] bg-[#E6FBF8]/50' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={studentsData.aisha.avatar} alt="Aisha" className="w-9 h-9 rounded-full object-cover" />
                          <div><h4 className="font-bold text-xs text-slate-900">Aisha Putri</h4><p className="text-[10px] text-slate-500">SMP 2 Surabaya</p></div>
                        </div>
                        {selectedStudentId === 'aisha' && <Check className="w-4 h-4 text-[#00A396]" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showNotificationDrawer && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-end justify-center p-0">
                  <div className="bg-white w-full rounded-t-3xl p-5 space-y-3 border-t border-slate-200 animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="font-bold text-xs text-slate-900">Notifikasi Real-Time</h3>
                      <button onClick={() => setShowNotificationDrawer(false)} className="p-1 text-slate-400"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-2xl bg-[#E6FBF8] border border-[#72DFD0]/40">
                        <span className="text-[10px] font-bold text-[#00A396]">SPP Autodebit Lunas</span>
                        <p className="font-bold text-slate-900">SPP Bulan Juli Akbar Rp 1.500.000 terdebit</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BOTTOM SHEET MODAL SYSTEM FOR KAMPUS SERVICES */}
              {activeCampusSheet && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-end justify-center p-0 animate-in fade-in duration-200">
                  <div className="bg-white w-full rounded-t-3xl p-5 space-y-4 border-t border-slate-200 animate-in slide-in-from-bottom duration-300 max-h-[85%] overflow-y-auto">
                    
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-[#E6FBF8] text-[#00A396]">
                          {activeCampusSheet === 'ukt' && <Receipt className="w-5 h-5" />}
                          {activeCampusSheet === 'ormawa' && <Building2 className="w-5 h-5" />}
                          {activeCampusSheet === 'tapcash' && <CreditCard className="w-5 h-5" />}
                          {activeCampusSheet === 'splitbill' && <Users className="w-5 h-5" />}
                          {activeCampusSheet === 'ewallet' && <Link2 className="w-5 h-5" />}
                          {activeCampusSheet === 'budgeting' && <Sliders className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm">
                            {activeCampusSheet === 'ukt' && 'UKT+ Portal (Host-to-Host BNI)'}
                            {activeCampusSheet === 'ormawa' && 'Kas Komunitas Ormawa'}
                            {activeCampusSheet === 'tapcash' && 'Top Up KTM TapCash BNI'}
                            {activeCampusSheet === 'splitbill' && 'Split Bill Nongkrong'}
                            {activeCampusSheet === 'ewallet' && 'Connected E-Wallet & Direct Debit'}
                            {activeCampusSheet === 'budgeting' && 'Pagu Mandiri & Monthly Budgeting'}
                          </h3>
                          <p className="text-[10px] text-slate-500 font-semibold">
                            {activeCampusSheet === 'ewallet'
                              ? 'Kelola Hubungan BNI Open API & Instant Auto-Debit'
                              : 'Layanan Keuangan Edukasi BNI Open API'}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => setActiveCampusSheet(null)} className="p-1 text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {activeCampusSheet === 'ukt' && (
                      <div className="space-y-3 text-xs">
                        <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-slate-300">Status UKT Semester 5</p>
                            <p className="text-lg font-black text-[#72DFD0]">Rp 6.500.000</p>
                          </div>
                          <span className="bg-emerald-500 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> LUNAS via wondr
                          </span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                          <div className="flex justify-between text-slate-600"><span>NIM Mahasiswa</span><span className="font-bold text-slate-900">18239012</span></div>
                          <div className="flex justify-between text-slate-600"><span>Fakultas / Prodi</span><span className="font-bold text-slate-900">FST / Sistem Informasi</span></div>
                          <div className="flex justify-between text-slate-600"><span>Status Sync Host</span><span className="font-bold text-emerald-600">Auto-Sync SPC H2H BNI</span></div>
                        </div>
                        <button
                          onClick={() => { setActiveCampusSheet(null); setShowReceiptModal(true); }}
                          className="w-full bg-[#E6FBF8] hover:bg-[#72DFD0]/30 text-[#00897B] font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 border border-[#72DFD0]/40"
                        >
                          <Receipt className="w-4 h-4" /> Lihat Bukti Bayar UKT & Rincian SKS
                        </button>
                      </div>
                    )}

                    {activeCampusSheet === 'ormawa' && (
                      <div className="space-y-3 text-xs">
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-slate-500 font-semibold">Kas Himpunan SI</p>
                            <p className="text-base font-black text-slate-900">Saldo: Rp 4.200.000</p>
                          </div>
                          <span className="bg-emerald-100 text-emerald-800 font-bold text-[9px] px-2 py-0.5 rounded-full border border-emerald-300">
                            Dual-Approval Active
                          </span>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1">
                          <p className="font-bold text-amber-900">Pengajuan Dana Belum Disetujui (1 Pending):</p>
                          <p className="text-slate-700">Kegiatan LKMM Himpunan SI — Rp 500.000</p>
                        </div>
                        <button
                          onClick={() => {
                            triggerToast('✅ Dual-Approval OK! Dana Kas Himpunan Rp 500.000 disetujui via BNI Open API');
                            setActiveCampusSheet(null);
                          }}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#72DFD0]" /> Approve Pencairan Dana (Akbar - Bendahara 2)
                        </button>
                      </div>
                    )}

                    {activeCampusSheet === 'tapcash' && (
                      <div className="space-y-3 text-xs">
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3.5 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-orange-100 font-medium">Saldo KTM TapCash BNI</p>
                            <p className="text-xl font-black">Rp 85.000</p>
                          </div>
                          <CreditCard className="w-8 h-8 opacity-80" />
                        </div>
                        <p className="font-bold text-slate-700">Pilih Nominal Top Up Instant:</p>
                        <div className="grid grid-cols-3 gap-2">
                          {[20000, 50000, 100000].map((amt) => (
                            <button
                              key={amt}
                              onClick={() => {
                                triggerToast(`💳 Top Up KTM TapCash Rp ${amt.toLocaleString('id-ID')} Berhasil!`);
                                setActiveCampusSheet(null);
                              }}
                              className="py-2.5 rounded-xl bg-slate-100 hover:bg-orange-100 border border-slate-200 hover:border-orange-300 font-bold text-slate-800 text-xs"
                            >
                              Rp {amt.toLocaleString('id-ID')}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeCampusSheet === 'splitbill' && (
                      <div className="space-y-3 text-xs">
                        <div className="bg-teal-50 p-3 rounded-2xl border border-teal-200 space-y-1">
                          <p className="font-bold text-teal-900">Patungan Warkop & Kafe Kampus</p>
                          <p className="text-slate-600">Total Patungan: <b>Rp 150.000</b> (5 Mahasiswa @ Rp 30.000)</p>
                        </div>
                        <p className="font-bold text-slate-700">Teman Patungan Terpilih:</p>
                        <div className="space-y-1.5 text-slate-600">
                          <div className="flex justify-between bg-slate-50 p-2 rounded-lg"><span>Budi Santoso</span><span className="font-bold">Rp 30.000</span></div>
                          <div className="flex justify-between bg-slate-50 p-2 rounded-lg"><span>Citra Lestari</span><span className="font-bold">Rp 30.000</span></div>
                          <div className="flex justify-between bg-slate-50 p-2 rounded-lg"><span>Deni Pratama</span><span className="font-bold">Rp 30.000</span></div>
                        </div>
                        <button
                          onClick={() => {
                            triggerToast('🤝 Tagihan Split Bill disebar ke 4 Teman!');
                            setActiveCampusSheet(null);
                          }}
                          className="w-full bg-[#00A396] hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs"
                        >
                          Kirim Tagihan Split Bill
                        </button>
                      </div>
                    )}

                    {activeCampusSheet === 'ewallet' && (
                      <div className="space-y-3 text-xs">
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
                          <p className="font-bold text-slate-800">Daftar Mitra Terhubung (BNI Direct Link):</p>
                          <div className="space-y-2">
                            {/* Baris 1: GoPay */}
                            <div className="p-3 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-2xs">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200/60 flex items-center justify-center shrink-0">
                                  <img src="/assets/gopay-logo.png" alt="GoPay" className="w-6 h-6 object-contain" />
                                </div>
                                <div>
                                  <h4 className="font-extrabold text-slate-900 text-xs">GoPay</h4>
                                  <p className="text-[10px] text-slate-500 font-medium">Direct Debit GoFood & Transportasi Kampus</p>
                                </div>
                              </div>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                                Connected
                              </span>
                            </div>

                            {/* Baris 2: ShopeePay */}
                            <div className="p-3 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-2xs">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200/60 flex items-center justify-center shrink-0">
                                  <img src="/assets/shopeepay-logo.png" alt="ShopeePay" className="w-6 h-6 object-contain" />
                                </div>
                                <div>
                                  <h4 className="font-extrabold text-slate-900 text-xs">ShopeePay</h4>
                                  <p className="text-[10px] text-slate-500 font-medium">Instant Top-Up & Checkout Payment</p>
                                </div>
                              </div>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                                Connected
                              </span>
                            </div>

                            {/* Baris 3: KTM TapCash BNI */}
                            <div className="p-3 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-2xs">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200/60 flex items-center justify-center shrink-0">
                                  <img src="/assets/bni-logo.png" alt="KTM TapCash BNI" className="w-6 h-6 object-contain" />
                                </div>
                                <div>
                                  <h4 className="font-extrabold text-slate-900 text-xs">KTM TapCash BNI</h4>
                                  <p className="text-[10px] text-slate-500 font-medium">Presensi, Parkir & QRIS Kantin Kampus</p>
                                </div>
                              </div>
                              <span className="text-[10px] bg-cyan-100 text-cyan-800 font-extrabold px-2.5 py-0.5 rounded-full border border-cyan-200">
                                Terhubung H2H
                              </span>
                            </div>

                            {/* Baris 4: Tagihan Listrik Kos (PLN) */}
                            <div className="p-3 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-2xs">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200/60 flex items-center justify-center shrink-0">
                                  <img src="/assets/pln-logo.png" alt="PLN" className="w-6 h-6 object-contain" />
                                </div>
                                <div>
                                  <h4 className="font-extrabold text-slate-900 text-xs">Tagihan Listrik Kos (PLN)</h4>
                                  <p className="text-[10px] text-slate-500 font-medium">Auto-Debit Rutin Setiap Tanggal 25</p>
                                </div>
                              </div>
                              <span className="text-[10px] bg-teal-100 text-teal-800 font-extrabold px-2.5 py-0.5 rounded-full border border-teal-200">
                                Auto-Debit Aktif
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            triggerToast('🔗 Pengaturan Direct Link E-Wallet & Direct Debit Diperbarui');
                            setActiveCampusSheet(null);
                          }}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl"
                        >
                          Kelola Hubungan Akun
                        </button>
                      </div>
                    )}

                    {activeCampusSheet === 'budgeting' && (
                      <div className="space-y-3 text-xs">
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-900">Atur Batas Pagu Harian/Bulanan</label>
                            <span className="text-xs font-extrabold text-[#00A396] bg-[#E6FBF8] px-2 py-0.5 rounded-md border border-[#72DFD0]/40">
                              Rp {student.dailyLimit.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="10000"
                            max="50000"
                            step="5000"
                            value={student.dailyLimit}
                            onChange={handleLimitChange}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00A396]"
                          />
                          <div className="grid grid-cols-4 gap-1 pt-0.5">
                            {[10000, 20000, 30000, 50000].map((preset) => (
                              <button
                                key={preset}
                                onClick={() => {
                                  setStudentsData(prev => ({
                                    ...prev,
                                    [selectedStudentId]: { ...prev[selectedStudentId], dailyLimit: preset }
                                  }));
                                  triggerToast(`Pagu diubah ke Rp ${preset.toLocaleString('id-ID')}`);
                                }}
                                className={`py-1 rounded-lg text-[10px] font-bold border transition-all ${
                                  student.dailyLimit === preset ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                                }`}
                              >
                                {preset / 1000}rb
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Selection Rule: Strict Mode vs Flexi Canteen Mode */}
                        <div className="space-y-2 pt-1 border-t border-slate-200">
                          <p className="font-extrabold text-slate-900 text-xs">Aturan Persetujuan Transaksi Jajan:</p>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                setStudentsData(prev => ({
                                  ...prev,
                                  [selectedStudentId]: { ...prev[selectedStudentId], parentApprovalMode: 'strict', emergencyAutoApprove: false }
                                }));
                                triggerToast('🔒 Mode Persetujuan Diubah ke Strict Mode');
                              }}
                              className={`p-2.5 rounded-xl border text-left space-y-1 transition-all ${
                                student.parentApprovalMode === 'strict'
                                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                                  : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-xs">Strict Mode</span>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${student.parentApprovalMode === 'strict' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>Manual</span>
                              </div>
                              <p className={`text-[9px] leading-tight ${student.parentApprovalMode === 'strict' ? 'text-slate-300' : 'text-slate-500'}`}>
                                Memerlukan persetujuan manual orang tua untuk semua pengajuan jajan tambahan.
                              </p>
                            </button>

                            <button
                              onClick={() => {
                                setStudentsData(prev => ({
                                  ...prev,
                                  [selectedStudentId]: { ...prev[selectedStudentId], parentApprovalMode: 'flexi', emergencyAutoApprove: true }
                                }));
                                triggerToast('⚡ Mode Persetujuan Diubah ke Flexi Canteen Mode');
                              }}
                              className={`p-2.5 rounded-xl border text-left space-y-1 transition-all ${
                                student.parentApprovalMode !== 'strict'
                                  ? 'border-[#00A396] bg-[#E6FBF8] text-slate-900 shadow-xs'
                                  : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-xs text-[#00897B]">Flexi Canteen Mode</span>
                                <span className="text-[8px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded">Auto-Approve</span>
                              </div>
                              <p className="text-[9px] text-slate-600 leading-tight">
                                Menyetujui otomatis transaksi kantin hingga batas Emergency Overdraft (Max Rp15.000).
                              </p>
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            triggerToast('✅ Batas Pagu & Mode Persetujuan Disimpan!');
                            setActiveCampusSheet(null);
                          }}
                          className="w-full bg-[#00A396] hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl"
                        >
                          Simpan Batas Pagu & Mode
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
