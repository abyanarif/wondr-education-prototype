import React, { useState } from 'react';
import {
  Store,
  CreditCard,
  QrCode,
  Utensils,
  Coffee,
  Gamepad2,
  Soup,
  Sandwich,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Plus,
  Minus,
  Trash2,
  UserCheck,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  ShieldAlert,
  Info,
  Calendar,
  Clock
} from 'lucide-react';
import { canteenMenuItems, merchantInfo } from '../dummyData';

export default function MerchantKantin({
  studentsData,
  selectedStudentId,
  onSelectStudent,
  onProcessTransaction,
  onTriggerNotification
}) {
  const student = studentsData[selectedStudentId] || studentsData.akbar;
  const remainingAllowance = Math.max(0, student.dailyLimit - student.spentToday);

  // POS Cart State: { [itemId]: quantity }
  const [cart, setCart] = useState({});
  const [isTappingCard, setIsTappingCard] = useState(false);

  // Result Modal State: { show: boolean, type: 'success' | 'limit_exceeded' | 'category_blocked', title: string, details: string, data: object }
  const [resultModal, setResultModal] = useState({ show: false, type: null, title: '', details: '', data: null });

  // Icon mapping helper
  const renderItemIcon = (iconName) => {
    switch (iconName) {
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'Coffee': return <Coffee className="w-5 h-5" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5 text-rose-500" />;
      case 'Soup': return <Soup className="w-5 h-5" />;
      case 'Sandwich': return <Sandwich className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-rose-500" />;
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

  // Calculate Cart Items list & Total
  const cartItems = Object.entries(cart).map(([itemId, qty]) => {
    const item = canteenMenuItems.find((m) => m.id === itemId);
    return { ...item, quantity: qty, subtotal: item.price * qty };
  });

  const cartTotal = cartItems.reduce((acc, curr) => acc + curr.subtotal, 0);

  // Simulate TAP Card action
  const handleTapCard = (studentId) => {
    setIsTappingCard(true);
    onSelectStudent(studentId);
    setTimeout(() => {
      setIsTappingCard(false);
      onTriggerNotification(`Kartu BNI Junior ${studentsData[studentId].name} terdeteksi di Mesin Kasir Kantin`);
    }, 600);
  };

  // Checkout Validation Engine (Core Demo Logic)
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // STEP 1: Category Locker Check
    // Find if any item in cart belongs to a blocked category for this student
    const blockedItem = cartItems.find((item) => {
      const isAllowed = student.categories[item.category];
      return isAllowed === false;
    });

    if (blockedItem) {
      // CASE C: Failed - Category Blocked
      setResultModal({
        show: true,
        type: 'category_blocked',
        title: 'Transaksi Ditolak!',
        subtitle: 'Kategori Ini Diblokir Orang Tua',
        details: `Item "${blockedItem.name}" termasuk dalam kategori ${blockedItem.categoryName} yang diblokir oleh orang tua (${student.name}) di aplikasi wondr.`,
        data: {
          blockedItemName: blockedItem.name,
          categoryName: blockedItem.categoryName,
          total: cartTotal
        }
      });
      return;
    }

    // STEP 2: Allowance Limit Check
    if (cartTotal > remainingAllowance) {
      // CASE B: Failed - Limit Exceeded
      setResultModal({
        show: true,
        type: 'limit_exceeded',
        title: 'Transaksi Ditolak!',
        subtitle: 'Batas Pagu Harian Terlampaui',
        details: `Total transaksi Rp ${cartTotal.toLocaleString('id-ID')} melebihi sisa pagu harian ${student.name} (Rp ${remainingAllowance.toLocaleString('id-ID')}). Batas harian set: Rp ${student.dailyLimit.toLocaleString('id-ID')}.`,
        data: {
          cartTotal,
          remainingAllowance,
          dailyLimit: student.dailyLimit
        }
      });
      return;
    }

    // STEP 3: Transaction Success!
    const updatedSpent = student.spentToday + cartTotal;
    const newRemaining = student.dailyLimit - updatedSpent;
    const itemsSummary = cartItems.map(i => `${i.name} (${i.quantity}x)`).join(', ');

    // Call global update handler
    onProcessTransaction({
      studentId: student.id,
      amount: cartTotal,
      itemSummary: itemsSummary,
      cartItems: cartItems
    });

    setResultModal({
      show: true,
      type: 'success',
      title: 'Transaksi Berhasil!',
      subtitle: `Pembayaran QRIS / BNI Junior Disetujui`,
      details: `Pembayaran sebesar Rp ${cartTotal.toLocaleString('id-ID')} berhasil diproses via BNI Junior ${student.name}.`,
      data: {
        itemsSummary,
        total: cartTotal,
        newRemainingAllowance: newRemaining,
        studentName: student.name,
        trxId: `TRX-BNI-ED-${Math.floor(10000 + Math.random() * 90000)}`
      }
    });

    // Clear POS cart after success
    setCart({});
  };

  return (
    <div className="bg-[#F1F5F9] min-h-[850px] max-h-[92vh] flex flex-col relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">
      
      {/* Merchant Header Bar */}
      <div className="bg-slate-900 text-white p-3.5 px-4 flex items-center justify-between shadow-md z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#F37021] p-2 rounded-xl text-white font-bold shadow-xs">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-xs tracking-tight">{merchantInfo.name}</h2>
              <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[9px] px-1.5 py-0.2 rounded border border-emerald-500/30">
                POS Online
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-2">
              <span>{merchantInfo.cashier}</span> • <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#72DFD0]" /> Live Sync</span>
            </p>
          </div>
        </div>

        {/* TAP CARD QUICK SIMULATOR */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleTapCard('akbar')}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
              selectedStudentId === 'akbar'
                ? 'bg-[#72DFD0] text-slate-950 border-[#72DFD0] shadow-xs'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            TAP Akbar
          </button>

          <button
            onClick={() => handleTapCard('aisha')}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
              selectedStudentId === 'aisha'
                ? 'bg-[#72DFD0] text-slate-950 border-[#72DFD0] shadow-xs'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            TAP Aisha
          </button>
        </div>
      </div>

      {/* Main Merchant Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        
        {/* Student Identification Banner (Card TAP Result) */}
        <div className="bg-white p-3.5 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          {isTappingCard && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex items-center justify-center gap-2 text-slate-900 font-bold text-xs z-20">
              <RefreshCw className="w-5 h-5 text-[#00A396] animate-spin" />
              <span>Membaca NFC Kartu BNI Junior...</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#F37021] shadow-xs"
                />
                <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white absolute bottom-0 right-0"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-slate-900 text-sm">{student.name}</h3>
                  <span className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-slate-200">
                    {student.grade}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {student.cardNo} • {student.school}
                </p>
              </div>
            </div>

            {/* Remaining Allowance Badge */}
            <div className="text-right bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Sisa Pagu Jajan</span>
              <span className="font-black text-sm text-[#00897B]">
                Rp {remainingAllowance.toLocaleString('id-ID')}
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                Limit: Rp {student.dailyLimit.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Student Category Permissions Indicator Bar */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-500">Status Aturan Orang Tua:</span>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                student.categories.kantin
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
              }`}>
                {student.categories.kantin ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                Kantin: {student.categories.kantin ? 'Diizinkan' : 'Diblokir'}
              </span>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                student.categories.game
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
              }`}>
                {student.categories.game ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                Game: {student.categories.game ? 'Diizinkan' : 'Diblokir'}
              </span>
            </div>
          </div>
        </div>

        {/* Canteen Menu Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#F37021]" /> Menu Kantin SMAN 1 Surabaya
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold">Klik item untuk menambah ke keranjang</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {canteenMenuItems.map((item) => {
              const isAllowedForStudent = student.categories[item.category];
              const qtyInCart = cart[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className={`bg-white p-3 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden shadow-xs ${
                    !isAllowedForStudent
                      ? 'border-rose-200 bg-rose-50/40'
                      : qtyInCart > 0
                      ? 'border-[#00A396] ring-1 ring-[#00A396]'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    {/* Item Top Info */}
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-xl text-slate-900 ${!isAllowedForStudent ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-[#00897B]'}`}>
                        {renderItemIcon(item.icon)}
                      </div>

                      {/* Category Permission Pill relative to Student Rules */}
                      {isAllowedForStudent ? (
                        <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Beli OK
                        </span>
                      ) : (
                        <span className="bg-rose-500 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                          <Lock className="w-2.5 h-2.5" /> Diblokir
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs leading-tight">{item.name}</h4>
                      <span className="text-[9px] text-slate-500 font-medium block mt-0.5 truncate">
                        {item.categoryName}
                      </span>
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
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 active:scale-95 ${
                          !isAllowedForStudent
                            ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
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

        {/* POS Cart & Checkout Drawer */}
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
              <p className="font-semibold">Keranjang masih kosong</p>
              <p className="text-[10px]">Pilih menu di atas untuk memproses pembelian siswa</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
              {cartItems.map((cartItem) => {
                const isAllowed = student.categories[cartItem.category];
                return (
                  <div
                    key={cartItem.id}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs border ${
                      !isAllowed ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {!isAllowed && <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                      <div>
                        <p className="font-bold text-slate-900">{cartItem.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {cartItem.quantity} x Rp {cartItem.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-slate-900">
                        Rp {cartItem.subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Checkout Total & Main Process Button */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600">Total Pembayaran</span>
              <span className="font-black text-base text-slate-900">
                Rp {cartTotal.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Check validation status notice */}
            {cartItems.length > 0 && cartTotal > remainingAllowance && (
              <div className="bg-amber-50 border border-amber-200 p-2 rounded-xl flex items-center gap-2 text-[10px] text-amber-800 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Total belanja melebihi sisa pagu harian (Sisa: Rp {remainingAllowance.toLocaleString('id-ID')})</span>
              </div>
            )}

            {cartItems.some(i => !student.categories[i.category]) && (
              <div className="bg-rose-50 border border-rose-200 p-2 rounded-xl flex items-center gap-2 text-[10px] text-rose-800 font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Ada item dari kategori yang diblokir oleh orang tua!</span>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
                cartItems.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-[#FF7A00] to-[#F37021] text-white hover:from-[#F37021] hover:to-[#D85A10] shadow-[#F37021]/30'
              }`}
            >
              <QrCode className="w-4 h-4" />
              PROSES BAYAR (TAP QR BNI JUNIOR)
            </button>
          </div>
        </div>

      </div>

      {/* RESULT MODAL (SUCCESS / ERROR VALIDATION ENGINE) */}
      {resultModal.show && (
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[360px] rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200">
            
            {/* Modal Icon Header */}
            {resultModal.type === 'success' && (
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-emerald-300 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            )}

            {resultModal.type === 'limit_exceeded' && (
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-amber-300">
                <AlertTriangle className="w-10 h-10" />
              </div>
            )}

            {resultModal.type === 'category_blocked' && (
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-rose-300">
                <Lock className="w-10 h-10 text-rose-600" />
              </div>
            )}

            {/* Modal Titles */}
            <div className="space-y-1">
              <h3 className={`font-black text-lg tracking-tight ${
                resultModal.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {resultModal.title}
              </h3>
              <p className="font-extrabold text-slate-800 text-xs">{resultModal.subtitle}</p>
            </div>

            {/* Modal Details Body */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-left text-xs space-y-2">
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {resultModal.details}
              </p>

              {resultModal.type === 'success' && (
                <div className="pt-2 border-t border-slate-200 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Sisa Pagu {student.name}:</span>
                    <span className="font-bold text-emerald-700">
                      Rp {resultModal.data.newRemainingAllowance.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>ID Transaksi:</span>
                    <span className="font-bold text-slate-800">{resultModal.data.trxId}</span>
                  </div>
                </div>
              )}

              {resultModal.type === 'category_blocked' && (
                <div className="bg-rose-100/60 p-2 rounded-xl border border-rose-200 text-rose-900 text-[10px] font-medium">
                  💡 <b>Info Demo:</b> Buka tab <b>"Mode Orang Tua"</b> & sakelar <b>Blokir Kategori Game</b> dapat diubah secara real-time!
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setResultModal({ show: false, type: null, title: '', details: '', data: null })}
              className={`w-full py-3 rounded-2xl font-bold text-xs transition-colors shadow-md ${
                resultModal.type === 'success'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              Tutup & Lanjutkan Demo
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
