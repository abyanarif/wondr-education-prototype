import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertTriangle,
  Send,
  Search,
  Zap,
  FileText,
  DollarSign,
  X,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { initialTreasuryStudents, treasuryMetrics } from '../dummyData';

export default function SchoolTreasury({ currentMode = 'sekolah', onTriggerNotification }) {
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
  const totalStudentsCount = 1200;
  const paidStudentsTotal = treasuryMetrics.initialPaidStudents + (paidCount - 4); // base dynamic offset

  const totalCollectedAmount = students.reduce((acc, curr) => {
    return curr.status === 'LUNAS' ? acc + curr.sppAmount : acc;
  }, treasuryMetrics.initialCollectedAmount - (3 * 1200000));

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

  // Action 2: Simulate Payment for Student (Demo Action)
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
      `🔔 BNI Open API Notice: Tagihan ${currentMode === 'kampus' ? 'UKT' : 'SPP'} ${targetStudent.name} (Rp ${targetStudent.sppAmount.toLocaleString('id-ID')}) berhasil dilunasi via autodebit wondr by BNI`
    );
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 pb-12">
      
      {/* Top B2B Desktop Navigation Header */}
      <div className="bg-[#003B46] text-white py-4 px-6 md:px-8 shadow-md border-b border-[#005E6A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="bg-[#005E6A] p-3 rounded-2xl border border-teal-500/30 shadow-xs">
            <Building2 className="w-7 h-7 text-[#72DFD0]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-extrabold text-lg tracking-tight text-white">
                {currentMode === 'kampus' ? 'BNI Cash Management System - Portal Keuangan Universitas' : 'BNI Cash Management System'}
              </h1>
              <span className="bg-[#72DFD0] text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3" /> Open API
              </span>
            </div>
            <p className="text-xs text-teal-100 font-medium mt-0.5">
              {currentMode === 'kampus'
                ? <>Portal Rektorat & Rekonsiliasi Otomatis SPC H2H • <b>Universitas Airlangga</b> (Giro BNI Rektorat: 0987654321)</>
                : <>Portal Bendahara Sekolah & Rekonsiliasi Otomatis SPP • <b>SMAN 1 Surabaya</b> (Giro BNI: {treasuryMetrics.giroAccountNo})</>
              }
            </p>
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/60 px-3.5 py-2 rounded-xl border border-teal-500/20 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="text-slate-300 font-mono text-xs">Host API: api.bni.co.id/edu-v2</span>
          </div>

          <button
            onClick={() => alert(currentMode === 'kampus' ? 'Laporan UKT & Endapan Giro Kampus UNAIR (Excel/PDF) berhasil diunduh.' : 'Laporan SPP SMAN 1 Surabaya (Excel/PDF) berhasil diunduh.')}
            className="bg-[#005E6A] hover:bg-teal-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border border-teal-400/40 flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#72DFD0]" />
            Export Report (Excel/PDF)
          </button>
        </div>
      </div>

      {/* Main Full-Width Dashboard Content Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 space-y-6">
        
        {/* Top 4 Metrics Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Metric 1: Total SPP / UKT Collected */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold text-xs">
                {currentMode === 'kampus' ? 'Total Penerimaan UKT Semester Ini' : 'Total Penerimaan SPP'}
              </span>
              <div className="bg-[#E6FBF8] text-[#00A396] p-2.5 rounded-2xl">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {currentMode === 'kampus' ? 'Rp 18.450.000.000' : `Rp ${totalCollectedAmount.toLocaleString('id-ID')}`}
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                {currentMode === 'kampus' ? 'Target: Rp 20.000.000.000 (92% Lunas)' : `Target: Rp ${treasuryMetrics.totalTargetAmount.toLocaleString('id-ID')}`}
              </p>
            </div>

            <div className="space-y-1 pt-1">
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00A396] to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${currentMode === 'kampus' ? 92 : collectionPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 font-extrabold">
                <span>Capaian Semester 5</span>
                <span className="text-emerald-600">{currentMode === 'kampus' ? '92% Lunas' : `${collectionPercentage}% Terkumpul`}</span>
              </div>
            </div>
          </div>

          {/* Metric 2: Endapan Giro / Students Paid */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold text-xs">
                {currentMode === 'kampus' ? 'Endapan Giro Operasional Kampus' : 'Siswa Lunas SPP'}
              </span>
              <div className="bg-emerald-100 text-emerald-700 p-2.5 rounded-2xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {currentMode === 'kampus' ? 'Rp 45.200.000.000' : paidStudentsTotal}
              </h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {currentMode === 'kampus' ? 'Special Yield Giro BNI 5.5% p.a.' : 'Terbayar via BNI Autodebit & VA'}
              </p>
            </div>

            <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 font-semibold flex items-center justify-between">
              <span>{currentMode === 'kampus' ? 'Rekening Utama Rektorat' : `Sisa Menunggak: ${totalStudentsCount - paidStudentsTotal} Siswa`}</span>
              <span className="font-extrabold text-emerald-700">Live Sync</span>
            </div>
          </div>

          {/* Metric 3: Beasiswa Disbursed */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold text-xs">
                {currentMode === 'kampus' ? 'Beasiswa Disbursed' : 'Rasio Tunggakan (Bad Debt)'}
              </span>
              <div className="bg-amber-100 text-amber-700 p-2.5 rounded-2xl">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black text-[#003B46] tracking-tight flex items-center gap-2">
                {currentMode === 'kampus' ? '450 Mahasiswa' : treasuryMetrics.badDebtRate}
                <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                  {currentMode === 'kampus' ? 'Auto H+0' : '-50% vs Manual'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {currentMode === 'kampus' ? 'Penyaluran Beasiswa Talent BNI & KIP-K' : 'Dua kali lipat lebih rendah dibanding penagihan manual.'}
              </p>
            </div>

            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-[11px] text-slate-600 font-medium">
              ⚡ Rekonsiliasi Otomatis via BNI Open API
            </div>
          </div>

          {/* Metric 4: Active Autodebit / Kas Ormawa */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold text-xs">
                {currentMode === 'kampus' ? 'Kas Komunitas Ormawa & VA' : 'Pengguna Autodebit Aktif'}
              </span>
              <div className="bg-teal-100 text-teal-800 p-2.5 rounded-2xl">
                <Zap className="w-5 h-5 text-[#00A396]" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black text-[#00897B] tracking-tight">
                {currentMode === 'kampus' ? '128 Komunitas' : treasuryMetrics.autodebitUsersRate}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {currentMode === 'kampus' ? '100% Dual-Approval BNI Open API' : '1.104 orang tua terhubung ke wondr Autodebit'}
              </p>
            </div>

            <div className="bg-[#E6FBF8] p-2 rounded-xl border border-[#72DFD0]/40 text-[11px] text-[#00897B] font-bold">
              {currentMode === 'kampus' ? '✓ Settlement Instan BNI API' : '✓ Tagihan Otomatis Tiap Tgl 10'}
            </div>
          </div>

        </div>

        {/* Main Student SPP / UKT Records Data Table Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          
          {/* Table Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00A396]" />
                {currentMode === 'kampus' ? 'Data Pembayaran UKT Semester Mahasiswa (Juli 2026)' : 'Data Pembayaran SPP Siswa (Juli 2026)'}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {currentMode === 'kampus'
                  ? 'Pencatatan real-time autodebit wondr app & transfer Virtual Account BNI Universitas Airlangga'
                  : 'Pencatatan real-time autodebit wondr app & transfer VA BNI SMAN 1 Surabaya'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={currentMode === 'kampus' ? 'Cari Mahasiswa, NIM, atau Fakultas...' : 'Cari Siswa, NIS, atau Orang Tua...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00A396]"
                />
              </div>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#00A396]"
              >
                <option value="ALL">Semua Fakultas/Prodi</option>
                <option value="Kelas 11 IPA 2">FST / Sistem Informasi</option>
                <option value="Kelas 11 IPS 1">FEB / Manajemen</option>
                <option value="Kelas 11 IPA 1">FK / Kedokteran Gigi</option>
                <option value="Kelas 8 B">FH / Hukum</option>
              </select>
            </div>
          </div>

          {/* Full-Width Table */}
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">{currentMode === 'kampus' ? 'NIM' : 'NIS'}</th>
                  <th className="py-3 px-4">{currentMode === 'kampus' ? 'Nama Mahasiswa' : 'Nama Siswa'}</th>
                  <th className="py-3 px-4">{currentMode === 'kampus' ? 'Prodi / Kelas' : 'Kelas'}</th>
                  <th className="py-3 px-4">{currentMode === 'kampus' ? 'Fakultas / Wali' : 'Nama Orang Tua'}</th>
                  <th className="py-3 px-4">{currentMode === 'kampus' ? 'Nominal UKT' : 'Nominal SPP'}</th>
                  <th className="py-3 px-4">{currentMode === 'kampus' ? 'Status UKT' : 'Status SPP'}</th>
                  <th className="py-3 px-4">Metode & Tanggal</th>
                  <th className="py-3 px-4 text-right">Aksi Portal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* NIM / NIS */}
                    <td className="py-3.5 px-4 font-mono text-slate-500 font-semibold">
                      {currentMode === 'kampus' ? (std.id === 'std-1' ? '18239012' : `182390${std.nis.slice(-2)}`) : std.nis}
                    </td>

                    {/* Student Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={std.avatar} alt={std.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                        <span className="font-bold text-slate-900">{std.name}</span>
                      </div>
                    </td>

                    {/* Prodi / Class */}
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-200">
                        {currentMode === 'kampus'
                          ? (std.className.includes('IPA 2') ? 'Sistem Informasi' : std.className.includes('IPS') ? 'Manajemen' : 'Kedokteran Gigi')
                          : std.className}
                      </span>
                    </td>

                    {/* Fakultas / Parent Name */}
                    <td className="py-3.5 px-4">
                      <span className="text-slate-800 font-semibold block">
                        {currentMode === 'kampus' ? (std.className.includes('IPA 2') ? 'Fakultas Sains & Teknologi' : 'Fakultas Ekonomi & Bisnis') : std.parentName}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{std.parentPhone}</span>
                    </td>

                    {/* UKT / SPP Amount */}
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      Rp {currentMode === 'kampus' ? (std.id === 'std-1' ? (6500000).toLocaleString('id-ID') : (7500000).toLocaleString('id-ID')) : std.sppAmount.toLocaleString('id-ID')}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {std.status === 'LUNAS' ? (
                        <span className="bg-emerald-500 text-white font-extrabold text-[11px] px-3 py-1 rounded-full inline-flex items-center gap-1 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {currentMode === 'kampus' ? 'LUNAS via SPC H2H' : 'LUNAS'}
                        </span>
                      ) : (
                        <span className="bg-amber-500 text-slate-950 font-extrabold text-[11px] px-3 py-1 rounded-full inline-flex items-center gap-1 shadow-2xs">
                          <AlertTriangle className="w-3.5 h-3.5" /> MENUNGGAK ({std.overdueDays} Hari)
                        </span>
                      )}
                    </td>

                    {/* Payment Method & Date */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700 block">
                        {currentMode === 'kampus' ? (std.status === 'LUNAS' ? 'wondr Autodebit BNI' : '-') : std.paymentMethod}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{std.paidAt}</span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      {currentMode === 'kampus' ? (
                        std.status === 'LUNAS' ? (
                          <button
                            onClick={() => onTriggerNotification(`🎓 BNI API Notice: Beasiswa BNI Rp 2.500.000 berhasil disalurkan ke rekening ${std.name}`)}
                            className="bg-[#00897B] hover:bg-teal-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 shadow-xs transition-all active:scale-95"
                          >
                            <Zap className="w-3.5 h-3.5 text-[#72DFD0]" /> Disburse Beasiswa
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenReminderModal(std)}
                            className="bg-[#003B46] hover:bg-[#005E6A] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                          >
                            <Send className="w-3.5 h-3.5 text-[#72DFD0]" /> Remind UKT
                          </button>
                        )
                      ) : (
                        std.status === 'MENUNGGAK' ? (
                          <button
                            onClick={() => handleOpenReminderModal(std)}
                            className="bg-[#003B46] hover:bg-[#005E6A] text-white px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                          >
                            <Send className="w-3.5 h-3.5 text-[#72DFD0]" /> Kirim Remind SPP
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 inline-flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Terverifikasi API
                          </span>
                        )
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Wholesale BNI Middleware Banner */}
        <div className="bg-gradient-to-r from-[#003B46] via-[#005E6A] to-[#003B46] p-5 rounded-3xl text-white shadow-md border border-teal-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#72DFD0] text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-md">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">BNI Open API Middleware Integration</h4>
              <p className="text-xs text-teal-100 font-medium leading-snug">
                ⚡ Endapan Dana Operasional Yayasan di-hold secara otomatis pada Rekening Giro BNI SMAN 1 Surabaya.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="bg-white/10 text-teal-100 font-mono text-xs px-4 py-1.5 rounded-xl border border-white/10">
              Giro BNI •••• 3019 Verified
            </span>
          </div>
        </div>

      </div>

      {/* CONFIRMATION & SIMULATION MODAL */}
      {reminderModal.show && reminderModal.student && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[440px] rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-100 text-left animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="bg-[#003B46] text-[#72DFD0] p-2 rounded-xl">
                  <Send className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Automated SPP Invoicing</h3>
              </div>
              <button
                onClick={() => setReminderModal({ show: false, student: null })}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#E6FBF8] p-4 rounded-2xl border border-[#72DFD0]/40 space-y-1">
                <div className="flex items-center gap-2 text-[#00897B] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Notifikasi & Autodebit Invoice Terkirim!</span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed pt-1">
                  Tagihan SPP sebesar <b>Rp {reminderModal.student.sppAmount.toLocaleString('id-ID')}</b> telah dikirimkan secara langsung ke aplikasi wondr Orang Tua (<b>{reminderModal.student.parentName}</b> / {reminderModal.student.parentPhone}).
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5 font-mono text-xs">
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
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-2">Simulasi Pengujian Live Bendahara:</p>
                <button
                  onClick={() => handleSimulatePayment(reminderModal.student.id)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00A396] to-emerald-600 text-white font-extrabold text-xs hover:from-[#00897B] hover:to-emerald-700 shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
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
