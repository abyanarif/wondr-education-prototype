import React, { useState } from 'react';
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
  Trophy
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
  const [activeTab, setActiveTab] = useState('transaksi');
  const [showBalance, setShowBalance] = useState(true);

  // Live Toast & Push Notification System
  const [toastMessage, setToastMessage] = useState(null);
  const [pushNotification, setPushNotification] = useState(null);

  // Modals state
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showKprModal, setShowKprModal] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [showStudentSelectorSheet, setShowStudentSelectorSheet] = useState(false);

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

              {/* Header Mode Switcher Pill */}
              <div className="bg-slate-900 px-3.5 py-2 flex items-center justify-between text-xs border-b border-slate-800 shrink-0 z-30">
                <div className="flex items-center gap-1 bg-slate-800/90 p-0.5 rounded-xl border border-slate-700">
                  <button
                    onClick={() => {
                      setCurrentMode('sekolah');
                      triggerToast('Mode Aktif: Mode Sekolah (K-12)');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                      currentMode === 'sekolah'
                        ? 'bg-[#72DFD0] text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🎒 Sekolah (K-12)
                  </button>
                  <button
                    onClick={() => {
                      setCurrentMode('kampus');
                      triggerToast('Mode Aktif: Mode Kampus (University)');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                      currentMode === 'kampus'
                        ? 'bg-[#72DFD0] text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🎓 Kampus (Univ)
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-white text-[11px] font-bold">
                  {appMode === 'parent' && (
                    currentMode === 'kampus' ? (
                      <span className="text-[#72DFD0] flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" /> Student Hub
                      </span>
                    ) : (
                      <span className="text-[#72DFD0] flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5" /> Parent Hub
                      </span>
                    )
                  )}
                  {appMode === 'merchant' && (
                    <span className="text-amber-400 flex items-center gap-1">
                      <Store className="w-3.5 h-3.5" /> POS Kantin
                    </span>
                  )}
                </div>
              </div>

              {/* PUSH NOTIFICATION BANNER */}
              {pushNotification && (
                <div className="absolute top-14 left-3 right-3 bg-slate-900/95 text-white text-xs font-semibold p-3 rounded-2xl shadow-2xl z-50 border border-emerald-500/50 animate-in slide-in-from-top-4 duration-300 flex items-start gap-2.5">
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
                <div className="absolute top-14 left-4 right-4 bg-slate-900/95 text-white text-xs font-medium py-3 px-4 rounded-2xl shadow-2xl z-50 flex items-center justify-between border border-slate-700 animate-in fade-in duration-300">
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
                                <span>Total Saldo Mahasiswa</span>
                                <button onClick={() => setShowBalance(!showBalance)} className="hover:text-white">
                                  {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                              <p className="text-2xl font-black tracking-tight mt-0.5">
                                {showBalance ? (currentMode === 'kampus' ? 'Rp4.850.000' : 'Rp2.800.000.000') : '••••••••••••'}
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
                                  : `SPP Lunas • Sisa Pagu ${student.name.split(' ')[0]}: Rp ${(student.dailyLimit - student.spentToday).toLocaleString('id-ID')}`}
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
                      <div className="p-3.5 space-y-3 pb-24 animate-in fade-in duration-300">
                        
                        {/* Screen Header */}
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

                        {/* Student Selector Card & Sleek Tier Status Badge */}
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

                          {/* Sleek Single-Line Tier Badge for Kampus Mode */}
                          {currentMode === 'kampus' && (
                            <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white px-2.5 py-1 rounded-xl border border-emerald-500/40 shadow-xs flex items-center justify-between text-xs">
                              <span className="font-extrabold text-[#72DFD0] text-[11px] flex items-center gap-1">
                                ⭐ Mahasiswa Utama <span className="text-slate-300 font-normal">• Free Transfer 20x/Bln</span>
                              </span>
                              <span className="bg-[#D4F933] text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">Active</span>
                            </div>
                          )}
                        </div>

                        {/* WIDGET 1: UKT+ Portal (Prominently Placed Below Profile) */}
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

                        {/* WIDGET 2: Kas Komunitas Ormawa (Shared Treasury Prominently Placed) */}
                        {currentMode === 'kampus' && (
                          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="bg-teal-500 text-white p-1 rounded-lg">
                                  <Building2 className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-slate-900 text-xs">Kas Komunitas Ormawa</h3>
                                  <p className="text-[9px] text-slate-500 font-medium">Shared Treasury (HIMA Sistem Informasi)</p>
                                </div>
                              </div>
                              <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-300 font-bold text-[9px] px-2 py-0.5 rounded-full">
                                Dual-Approval Active
                              </span>
                            </div>

                            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                              <div>
                                <p className="text-[9px] text-slate-500 font-semibold">Kas Himpunan SI</p>
                                <p className="text-base font-black text-slate-900">Saldo: Rp 4.200.000</p>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 block">
                                  Approved by Ketua & Bendahara
                                </span>
                                <p className="text-[9px] text-slate-400 mt-0.5">Pengajuan: Rp 500.000 (LKMM)</p>
                              </div>
                            </div>

                            <button
                              onClick={() => triggerToast('✅ Dual-Approval OK! Dana Kas Himpunan Rp 500.000 disetujui via BNI Open API')}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#72DFD0]" />
                              Approve Pencairan Dana (Akbar - Bendahara 2)
                            </button>
                          </div>
                        )}

                        {/* PILAR 2: CONNECTED E-COMMERCE (Compact Horizontal Row) */}
                        {currentMode === 'kampus' && (
                          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                                <Link2 className="w-3.5 h-3.5 text-[#00A396]" /> Connected E-Commerce (Direct Pay)
                              </h3>
                              <span className="text-[9px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">Pilar 2 Direct Link</span>
                            </div>

                            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                              <div className="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-xl text-[10px] font-bold text-slate-800 flex items-center gap-1.5 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Gojek / GoPay ⚡
                              </div>
                              <div className="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-xl text-[10px] font-bold text-slate-800 flex items-center gap-1.5 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Tokopedia / Shopee ⚡
                              </div>
                              <div className="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-xl text-[10px] font-bold text-slate-800 flex items-center gap-1.5 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                                PLN Auto-Debit
                              </div>
                            </div>
                          </div>
                        )}

                        {/* HABIT BANKING WIDGET: KakaoBank 26-Week Challenge (Compact Height) */}
                        {currentMode === 'kampus' && (
                          <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-emerald-500/10 p-3 rounded-2xl border border-amber-300/80 shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                                <h3 className="font-extrabold text-slate-900 text-xs">🏆 Tantangan Nabung 26-Minggu</h3>
                              </div>
                              <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                                Streak 🔥 Wk 4
                              </span>
                            </div>

                            <div className="space-y-1 bg-white/90 p-2 rounded-xl border border-amber-200 text-xs">
                              <div className="flex items-center justify-between font-extrabold text-[11px]">
                                <span className="text-slate-700">Minggu 4 / 26</span>
                                <span className="text-emerald-700">Rp 400.000 / Rp 2.600.000</span>
                              </div>

                              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-amber-400 to-[#00A396] rounded-full"
                                  style={{ width: '15.3%' }}
                                ></div>
                              </div>

                              <p className="text-[9px] text-slate-500 pt-0.5">
                                Target: Dana Wisuda & Liburan Semester (Bunga 5.25% p.a.)
                              </p>
                            </div>

                            <button
                              onClick={() => triggerToast('🔥 Deposit Minggu ke-5 (Rp 100.000) Berhasil! Streak Nabung Bertambah!')}
                              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-1.5 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                            >
                              <Trophy className="w-3.5 h-3.5" /> Setor Wk 5 (Rp 100.000) & Keep Streak!
                            </button>
                          </div>
                        )}

                        {/* WIDGET 3 (KAMPUS MODE ONLY): Aktivitas Kampus Quick Actions */}
                        {currentMode === 'kampus' && (
                          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#00A396]" /> Aktivitas & Transaksi Kampus
                            </h3>

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => triggerToast('🤝 Fitur Split Bill wondr Siap!')}
                                className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-left transition-colors"
                              >
                                <span className="font-extrabold text-xs text-teal-900 block">🤝 Split Bill Nongkrong</span>
                                <span className="text-[9px] text-teal-700 block mt-0.5">Patungan warkop / kafe</span>
                              </button>

                              <button
                                onClick={() => triggerToast('💳 Top Up TapCash BNI Berhasil!')}
                                className="p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-left transition-colors"
                              >
                                <span className="font-extrabold text-xs text-orange-900 block">💳 Top Up KTM TapCash</span>
                                <span className="text-[9px] text-orange-700 block mt-0.5">Saldo E-Money BNI</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Pagu Mandiri Mahasiswa / Monthly Budgeting */}
                        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="bg-[#D4F933] text-slate-950 p-1 rounded-lg">
                                <Utensils className="w-3.5 h-3.5" />
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
                              <span className="text-slate-600">
                                {currentMode === 'kampus' ? 'Alokasi Terpakai Bulan Ini' : 'Terpakai Hari Ini'}
                              </span>
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

                          {/* Interactive Allowance Limit Slider */}
                          <div className="space-y-2 pt-1 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                <Sliders className="w-3.5 h-3.5 text-[#00A396]" />
                                {currentMode === 'kampus' ? 'Atur Pagu Bulanan Mandiri' : 'Atur Batas Pagu Harian'}
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
                                      [selectedStudentId]: {
                                        ...prev[selectedStudentId],
                                        dailyLimit: preset
                                      }
                                    }));
                                    triggerToast(`Pagu diubah ke Rp ${preset.toLocaleString('id-ID')}`);
                                  }}
                                  className={`py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                                    student.dailyLimit === preset
                                      ? 'bg-slate-900 text-white border-slate-900'
                                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {preset / 1000}rb
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* FEATURE 4: Reward / Benefit Banner */}
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
                                {currentMode === 'kampus' ? '🌟 Benefit Student BNI Co-Brand' : '🌟 Reward Kedisiplinan SPP'}
                              </span>
                              <p className="text-[11px] text-slate-800 font-semibold leading-snug">
                                {currentMode === 'kampus' ? (
                                  <>Dapatkan <span className="text-[#00897B] font-bold underline">Cashback 15% Merchant Kampus</span> & Beasiswa Talent BNI!</>
                                ) : (
                                  <>Anda berhak mendapatkan <span className="text-[#00897B] font-bold underline">KPR Flexi BNI Bunga 2.75%</span> Pre-Approved!</>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </>
                )}

              </div>

              {/* Bottom Nav Bar */}
              <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2.5 flex items-center justify-around z-30 relative shrink-0">
                <button
                  onClick={() => { setAppMode('parent'); setCurrentScreen('home'); }}
                  className={`flex flex-col items-center gap-1 ${
                    appMode === 'parent' && currentScreen === 'home' ? 'text-[#00A396]' : 'text-slate-400'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Home</span>
                </button>

                <button
                  onClick={() => { setAppMode('parent'); setCurrentScreen('education'); }}
                  className={`flex flex-col items-center gap-1 ${
                    appMode === 'parent' && currentScreen === 'education' ? 'text-[#00A396]' : 'text-slate-400'
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  <span className="text-[10px] font-bold">{currentMode === 'kampus' ? 'Student Hub' : 'Parent Hub'}</span>
                </button>

                <div className="relative -top-5">
                  <button
                    onClick={() => triggerToast('Fitur Scan QRIS Siap')}
                    className="w-14 h-14 bg-slate-950 rounded-full flex flex-col items-center justify-center border-4 border-[#F8FAFC] shadow-xl text-white active:scale-95 transition-transform"
                  >
                    <img src="/assets/qris-icon.svg" alt="QRIS" className="w-7 h-7 object-contain" />
                  </button>
                </div>

                <button
                  onClick={() => setAppMode('merchant')}
                  className={`flex flex-col items-center gap-1 ${
                    appMode === 'merchant' ? 'text-[#F37021] font-bold' : 'text-slate-400'
                  }`}
                >
                  <Store className="w-5 h-5" />
                  <span className="text-[10px] font-bold">POS Kantin</span>
                </button>

                <button
                  onClick={() => setAppMode('treasury')}
                  className={`flex flex-col items-center gap-1 ${
                    appMode === 'treasury' ? 'text-teal-600 font-bold' : 'text-slate-400'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="text-[10px] font-bold">B2B Portal</span>
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

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
