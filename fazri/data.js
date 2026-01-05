// Data penjualan untuk dashboard
const salesData = {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    monthlySales: [320, 380, 410, 390, 450, 520, 580, 610, 590, 650, 720, 800],
    
    categories: [
        { 
            name: 'Elektronik', 
            revenue: 2025000, 
            growth: 15.2, 
            marketShare: 42, 
            rating: 4.5, 
            icon: 'tv',
            description: 'Produk elektronik termasuk smartphone, laptop, dan perangkat rumah pintar'
        },
        { 
            name: 'Pakaian', 
            revenue: 920000, 
            growth: 8.7, 
            marketShare: 21, 
            rating: 4.2, 
            icon: 'tshirt',
            description: 'Pakaian pria, wanita, dan anak-anak dengan berbagai merek'
        },
        { 
            name: 'Makanan & Minuman', 
            revenue: 780000, 
            growth: 12.5, 
            marketShare: 18, 
            rating: 4.8, 
            icon: 'utensils',
            description: 'Makanan kemasan, minuman, dan produk kebutuhan sehari-hari'
        },
        { 
            name: 'Buku & Alat Tulis', 
            revenue: 420000, 
            growth: 5.3, 
            marketShare: 9, 
            rating: 4.0, 
            icon: 'book',
            description: 'Buku edukasi, novel, dan alat tulis kantor'
        },
        { 
            name: 'Olahraga & Outdoor', 
            revenue: 310000, 
            growth: 18.9, 
            marketShare: 7, 
            rating: 4.3, 
            icon: 'basketball-ball',
            description: 'Perlengkapan olahraga, sepeda, dan alat camping'
        },
        { 
            name: 'Kesehatan & Kecantikan', 
            revenue: 280000, 
            growth: 9.8, 
            marketShare: 6, 
            rating: 4.6, 
            icon: 'heart',
            description: 'Produk perawatan tubuh, kosmetik, dan suplemen kesehatan'
        },
        { 
            name: 'Mainan & Hobi', 
            revenue: 190000, 
            growth: 6.4, 
            marketShare: 4, 
            rating: 4.1, 
            icon: 'gamepad',
            description: 'Mainan anak, board game, dan perlengkapan hobi'
        },
        { 
            name: 'Otomotif', 
            revenue: 150000, 
            growth: 11.2, 
            marketShare: 3, 
            rating: 4.4, 
            icon: 'car',
            description: 'Suku cadang kendaraan, aksesoris, dan perawatan otomotif'
        }
    ],
    
    topProducts: [
        { name: 'Smartphone X10', category: 'Elektronik', sales: 12500, revenue: 625000000, rating: 4.7 },
        { name: 'Laptop ProBook', category: 'Elektronik', sales: 8200, revenue: 492000000, rating: 4.5 },
        { name: 'Jaket Winter Premium', category: 'Pakaian', sales: 15300, revenue: 229500000, rating: 4.3 },
        { name: 'Vitamin C Boost', category: 'Kesehatan & Kecantikan', sales: 28700, revenue: 143500000, rating: 4.8 },
        { name: 'Buku Pemrograman JS', category: 'Buku & Alat Tulis', sales: 11200, revenue: 89600000, rating: 4.6 }
    ]
};

// Data KPI
const kpiData = {
    totalRevenue: 4820000000,
    totalOrders: 3248,
    newCustomers: 542,
    growthRate: 18.3,
    targetRevenue: 4500000000,
    targetGrowth: 16.2
};