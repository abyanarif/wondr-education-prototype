import React, { useState, useEffect } from 'react';
import {
  Store,
  CreditCard,
  Utensils,
  Coffee,
  Soup,
  Sandwich,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Minus,
  Trash2,
  RefreshCw,
  ShoppingBag,
  Clock,
  XCircle,
  X,
  Wifi
} from 'lucide-react';
import { canteenMenuItems, merchantInfo } from '../dummyData';

export default function MerchantKantin({
  currentMode = 'sekolah',
  studentsData,
  selectedStudentId,
  onSelectStudent,
  onProcessTransaction,
  onTriggerNotification
}) {
  // Current Live Date & Time formatting
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      const dateStr = now.toLocaleDateString('id-ID', options);
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
      setCurrentDateTime(`${dateStr} • ${timeStr}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // POS Cart State: { [itemId]: quantity }
  const [cart, setCart] = useState({});

  // Checkout TAP Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [tapResult, setTapResult] = useState(null); // null | { status: 'success' | 'error', student: object, details: object }

  // Icon mapping helper
  const renderItemIcon = (iconName) => {
    switch (iconName) {
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'Coffee': return <Coffee className="w-5 h-5" />;
      case 'Soup': return <Soup className="w-5 h-5" />;
      case 'Sandwich': return <Sandwich className="w-5 h-5" />;
      default: return <Utensils className="w-5 h-5" />;
    }
  };

  // Add to Cart
  const handleAddToCart = (item) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  // Remove from Cart
  const handleRemoveFromCart = (itemId) => {
    setCart((prev) => {
      const copy = { ...prev };
      if (copy[itemId] > 1) {
        copy[itemId] -= 1;
      } else {
        delete copy[itemId];
      }
      return copy;
    });
  };

  // Clear Cart
  const handleClearCart = () => {
    setCart({});
  };

  // Calculate Cart Items & Total
  const cartItems = Object.entries(cart).map(([itemId, qty]) => {
    const item = canteenMenuItems.find((m) => m.id === itemId);
    return { ...item, quantity: qty, subtotal: item.price * qty };
  });

  const cartTotal = cartItems.reduce((acc, curr) => acc + curr.subtotal, 0);

  // Open Checkout Modal
  const handleOpenCheckoutModal = () => {
    if (cartItems.length === 0) return;
    setTapResult(null);
    setShowCheckoutModal(true);
  };

  // Close Checkout Modal
  const handleCloseCheckoutModal = () => {
    setShowCheckoutModal(false);
    setIsScanning(false);
    setTapResult(null);
  };

  // Simulate NFC TAP Card Process
  const handleSimulateTap = (studentId) => {
    onSelectStudent(studentId);
    setIsScanning(true);
    setTapResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const student = studentsData[studentId];
      const remainingAllowance = student.dailyLimit - student.spentToday;

      if (remainingAllowance >= cartTotal) {
        // Success Checkout
        const newSpent = student.spentToday + cartTotal;
        const newRemaining = student.dailyLimit - newSpent;
        const itemsSummary = cartItems.map((i) => `${i.name} (${i.quantity}x)`).join(', ');
        const trxId = 'TRX-BNI-' + Math.floor(100000 + Math.random() * 900000);

        onProcessTransaction({
          studentId,
          amount: cartTotal,
          itemSummary: itemsSummary,
          cartItems
        });

        // Push real-time notification
        onTriggerNotification(
          `🔔 Transaksi Kantin: ${student.name} baru saja membeli ${itemsSummary} (Rp ${cartTotal.toLocaleString('id-ID')})`
        );

        setTapResult({
          status: 'success',
          student,
          remainingAllowance,
          newRemaining,
          cartTotal,
          itemsSummary,
          trxId
        });
      } else {
        // Limit Exceeded Error
        setTapResult({
          status: 'error',
          student,
          remainingAllowance,
          cartTotal
        });
      }
    }, 600);
  };

  // Complete Transaction and Reset Cart
  const handleFinishTransaction = () => {
    handleCloseCheckoutModal();
    setCart({});
  };

  return (
    <div className="bg-[#F1F5F9] min-h-[850px] max-h-[92vh] flex flex-col relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">
      
      {/* 1. TOP HEADER: Merchant Name, Cashier Name, Current Date/Time */}
      <div className="bg-slate-900 text-white p-3.5 px-4 flex items-center justify-between shadow-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#FF7A00] to-[#F37021] p-2 rounded-2xl text-white font-bold shadow-sm">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-xs tracking-tight text-white">
                {currentMode === 'kampus' ? 'POS Juragan Merchant - Kantin Pusat Kampus B Unair' : merchantInfo.name}
              </h2>
              <span className={`font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 ${
                currentMode === 'kampus'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-extrabold shadow-sm'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {currentMode === 'kampus' ? '⚡ Settlement Instan H+0 ke Rekening BNI Juragan' : 'POS Online'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
              <span>Kasir: <strong className="text-slate-200">{merchantInfo.cashier}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#72DFD0]">
                <Clock className="w-3 h-3" />
                {currentDateTime || 'Jumat, 31 Juli 2026 • 17:24 WIB'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. MAIN BODY: Menu Grid & Cart Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        
        {/* Menu Grid Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#F37021]" />
              {currentMode === 'kampus' ? 'Menu Kantin Pusat Kampus B Unair' : 'Menu Kantin SMAN 1 Surabaya'}
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold">Pilih menu di bawah</span>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {canteenMenuItems.map((item) => {
              const qtyInCart = cart[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className={`bg-white p-3 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden shadow-xs ${
                    qtyInCart > 0
                      ? 'border-[#00A396] ring-1 ring-[#00A396]'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-xl text-slate-900 bg-[#E6FBF8] text-[#00A396]">
                        {renderItemIcon(item.icon)}
                      </div>
                      <span className="bg-slate-100 text-slate-600 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs leading-tight">{item.name}</h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100">
                    <span className="font-extrabold text-xs text-slate-900">
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>

                    {/* Quantity Controls */}
                    {qtyInCart > 0 ? (
                      <div className="flex items-center gap-1 bg-slate-900 text-white rounded-xl p-0.5">
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="w-5 h-5 rounded-lg hover:bg-slate-700 flex items-center justify-center font-bold text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1">{qtyInCart}</span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="w-5 h-5 rounded-lg hover:bg-slate-700 flex items-center justify-center font-bold text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center gap-1 active:scale-95"
                      >
                        <Plus className="w-3 h-3" /> Tambah
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. CART SECTION AT THE BOTTOM */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#F37021]" />
              <h3 className="font-bold text-slate-900 text-sm">Keranjang Kasir</h3>
              <span className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-full">
                {cartItems.reduce((a, b) => a + b.quantity, 0)} Items
              </span>
            </div>

            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-[11px] font-bold text-rose-500 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Bersihkan
              </button>
            )}
          </div>

          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs space-y-1">
              <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-600">Keranjang masih kosong</p>
              <p className="text-[10px]">Pilih menu di atas untuk memulai transaksi kasir</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-36 overflow-y-auto no-scrollbar">
              {cartItems.map((cartItem) => (
                <div
                  key={cartItem.id}
                  className="flex items-center justify-between p-2 rounded-xl text-xs bg-slate-50 border border-slate-100"
                >
                  <div>
                    <p className="font-bold text-slate-900">{cartItem.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {cartItem.quantity} x Rp {cartItem.price.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-slate-900">
                      Rp {cartItem.subtotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Checkout Total & Trigger Button */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600">Total Pembayaran</span>
              <span className="font-black text-base text-slate-900">
                Rp {cartTotal.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={handleOpenCheckoutModal}
              disabled={cartItems.length === 0}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
                cartItems.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-[#FF7A00] to-[#F37021] text-white hover:from-[#F37021] hover:to-[#D85A10] shadow-[#F37021]/30'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              PROSES BAYAR (TAP KARTU SISWA)
            </button>
          </div>
        </div>

      </div>

      {/* 4. CHECKOUT & STUDENT TAP SIMULATION MODAL (THE DEMO MOMENT) */}
      {showCheckoutModal && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[370px] rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            
            {/* Modal Close Button */}
            <button
              onClick={handleCloseCheckoutModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1 pr-6">
              <div className="inline-flex items-center gap-1.5 bg-[#E6FBF8] text-[#00A396] px-3 py-1 rounded-full text-[10px] font-extrabold border border-[#72DFD0]/40">
                <Wifi className="w-3 h-3 animate-pulse" /> NFC / RFID Terminal
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Identifikasi & Pembayaran Siswa</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Total Belanja: <strong className="text-slate-900 font-black">Rp {cartTotal.toLocaleString('id-ID')}</strong> ({cartItems.reduce((a, b) => a + b.quantity, 0)} Items)
              </p>
            </div>

            {/* Scanning State Animation */}
            {isScanning && (
              <div className="py-8 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#00A396]/20 animate-ping"></div>
                  <div className="w-12 h-12 bg-[#00A396] text-white rounded-full flex items-center justify-center shadow-lg relative z-10">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  </div>
                </div>
                <p className="text-xs font-extrabold text-slate-800">Membaca Sensor Kartu BNI Junior...</p>
                <p className="text-[10px] text-slate-500">Memverifikasi Pagu Harian Siswa...</p>
              </div>
            )}

            {/* Initial State: Prompt & Student Tap Buttons */}
            {!isScanning && !tapResult && (
              <div className="space-y-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                  <p className="text-xs text-slate-600 font-medium">
                    {currentMode === 'kampus' ? 'Pilih simulasikan metode pembayaran POS Kantin Kampus:' : 'Simulasikan penempelan Kartu Siswa pada mesin kasir:'}
                  </p>
                </div>

                <div className="space-y-2">
                  {/* Akbar / Kampus QRIS wondr & Tap KTM Button */}
                  <button
                    onClick={() => handleSimulateTap('akbar')}
                    className="w-full p-3 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-[#F37021] rounded-2xl flex items-center justify-between text-left transition-all group shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={studentsData.akbar?.avatar}
                        alt="Akbar"
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#F37021]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-xs text-slate-900">{studentsData.akbar?.name}</h4>
                          <span className="bg-slate-100 text-slate-700 text-[9px] font-bold px-1.5 rounded">
                            {currentMode === 'kampus' ? 'Mahasiswa Unair' : studentsData.akbar?.grade}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {currentMode === 'kampus' ? 'KTM Co-Brand BNI' : 'Sisa Pagu'}: <strong className="text-[#00897B] font-bold">Rp {Math.max(0, studentsData.akbar.dailyLimit - studentsData.akbar.spentToday).toLocaleString('id-ID')}</strong>
                        </p>
                      </div>
                    </div>
                    <span className="bg-[#F37021] text-white text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-xs group-hover:scale-105 transition-transform flex items-center gap-1">
                      <CreditCard className="w-3 h-3" /> {currentMode === 'kampus' ? '📱 QRIS / 💳 Tap KTM' : 'TAP Kartu Akbar'}
                    </span>
                  </button>

                  {/* Aisha Tap Button */}
                  <button
                    onClick={() => handleSimulateTap('aisha')}
                    className="w-full p-3 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-[#72DFD0] rounded-2xl flex items-center justify-between text-left transition-all group shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={studentsData.aisha?.avatar}
                        alt="Aisha"
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-400"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-xs text-slate-900">{studentsData.aisha?.name}</h4>
                          <span className="bg-slate-100 text-slate-700 text-[9px] font-bold px-1.5 rounded">
                            {studentsData.aisha?.grade}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Sisa Pagu: <strong className="text-[#00897B] font-bold">Rp {Math.max(0, studentsData.aisha.dailyLimit - studentsData.aisha.spentToday).toLocaleString('id-ID')}</strong>
                        </p>
                      </div>
                    </div>
                    <span className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-xs group-hover:scale-105 transition-transform flex items-center gap-1">
                      <CreditCard className="w-3 h-3" /> TAP Kartu Aisha
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Tap Result: SUCCESS SCREEN */}
            {!isScanning && tapResult?.status === 'success' && (
              <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-emerald-400 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h4 className="font-black text-emerald-600 text-lg">Pembayaran Berhasil!</h4>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">NFC / BNI Junior Disetujui</p>
                </div>

                {/* Student Photo & Result Info Card */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-left space-y-3 text-xs">
                  <div className="flex items-center gap-3 pb-2.5 border-b border-slate-200">
                    <img
                      src={tapResult.student.avatar}
                      alt={tapResult.student.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                    />
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-xs">{tapResult.student.name}</h5>
                      <p className="text-[10px] text-slate-500">{tapResult.student.grade} • {tapResult.student.school}</p>
                      <span className="inline-block mt-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                        Kartu BNI Junior Valid
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-slate-600">
                      <span>Total Transaksi:</span>
                      <span className="font-black text-slate-900">Rp {tapResult.cartTotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Sisa Pagu Sebelum:</span>
                      <span className="font-medium text-slate-700">Rp {tapResult.remainingAllowance.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span className="font-bold text-slate-700">Sisa Pagu Sekarang:</span>
                      <span className="font-black text-emerald-700 text-xs">
                        Rp {tapResult.newRemaining.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="bg-emerald-50 text-emerald-800 p-2 rounded-xl text-[10px] font-bold text-center border border-emerald-200">
                    ✓ Notifikasi otomatis dikirim ke aplikasi wondr orang tua
                  </div>
                </div>

                <button
                  onClick={handleFinishTransaction}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md transition-colors"
                >
                  Selesai & Transaksi Baru
                </button>
              </div>
            )}

            {/* Tap Result: ERROR SCREEN (LIMIT EXCEEDED) */}
            {!isScanning && tapResult?.status === 'error' && (
              <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-rose-300">
                  <XCircle className="w-10 h-10" />
                </div>

                <div>
                  <h4 className="font-black text-rose-600 text-base">Sisa Pagu Harian Tidak Cukup!</h4>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">Transaksi Ditolak Sistem</p>
                </div>

                {/* Student Photo & Error Info Card */}
                <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200 text-left space-y-3 text-xs">
                  <div className="flex items-center gap-3 pb-2.5 border-b border-rose-200">
                    <img
                      src={tapResult.student.avatar}
                      alt={tapResult.student.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-rose-500 shadow-xs"
                    />
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-xs">{tapResult.student.name}</h5>
                      <p className="text-[10px] text-slate-500">{tapResult.student.grade}</p>
                      <span className="inline-block mt-0.5 bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                        Batas Pagu Terlampaui
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-slate-700">
                      <span>Total Transaksi:</span>
                      <span className="font-black text-rose-700">Rp {tapResult.cartTotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Sisa Pagu Harian {tapResult.student.name}:</span>
                      <span className="font-black text-amber-700">Rp {tapResult.remainingAllowance.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>Limit Pagu Harian:</span>
                      <span>Rp {tapResult.student.dailyLimit.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-rose-700 leading-snug font-medium pt-1 border-t border-rose-200">
                    Perhatian: Transaksi ini Rp {(tapResult.cartTotal - tapResult.remainingAllowance).toLocaleString('id-ID')} melebihi sisa pagu jajan yang diizinkan orang tua.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setTapResult(null)}
                    className="py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-slate-800 transition-colors"
                  >
                    Coba Kartu Lain
                  </button>
                  <button
                    onClick={handleCloseCheckoutModal}
                    className="py-2.5 bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs hover:bg-slate-300 transition-colors"
                  >
                    Ubah Pesanan
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
