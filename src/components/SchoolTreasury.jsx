import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ChevronRight,
  FileText,
  DollarSign,
  Bell,
  RefreshCw,
  X,
  CreditCard
} from 'lucide-react';
import { initialTreasuryStudents, treasuryMetrics } from '../dummyData';

export default function SchoolTreasury({ onTriggerNotification }) {
  const [students, setStudents] = useState(initialTreasuryStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');

  // Simulation Modal State
  const [reminderModal, setReminderModal] = useState({
    show: false,
    student: null
  });

  // Calculate dynamic metrics
  const paidCount = students.filter(s => s.status === 'LUNAS').length;
  const totalStudentsCount = 1200; // Total overall school capacity
  const paidStudentsTotal = treasuryMetrics.initialPaidStudents + (paidCount - 4); // base dynamic offset

  const totalCollectedAmount = students.reduce((acc, curr) => {
    return curr.status === 'LUNAS' ? acc + curr.sppAmount : acc;
  }, treasuryMetrics.initialCollectedAmount - (3 * 1200000)); // base offset

  const collectionPercentage = Math.round((totalCollectedAmount / treasuryMetrics.totalTargetAmount) * 100);

  // Filter students table
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nis.includes(searchQuery) ||
      student.parentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = selectedClass === 'ALL' || student.className === selectedClass;
    return matchesSearch && matchesClass;
  });

  // Action 1: Send Automated Reminder Modal
  const handleOpenReminderModal = (student) => {
    setReminderModal({
      show: true,
      student
    });
  };

  // Action 2: Simulate Payment for Student (The Demo Moment)
  const handleSimulatePayment = (studentId) => {
    const targetStudent = students.find(s => s.id === studentId);
    if (!targetStudent) return;

    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            status: 'LUNAS',
            paymentMethod: 'Autodebit wondr',
            paidAt: 'Hari ini, Real-time API',
            overdueDays: 0
          };
        }
        return s;
      })
    );

    setReminderModal({ show: false, student: null });

    onTriggerNotification(
      `🔔 BNI Open API Notice: Tagihan SPP ${targetStudent.name} (Rp ${targetStudent.sppAmount.toLocaleString('id-ID')}) berhasil dilunasi via autodebit wondr by BNI`
    );
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[850px] max-h-[92vh] flex flex-col relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">
      
      {/* Top B2B Portal Header Bar */}
      <div className="bg-[#003B46] text-white p-4 flex items-center justify-between shadow-md z-10 shrink-0 border-b border-[#005E6A]">
        <div className="flex items-center gap-3">
          <div className="bg-[#005E6A] p-2.5 rounded-2xl border border-teal-500/30 shadow-xs">
            <Building2 className="w-6 h-6 text-[#72DFD0]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm tracking-tight text-white">
                SMAN 1 Surabaya - Cash Management System
              </h2>
              <span className="bg-[#72DFD0] text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> BNI Open API
              </span>
            </div>
            <p className="text-[11px] text-teal-100 font-medium">
              Portal Bendahara Sekolah & Rekonsiliasi Otomatis SPP • Rekening Giro: {treasuryMetrics.giroAccountNo}
            </p>
          </div>
        </div>

        {/* Quick Action Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="bg-slate-900/60 px-3 py-1.5 rounded-xl border border-teal-500/20 text-xs flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="text-slate-300 font-mono text-[11px]">API Host: api.bni.co.id/edu-v2</span>
          </div>
        </div>
      </div>

      {/* Main B2B Content Dashboard (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5 no-scrollbar">
        
        {/* Top Summary Metrics Cards (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          
          {/* Card 1: Total Penerimaan SPP */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold text-xs">Total Penerimaan SPP Juli 2026</span>
              <div className="bg-[#E6FBF8] text-[#00A396] p-2 rounded-xl">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Rp {totalCollectedAmount.toLocaleString('id-ID')}
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                Target Keseluruhan: Rp {treasuryMetrics.totalTargetAmount.toLocaleString('id-ID')}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00A396] to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${collectionPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-600 font-extrabold">
                <span>Pencapaian SPP</span>
                <span className="text-emerald-600">{collectionPercentage}% Terkumpul</span>
              </div>
            </div>
          </div>

          {/* Card 2: Siswa Lunas Counter */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold text-xs">Status Pelunasan Siswa</span>
              <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {paidStudentsTotal} <span className="text-xs text-slate-500 font-bold">/ {totalStudentsCount} Siswa</span>
              </h3>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 92% Siswa terbayar otomatis via autodebit
              </p>
            </div>

            <div className="bg-emerald-50 p-2 rounded-2xl border border-emerald-100 text-[10px] text-emerald-800 font-semibold flex items-center justify-between">
              <span>Sisa Menunggak: {totalStudentsCount - paidStudentsTotal} Siswa</span>
              <span className="font-extrabold text-emerald-700">Autodebit Active</span>
            </div>
          </div>

          {/* Card 3: Rasio Tunggakan SPP (Bad Debt Reduction) */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold text-xs">Rasio Tunggakan SPP (Bad Debt)</span>
              <div className="bg-amber-100 text-amber-700 p-2 rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#003B46] tracking-tight flex items-center gap-2">
                {treasuryMetrics.badDebtRate}
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                  -50% vs Manual
                </span>
              </h3>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                Dua kali lipat lebih rendah dibanding pencatatan SPP manual.
              </p>
            </div>

            <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100 text-[10px] text-slate-600 font-medium">
              ⚡ Terhubung langsung dengan <b>BNI Virtual Account & Giro</b>
            </div>
          </div>

        </div>

        {/* Student Payment Status Table (Tabel Status SPP Siswa) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-3 p-4">
          
          {/* Table Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00A396]" /> Tabel Status SPP Siswa (Juli 2026)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Pencatatan real-time autodebit wondr app & transfer manual BNI
              </p>
            </div>

            {/* Search & Class Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari siswa / NIS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00A396]"
                />
              </div>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#00A396]"
              >
                <option value="ALL">Semua Kelas</option>
                <option value="Kelas 11 IPA 2">Kelas 11 IPA 2</option>
                <option value="Kelas 11 IPS 1">Kelas 11 IPS 1</option>
                <option value="Kelas 11 IPA 1">Kelas 11 IPA 1</option>
                <option value="Kelas 8 B">Kelas 8 B</option>
              </select>
            </div>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold text-[11px]">
                  <th className="py-2.5 px-3">Siswa & NIS</th>
                  <th className="py-2.5 px-3">Kelas</th>
                  <th className="py-2.5 px-3">Orang Tua</th>
                  <th className="py-2.5 px-3">Tagihan SPP</th>
                  <th className="py-2.5 px-3">Status Pembayaran</th>
                  <th className="py-2.5 px-3">Metode & Waktu</th>
                  <th className="py-2.5 px-3 text-right">Aksi Otomatisasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Student Info */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={std.avatar} alt={std.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                        <div>
                          <span className="font-bold text-slate-900 block">{std.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">NIS: {std.nis}</span>
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-3 px-3">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {std.className}
                      </span>
                    </td>

                    {/* Parent */}
                    <td className="py-3 px-3">
                      <span className="text-slate-800 font-semibold">{std.parentName}</span>
                      <span className="text-[10px] text-slate-400 block">{std.parentPhone}</span>
                    </td>

                    {/* SPP Amount */}
                    <td className="py-3 px-3 font-extrabold text-slate-900">
                      Rp {std.sppAmount.toLocaleString('id-ID')}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      {std.status === 'LUNAS' ? (
                        <span className="bg-emerald-500 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full inline-flex items-center gap-1 shadow-2xs">
                          <CheckCircle2 className="w-3 h-3" /> LUNAS
                        </span>
                      ) : (
                        <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-1 rounded-full inline-flex items-center gap-1 shadow-2xs">
                          <AlertTriangle className="w-3 h-3" /> MENUNGGAK ({std.overdueDays} Hari)
                        </span>
                      )}
                    </td>

                    {/* Method & Date */}
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-700 block">{std.paymentMethod}</span>
                      <span className="text-[10px] text-slate-400 block">{std.paidAt}</span>
                    </td>

                    {/* Action Button (The Demo Moment) */}
                    <td className="py-3 px-3 text-right">
                      {std.status === 'MENUNGGAK' ? (
                        <button
                          onClick={() => handleOpenReminderModal(std)}
                          className="bg-[#003B46] hover:bg-[#005E6A] text-white px-3 py-1.5 rounded-xl text-[11px] font-bold inline-flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                        >
                          <Send className="w-3.5 h-3.5 text-[#72DFD0]" />
                          Kirim Pengingat Otomatis
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                          ✓ Terverifikasi API
                        </span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BNI Wholesale Core Integration Banner (Footer Notice) */}
        <div className="bg-gradient-to-r from-[#003B46] via-[#005E6A] to-[#003B46] p-4 rounded-3xl text-white shadow-md border border-teal-500/30 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#72DFD0] text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-md">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-white">BNI Open API Middleware Integration</h4>
              <p className="text-[11px] text-teal-100 font-medium leading-snug">
                ⚡ Endapan Dana Operasional Yayasan di-hold secara otomatis pada Rekening Giro BNI SMAN 1 Surabaya.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="bg-white/10 text-teal-100 font-mono text-[10px] px-3 py-1 rounded-xl border border-white/10">
              Giro BNI •••• 3019 Verified
            </span>
          </div>
        </div>

      </div>

      {/* CONFIRMATION & SIMULATION MODAL (The Demo Moment Modal) */}
      {reminderModal.show && reminderModal.student && (
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[420px] rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-100 text-left animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-[#003B46] text-[#72DFD0] p-1.5 rounded-xl">
                  <Send className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">Automated SPP Invoicing</h3>
              </div>
              <button
                onClick={() => setReminderModal({ show: false, student: null })}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#E6FBF8] p-3.5 rounded-2xl border border-[#72DFD0]/40 space-y-1">
                <div className="flex items-center gap-2 text-[#00897B] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Notifikasi & Autodebit Invoice Terkirim!</span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed pt-1">
                  Tagihan SPP sebesar <b>Rp {reminderModal.student.sppAmount.toLocaleString('id-ID')}</b> telah dikirimkan secara langsung ke aplikasi wondr Orang Tua (<b>{reminderModal.student.parentName}</b> / {reminderModal.student.parentPhone}).
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Nama Siswa:</span>
                  <span className="font-bold text-slate-900">{reminderModal.student.name} ({reminderModal.student.className})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Nomor NIS:</span>
                  <span className="font-bold text-slate-900">{reminderModal.student.nis}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tunggakan:</span>
                  <span className="font-bold text-rose-600">{reminderModal.student.overdueDays} Hari</span>
                </div>
              </div>

              {/* SIMULATION ACTION BUTTON */}
              <div className="pt-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Simulasi Pengujian Live Bendahara:</p>
                <button
                  onClick={() => handleSimulatePayment(reminderModal.student.id)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00A396] to-emerald-600 text-white font-extrabold text-xs hover:from-[#00897B] hover:to-emerald-700 shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
                >
                  <Zap className="w-4 h-4 text-[#D4F933]" />
                  Simulasi Bayar SPP {reminderModal.student.name} (API Trigger)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
