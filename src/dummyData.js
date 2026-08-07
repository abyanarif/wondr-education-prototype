export const initialStudentsData = {
  akbar: {
    id: 'akbar',
    name: 'Akbar Putra',
    school: 'SMA 1 Surabaya',
    grade: 'Kelas 11 IPA 2',
    nis: '2024.11.0492',
    cardNo: 'BNI Junior •••• 4892',
    avatar: 'https://i.pravatar.cc/150?img=12',
    sppStatus: 'LUNAS',
    sppPeriod: 'Juli 2026',
    sppAmount: 'Rp 1.500.000',
    sppDueDate: '10 Agustus 2026',
    autoDebit: true,
    autoDebitDate: 'Tanggal 10 setiap bulan',
    spentToday: 12000,
    dailyLimit: 20000,
    emergencyAutoApprove: true,
    parentApprovalMode: 'flexi',
    canteenHistory: [
      { id: 101, title: 'Soto Ayam Kantin Utama', time: '10:15 WIB', price: 12000, status: 'Berhasil' }
    ]
  },
  aisha: {
    id: 'aisha',
    name: 'Aisha Putri',
    school: 'SMA 1 Surabaya',
    grade: 'Kelas 10 IPA 1',
    nis: '2025.08.0128',
    cardNo: 'BNI Junior •••• 7120',
    avatar: 'https://i.pravatar.cc/150?img=49',
    sppStatus: 'LUNAS',
    sppPeriod: 'Juli 2026',
    sppAmount: 'Rp 1.200.000',
    sppDueDate: '10 Agustus 2026',
    autoDebit: true,
    autoDebitDate: 'Tanggal 10 setiap bulan',
    spentToday: 8000,
    dailyLimit: 15000,
    emergencyAutoApprove: true,
    parentApprovalMode: 'flexi',
    canteenHistory: [
      { id: 201, title: 'Roti & Susu Kantin SMP', time: '09:45 WIB', price: 8000, status: 'Berhasil' }
    ]
  }
};

export const canteenMenuItems = [
  {
    id: 'item-1',
    name: 'Nasi Goreng Sehat',
    price: 12000,
    icon: 'Utensils',
    badge: 'Favorite'
  },
  {
    id: 'item-2',
    name: 'Es Teh Manis',
    price: 5000,
    icon: 'Coffee',
    badge: 'Segar'
  },
  {
    id: 'item-3',
    name: 'Soto Ayam Spesial',
    price: 15000,
    icon: 'Soup',
    badge: 'Populer'
  },
  {
    id: 'item-4',
    name: 'Roti Bakar Keju',
    price: 8000,
    icon: 'Sandwich',
    badge: 'Cemilan'
  },
  {
    id: 'item-5',
    name: 'Jus Buah Segar',
    price: 10000,
    icon: 'Coffee',
    badge: 'Sehat'
  },
  {
    id: 'item-6',
    name: 'Snack Buah Potong',
    price: 6000,
    icon: 'Utensils',
    badge: 'Vitamin'
  }
];

export const merchantInfo = {
  name: 'Kantin Sehat - SMAN 1 Surabaya',
  code: 'MERCHANT-BNI-SUB01',
  cashier: 'Mbak Sri (Kasir 01)',
  qrisId: 'ID1020304050607',
  location: 'Kantin SMA 1 Surabaya, Blok A'
};

// Initial B2B School Treasury Data for Screen 4
export const initialTreasuryStudents = [
  {
    id: 'std-1',
    nis: '2024.11.0492',
    name: 'Akbar Putra',
    className: 'Kelas 11 IPA 2',
    parentName: 'Ibu Karnisa',
    sppAmount: 1200000,
    status: 'LUNAS',
    paymentMethod: 'Autodebit wondr',
    paidAt: '10 Juli 2026',
    parentPhone: '0812-3456-7890',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 'std-2',
    nis: '2024.11.0118',
    name: 'Budi Santoso',
    className: 'Kelas 11 IPA 2',
    parentName: 'Bambang Santoso',
    sppAmount: 1200000,
    status: 'MENUNGGAK',
    overdueDays: 3,
    paymentMethod: '-',
    paidAt: '-',
    parentPhone: '0813-9876-5432',
    avatar: 'https://i.pravatar.cc/150?img=33'
  },
  {
    id: 'std-3',
    nis: '2024.11.0204',
    name: 'Citra Lestari',
    className: 'Kelas 11 IPA 2',
    parentName: 'Dewi Lestari',
    sppAmount: 1200000,
    status: 'LUNAS',
    paymentMethod: 'Manual Transfer BNI',
    paidAt: '08 Juli 2026',
    parentPhone: '0811-2233-4455',
    avatar: 'https://i.pravatar.cc/150?img=47'
  },
  {
    id: 'std-4',
    nis: '2024.11.0312',
    name: 'Deni Pratama',
    className: 'Kelas 11 IPS 1',
    parentName: 'Hendra Pratama',
    sppAmount: 1200000,
    status: 'MENUNGGAK',
    overdueDays: 5,
    paymentMethod: '-',
    paidAt: '-',
    parentPhone: '0815-6677-8899',
    avatar: 'https://i.pravatar.cc/150?img=60'
  },
  {
    id: 'std-5',
    nis: '2025.08.0128',
    name: 'Aisha Putri',
    className: 'Kelas 10 IPA 1',
    parentName: 'Ibu Karnisa',
    sppAmount: 1200000,
    status: 'LUNAS',
    paymentMethod: 'Autodebit wondr',
    paidAt: '10 Juli 2026',
    parentPhone: '0812-3456-7890',
    avatar: 'https://i.pravatar.cc/150?img=49'
  },
  {
    id: 'std-6',
    nis: '2024.11.0501',
    name: 'Eka Wijaya',
    className: 'Kelas 11 IPA 1',
    parentName: 'Surya Wijaya',
    sppAmount: 1200000,
    status: 'LUNAS',
    paymentMethod: 'Autodebit wondr',
    paidAt: '09 Juli 2026',
    parentPhone: '0817-1122-3344',
    avatar: 'https://i.pravatar.cc/150?img=68'
  }
];

export const treasuryMetrics = {
  totalTargetAmount: 1440000000,
  initialCollectedAmount: 1324800000,
  totalStudents: 1200,
  initialPaidStudents: 1104,
  badDebtRate: '8%',
  autodebitUsersRate: '92%',
  giroAccountNo: '992019283019',
  giroAccountName: 'Giro SMAN 1 Surabaya Operational'
};
