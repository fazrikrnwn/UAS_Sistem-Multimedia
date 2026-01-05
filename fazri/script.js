// Inisialisasi dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard SalesVision Pro diinisialisasi');
    
    // Setup semua event listeners
    setupEventListeners();
    
    // Buat semua chart
    createCharts();
    
    // Isi data tabel dan ranking
    populateTable();
    populateRanking();
    
    // Setup filter interaktif
    setupFilters();
    
    // Inisialisasi modal
    setupModals();
    
    // Update summary
    updateSummary();
    
    // Tampilkan notifikasi selamat datang
    setTimeout(() => {
        showNotification('Dashboard Multimedia berhasil dimuat! Selamat menggunakan.', 'success');
    }, 1000);
});

// Setup event listeners
function setupEventListeners() {
    // Toggle tema gelap/terang
    document.getElementById('themeBtn').addEventListener('click', toggleTheme);
    
    // Filter tanggal
    document.getElementById('dateRange').addEventListener('change', updateChartsByDateRange);
    
    // Refresh data
    document.getElementById('refreshBtn').addEventListener('click', refreshData);
    
    // Kontrol chart
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const chartType = this.getAttribute('data-chart');
            const chartTarget = this.getAttribute('data-target');
            
            // Update active button
            const chartContainer = this.closest('.chart-container');
            chartContainer.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart berdasarkan tipe
            switch(chartTarget) {
                case 'sales':
                    updateSalesChart(chartType);
                    break;
                case 'distribution':
                    updateDistributionChart(chartType);
                    break;
                case 'performance':
                    updatePerformanceChart(chartType);
                    break;
                case 'quarterly':
                    updateQuarterlyChart(chartType);
                    break;
                case 'radar':
                    updateRadarChart(chartType);
                    break;
            }
        });
    });
    
    // Aksi dashboard
    document.getElementById('exportBtn').addEventListener('click', exportDashboard);
    document.getElementById('printBtn').addEventListener('click', printDashboard);
    document.getElementById('shareBtn').addEventListener('click', shareDashboard);
    document.getElementById('helpBtn').addEventListener('click', openHelpModal);
    
    // Filter produk
    document.getElementById('applyFilter').addEventListener('click', applyProductFilter);
    document.getElementById('resetFilter').addEventListener('click', resetProductFilter);
    
    // Rating stars interaktif
    document.querySelectorAll('#ratingFilter i').forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            setRatingFilter(value);
        });
    });
    
    // Range slider
    const growthFilter = document.getElementById('growthFilter');
    const growthValue = document.getElementById('growthValue');
    
    growthFilter.addEventListener('input', function() {
        growthValue.textContent = this.value + '%';
    });
    
    // Search produk
    document.getElementById('productSearch').addEventListener('input', searchProducts);
    
    // Sorting tabel
    document.getElementById('sortProducts').addEventListener('click', toggleSortProducts);
    
    // Sorting header tabel
    document.querySelectorAll('#productTable th').forEach((th, index) => {
        if (index < 5) { // Hanya kolom data, bukan aksi
            th.addEventListener('click', () => sortTableByColumn(index));
        }
    });
}

// Setup modal
function setupModals() {
    // Modal bantuan
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Tutup modal dengan klik di luar
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Tombol tutup di footer modal
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            closeModal(document.getElementById('helpModal'));
        });
    }
}

// Setup filter
function setupFilters() {
    // Multi-select filter
    const categoryFilter = document.getElementById('categoryFilter');
    
    categoryFilter.addEventListener('change', function() {
        const options = Array.from(this.selectedOptions);
        const hasAll = options.some(opt => opt.value === 'all');
        
        if (hasAll && options.length > 1) {
            // Jika "Semua" dipilih bersama opsi lain, hapus "Semua"
            const allOption = this.querySelector('option[value="all"]');
            allOption.selected = false;
        } else if (!hasAll && options.length === 0) {
            // Jika tidak ada yang dipilih, pilih "Semua"
            this.querySelector('option[value="all"]').selected = true;
        }
    });
}

// Toggle tema gelap/terang
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const themeBtn = document.getElementById('themeBtn');
    
    if (document.body.classList.contains('dark-theme')) {
        themeBtn.innerHTML = '<i class="fas fa-sun"></i> Mode Terang';
        themeBtn.title = "Ubah ke mode terang";
        localStorage.setItem('dashboard-theme', 'dark');
    } else {
        themeBtn.innerHTML = '<i class="fas fa-moon"></i> Mode Gelap';
        themeBtn.title = "Ubah ke mode gelap";
        localStorage.setItem('dashboard-theme', 'light');
    }
    
    // Update chart untuk tema baru
    updateChartThemes();
}

// Update chart berdasarkan rentang tanggal
function updateChartsByDateRange() {
    const range = document.getElementById('dateRange').value;
    const rangeText = getRangeText(range);
    
    showNotification(`Data ditampilkan untuk ${rangeText}`, 'success');
    
    // Simulasi update data berdasarkan range
    let filteredData;
    switch(range) {
        case 'monthly':
            filteredData = salesData.monthlySales.slice(-1);
            break;
        case 'quarterly':
            filteredData = salesData.monthlySales.slice(-3);
            break;
        case 'yearly':
        default:
            filteredData = salesData.monthlySales;
    }
    
    // Update chart dengan data yang difilter
    updateSalesChartData(filteredData);
    updateQuarterlyChart();
    updateSummary();
}

function getRangeText(range) {
    switch(range) {
        case 'monthly': return 'Bulan Terakhir';
        case 'quarterly': return '3 Bulan Terakhir';
        case 'yearly': return '12 Bulan Terakhir';
        default: return 'Rentang Waktu';
    }
}

// Refresh data (simulasi)
function refreshData() {
    showNotification('Memperbarui data...', 'warning');
    
    // Tampilkan loading spinner
    showLoading(true);
    
    // Simulasi pengambilan data dari server
    setTimeout(() => {
        // Generate data acak untuk simulasi
        generateRandomData();
        
        // Update semua chart dan tampilan
        updateAllCharts();
        populateTable();
        populateRanking();
        
        // Update KPI
        updateKPI();
        
        // Update summary
        updateSummary();
        
        showLoading(false);
        showNotification('Data berhasil diperbarui!', 'success');
    }, 1500);
}

// Generate data acak untuk simulasi
function generateRandomData() {
    // Update data penjualan bulanan dengan variasi acak
    salesData.monthlySales = salesData.monthlySales.map(value => {
        const variation = Math.random() * 0.2 - 0.1; // -10% to +10%
        return Math.round(value * (1 + variation));
    });
    
    // Update data kategori dengan variasi acak
    salesData.categories = salesData.categories.map(category => {
        const growthVariation = Math.random() * 6 - 3; // -3% to +3%
        const revenueVariation = Math.random() * 0.15 - 0.075; // -7.5% to +7.5%
        
        return {
            ...category,
            growth: Math.max(0, parseFloat(category.growth) + growthVariation).toFixed(1),
            revenue: Math.round(category.revenue * (1 + revenueVariation))
        };
    });
    
    // Update data KPI dengan variasi acak
    kpiData.totalRevenue = Math.round(kpiData.totalRevenue * (1 + Math.random() * 0.1 - 0.05));
    kpiData.totalOrders = Math.round(kpiData.totalOrders * (1 + Math.random() * 0.08 - 0.04));
    kpiData.newCustomers = Math.round(kpiData.newCustomers * (1 + Math.random() * 0.06 - 0.03));
    kpiData.growthRate = Math.max(0, parseFloat(kpiData.growthRate) + Math.random() * 4 - 2).toFixed(1);
}

// Update KPI cards
function updateKPI() {
    // Format angka
    const formatCurrency = (value) => {
        if (value >= 1000000000) {
            return 'Rp ' + (value / 1000000000).toFixed(2) + ' M';
        } else if (value >= 1000000) {
            return 'Rp ' + (value / 1000000).toFixed(1) + ' jt';
        } else {
            return 'Rp ' + value.toLocaleString('id-ID');
        }
    };
    
    // Update nilai KPI
    document.querySelectorAll('.kpi-value')[0].textContent = formatCurrency(kpiData.totalRevenue);
    document.querySelectorAll('.kpi-value')[1].textContent = kpiData.totalOrders.toLocaleString('id-ID');
    document.querySelectorAll('.kpi-value')[2].textContent = kpiData.newCustomers.toLocaleString('id-ID');
    document.querySelectorAll('.kpi-value')[3].textContent = kpiData.growthRate + '%';
}

// Update summary tabel
function updateSummary() {
    const totalCategories = salesData.categories.length;
    const totalRevenue = salesData.categories.reduce((sum, cat) => sum + cat.revenue, 0);
    const avgGrowth = salesData.categories.reduce((sum, cat) => sum + parseFloat(cat.growth), 0) / totalCategories;
    
    document.getElementById('totalCategories').textContent = totalCategories;
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('avgGrowth').textContent = avgGrowth.toFixed(1) + '%';
}

// Format currency helper
function formatCurrency(value) {
    if (value >= 1000000000) {
        return 'Rp ' + (value / 1000000000).toFixed(2) + ' M';
    } else if (value >= 1000000) {
        return 'Rp ' + (value / 1000000).toFixed(1) + ' jt';
    } else {
        return 'Rp ' + value.toLocaleString('id-ID');
    }
}

// Buat semua chart
let salesChartInstance, distributionChartInstance, performanceChartInstance;
let quarterlyChartInstance, radarChartInstance;

function createCharts() {
    createSalesChart();
    createDistributionChart();
    createPerformanceChart();
    createQuarterlyChart();
    createRadarChart();
}

function createSalesChart() {
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    
    salesChartInstance = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: salesData.months,
            datasets: [{
                label: 'Penjualan (dalam juta Rp)',
                data: salesData.monthlySales,
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4361ee',
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            }]
        },
        options: getChartOptions('Penjualan Bulanan (dalam juta Rp)', 'sales')
    });
}

function createDistributionChart() {
    const distributionCtx = document.getElementById('distributionChart').getContext('2d');
    
    distributionChartInstance = new Chart(distributionCtx, {
        type: 'pie',
        data: {
            labels: salesData.categories.map(c => c.name),
            datasets: [{
                data: salesData.categories.map(c => c.revenue / 1000000),
                backgroundColor: [
                    '#4361ee', '#3a0ca3', '#4cc9f0', '#7209b7', '#f72585',
                    '#4ade80', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'
                ],
                borderColor: getComputedStyle(document.body).getPropertyValue('--card-bg'),
                borderWidth: 2,
                hoverOffset: 15
            }]
        },
        options: getChartOptions('Distribusi Pendapatan (dalam juta Rp)', 'distribution')
    });
}

function createPerformanceChart() {
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    
    // Sort categories by revenue for better visualization
    const sortedCategories = [...salesData.categories].sort((a, b) => b.revenue - a.revenue);
    
    performanceChartInstance = new Chart(performanceCtx, {
        type: 'bar',
        data: {
            labels: sortedCategories.map(c => c.name),
            datasets: [
                {
                    label: 'Pendapatan (juta Rp)',
                    data: sortedCategories.map(c => c.revenue / 1000000),
                    backgroundColor: 'rgba(67, 97, 238, 0.7)',
                    borderColor: '#4361ee',
                    borderWidth: 1
                },
                {
                    label: 'Pertumbuhan (%)',
                    data: sortedCategories.map(c => parseFloat(c.growth)),
                    backgroundColor: 'rgba(76, 201, 240, 0.7)',
                    borderColor: '#4cc9f0',
                    borderWidth: 1,
                    type: 'line',
                    yAxisID: 'y1'
                }
            ]
        },
        options: getChartOptions('Performa Produk', 'performance')
    });
}

function createQuarterlyChart() {
    const quarterlyCtx = document.getElementById('quarterlyChart').getContext('2d');
    
    // Data kuartalan untuk 4 kategori teratas
    const topCategories = [...salesData.categories]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 4);
    
    const quarterlyData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: topCategories.map((category, index) => ({
            label: category.name,
            data: Array(4).fill().map(() => 
                Math.round((category.revenue / 4) * (0.8 + Math.random() * 0.4) / 1000000)
            ),
            backgroundColor: getCategoryColor(index, 0.5),
            borderColor: getCategoryColor(index, 1),
            borderWidth: 2,
            fill: true,
            tension: 0.3
        }))
    };
    
    quarterlyChartInstance = new Chart(quarterlyCtx, {
        type: 'line',
        data: quarterlyData,
        options: getChartOptions('Penjualan per Kuartal (juta Rp)', 'quarterly')
    });
}

function createRadarChart() {
    const radarCtx = document.getElementById('radarChart').getContext('2d');
    
    // Data untuk radar chart (5 kategori teratas)
    const topCategories = [...salesData.categories]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
    
    const radarData = {
        labels: ['Pendapatan', 'Pertumbuhan', 'Market Share', 'Rating', 'Volume'],
        datasets: topCategories.map((category, index) => ({
            label: category.name,
            data: [
                category.revenue / 1000000, // Scale down
                parseFloat(category.growth) * 5, // Scale up for visibility
                category.marketShare,
                category.rating * 20, // Scale 1-5 to 20-100
                70 + Math.random() * 30 // Simulated volume
            ],
            backgroundColor: getCategoryColor(index, 0.2),
            borderColor: getCategoryColor(index, 1),
            borderWidth: 2,
            pointBackgroundColor: getCategoryColor(index, 1),
            pointRadius: 4
        }))
    };
    
    radarChartInstance = new Chart(radarCtx, {
        type: 'radar',
        data: radarData,
        options: getChartOptions('Analisis Multidimensional', 'radar')
    });
}

function getCategoryColor(index, opacity = 1) {
    const colors = [
        `rgba(67, 97, 238, ${opacity})`,    // Blue
        `rgba(76, 201, 240, ${opacity})`,   // Light Blue
        `rgba(74, 222, 128, ${opacity})`,   // Green
        `rgba(245, 158, 11, ${opacity})`,   // Yellow
        `rgba(239, 68, 68, ${opacity})`,    // Red
        `rgba(139, 92, 246, ${opacity})`,   // Purple
        `rgba(14, 165, 233, ${opacity})`,   // Cyan
        `rgba(247, 37, 133, ${opacity})`    // Pink
    ];
    return colors[index % colors.length];
}

function getChartOptions(title, type) {
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-color');
    const borderColor = getComputedStyle(document.body).getPropertyValue('--border-color');
    const bgColor = getComputedStyle(document.body).getPropertyValue('--card-bg');
    
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: textColor,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: bgColor,
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: borderColor,
                borderWidth: 1
            }
        }
    };
    
    switch(type) {
        case 'sales':
            return {
                ...commonOptions,
                scales: {
                    x: {
                        grid: {
                            color: borderColor
                        },
                        ticks: {
                            color: textColor
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: borderColor
                        },
                        ticks: {
                            color: textColor,
                            callback: function(value) {
                                return 'Rp ' + value.toLocaleString('id-ID') + ' jt';
                            }
                        }
                    }
                }
            };
            
        case 'distribution':
            return {
                ...commonOptions,
                plugins: {
                    ...commonOptions.plugins,
                    tooltip: {
                        ...commonOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                label += 'Rp ' + value.toLocaleString('id-ID') + ' jt (' + percentage + '%)';
                                return label;
                            }
                        }
                    }
                }
            };
            
        case 'performance':
            return {
                ...commonOptions,
                scales: {
                    x: {
                        grid: {
                            color: borderColor
                        },
                        ticks: {
                            color: textColor
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: borderColor
                        },
                        ticks: {
                            color: textColor,
                            callback: function(value) {
                                return 'Rp ' + value.toLocaleString('id-ID') + ' jt';
                            }
                        }
                    },
                    y1: {
                        position: 'right',
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            color: textColor,
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            };
            
        case 'quarterly':
            return {
                ...commonOptions,
                scales: {
                    x: {
                        grid: {
                            color: borderColor
                        },
                        ticks: {
                            color: textColor
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: borderColor
                        },
                        ticks: {
                            color: textColor,
                            callback: function(value) {
                                return 'Rp ' + value.toLocaleString('id-ID') + ' jt';
                            }
                        }
                    }
                }
            };
            
        case 'radar':
            return {
                ...commonOptions,
                scales: {
                    r: {
                        angleLines: {
                            color: borderColor
                        },
                        grid: {
                            color: borderColor
                        },
                        pointLabels: {
                            color: textColor
                        },
                        ticks: {
                            color: textColor,
                            backdropColor: 'transparent'
                        }
                    }
                }
            };
            
        default:
            return commonOptions;
    }
}

// Update chart functions
function updateSalesChart(type = 'line') {
    if (!salesChartInstance) return;
    
    salesChartInstance.config.type = type;
    
    // Sesuaikan pengaturan berdasarkan tipe chart
    if (type === 'area') {
        salesChartInstance.data.datasets[0].fill = true;
        salesChartInstance.data.datasets[0].tension = 0.4;
    } else if (type === 'bar') {
        salesChartInstance.data.datasets[0].fill = false;
        salesChartInstance.data.datasets[0].tension = 0;
    } else if (type === 'radar') {
        salesChartInstance.data.datasets[0].fill = true;
        salesChartInstance.data.datasets[0].tension = 0.1;
    } else {
        salesChartInstance.data.datasets[0].fill = true;
        salesChartInstance.data.datasets[0].tension = 0.4;
    }
    
    salesChartInstance.update();
}

function updateSalesChartData(data) {
    if (!salesChartInstance) return;
    
    salesChartInstance.data.datasets[0].data = data;
    salesChartInstance.update();
}

function updateDistributionChart(type = 'pie') {
    if (!distributionChartInstance) return;
    
    distributionChartInstance.config.type = type;
    
    // Handle polar area khusus
    if (type === 'polarArea') {
        // Polar area membutuhkan konfigurasi khusus
        distributionChartInstance.options.scales = {
            r: {
                ticks: {
                    display: false
                }
            }
        };
    }
    
    distributionChartInstance.update();
}

function updatePerformanceChart(type = 'bar') {
    if (!performanceChartInstance) return;
    
    if (type === 'horizontalBar') {
        performanceChartInstance.config.type = 'bar';
        performanceChartInstance.options.indexAxis = 'y';
        performanceChartInstance.options.scales.x.stacked = false;
        performanceChartInstance.options.scales.y.stacked = false;
    } else if (type === 'stackedBar') {
        performanceChartInstance.config.type = 'bar';
        performanceChartInstance.options.indexAxis = 'x';
        performanceChartInstance.options.scales.x.stacked = true;
        performanceChartInstance.options.scales.y.stacked = true;
        
        // Ubah dataset untuk stacked bar
        performanceChartInstance.data.datasets = [
            {
                label: 'Pendapatan (juta Rp)',
                data: salesData.categories.map(c => c.revenue / 1000000),
                backgroundColor: 'rgba(67, 97, 238, 0.7)',
                borderColor: '#4361ee',
                borderWidth: 1
            },
            {
                label: 'Margin',
                data: salesData.categories.map(c => (c.revenue * 0.25) / 1000000),
                backgroundColor: 'rgba(76, 201, 240, 0.7)',
                borderColor: '#4cc9f0',
                borderWidth: 1
            }
        ];
    } else {
        performanceChartInstance.config.type = 'bar';
        performanceChartInstance.options.indexAxis = 'x';
        performanceChartInstance.options.scales.x.stacked = false;
        performanceChartInstance.options.scales.y.stacked = false;
        
        // Kembalikan dataset asli
        performanceChartInstance.data.datasets = [
            {
                label: 'Pendapatan (juta Rp)',
                data: salesData.categories.map(c => c.revenue / 1000000),
                backgroundColor: 'rgba(67, 97, 238, 0.7)',
                borderColor: '#4361ee',
                borderWidth: 1
            },
            {
                label: 'Pertumbuhan (%)',
                data: salesData.categories.map(c => parseFloat(c.growth)),
                backgroundColor: 'rgba(76, 201, 240, 0.7)',
                borderColor: '#4cc9f0',
                borderWidth: 1,
                type: 'line',
                yAxisID: 'y1'
            }
        ];
    }
    
    performanceChartInstance.update();
}

function updateQuarterlyChart(type = 'line') {
    if (!quarterlyChartInstance) return;
    
    quarterlyChartInstance.config.type = type === 'stackedArea' ? 'line' : type;
    
    if (type === 'stackedArea') {
        quarterlyChartInstance.options.scales.y.stacked = true;
        quarterlyChartInstance.data.datasets.forEach(dataset => {
            dataset.fill = true;
            dataset.tension = 0.3;
        });
    } else if (type === 'area') {
        quarterlyChartInstance.options.scales.y.stacked = false;
        quarterlyChartInstance.data.datasets.forEach(dataset => {
            dataset.fill = true;
            dataset.tension = 0.3;
        });
    } else {
        quarterlyChartInstance.options.scales.y.stacked = false;
        quarterlyChartInstance.data.datasets.forEach(dataset => {
            dataset.fill = false;
            dataset.tension = 0.3;
        });
    }
    
    quarterlyChartInstance.update();
}

function updateRadarChart(type = 'radar') {
    if (!radarChartInstance) return;
    
    radarChartInstance.config.type = type;
    
    if (type === 'polarArea') {
        // Untuk polar area, kita perlu mengubah data structure sedikit
        const topCategory = [...salesData.categories]
            .sort((a, b) => b.revenue - a.revenue)[0];
        
        radarChartInstance.data = {
            labels: ['Pendapatan', 'Pertumbuhan', 'Market Share', 'Rating', 'Volume'],
            datasets: [{
                label: topCategory.name,
                data: [
                    topCategory.revenue / 1000000,
                    parseFloat(topCategory.growth) * 5,
                    topCategory.marketShare,
                    topCategory.rating * 20,
                    80
                ],
                backgroundColor: getCategoryColor(0, 0.2),
                borderColor: getCategoryColor(0, 1),
                borderWidth: 2
            }]
        };
    } else if (type === 'bubble') {
        // Untuk bubble chart, kita perlu data yang berbeda
        radarChartInstance.config.type = 'bubble';
        radarChartInstance.data = {
            datasets: salesData.categories.slice(0, 5).map((category, index) => ({
                label: category.name,
                data: [{
                    x: category.revenue / 1000000,
                    y: parseFloat(category.growth),
                    r: category.marketShare * 2
                }],
                backgroundColor: getCategoryColor(index, 0.5),
                borderColor: getCategoryColor(index, 1),
                borderWidth: 1
            }))
        };
        radarChartInstance.options.scales = {
            x: {
                title: {
                    display: true,
                    text: 'Pendapatan (juta Rp)',
                    color: getComputedStyle(document.body).getPropertyValue('--text-color')
                },
                grid: {
                    color: getComputedStyle(document.body).getPropertyValue('--border-color')
                },
                ticks: {
                    color: getComputedStyle(document.body).getPropertyValue('--text-color')
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Pertumbuhan (%)',
                    color: getComputedStyle(document.body).getPropertyValue('--text-color')
                },
                grid: {
                    color: getComputedStyle(document.body).getPropertyValue('--border-color')
                },
                ticks: {
                    color: getComputedStyle(document.body).getPropertyValue('--text-color')
                }
            }
        };
    } else {
        // Kembalikan ke radar chart
        radarChartInstance.config.type = 'radar';
        const topCategories = [...salesData.categories]
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
        
        radarChartInstance.data = {
            labels: ['Pendapatan', 'Pertumbuhan', 'Market Share', 'Rating', 'Volume'],
            datasets: topCategories.map((category, index) => ({
                label: category.name,
                data: [
                    category.revenue / 1000000,
                    parseFloat(category.growth) * 5,
                    category.marketShare,
                    category.rating * 20,
                    70 + Math.random() * 30
                ],
                backgroundColor: getCategoryColor(index, 0.2),
                borderColor: getCategoryColor(index, 1),
                borderWidth: 2,
                pointBackgroundColor: getCategoryColor(index, 1),
                pointRadius: 4
            }))
        };
        radarChartInstance.options.scales = {
            r: {
                angleLines: {
                    color: getComputedStyle(document.body).getPropertyValue('--border-color')
                },
                grid: {
                    color: getComputedStyle(document.body).getPropertyValue('--border-color')
                },
                pointLabels: {
                    color: getComputedStyle(document.body).getPropertyValue('--text-color')
                },
                ticks: {
                    color: getComputedStyle(document.body).getPropertyValue('--text-color'),
                    backdropColor: 'transparent'
                }
            }
        };
    }
    
    radarChartInstance.update();
}

function updateAllCharts() {
    if (salesChartInstance) salesChartInstance.update();
    if (distributionChartInstance) distributionChartInstance.update();
    if (performanceChartInstance) performanceChartInstance.update();
    if (quarterlyChartInstance) quarterlyChartInstance.update();
    if (radarChartInstance) radarChartInstance.update();
}

function updateChartThemes() {
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-color');
    const borderColor = getComputedStyle(document.body).getPropertyValue('--border-color');
    const bgColor = getComputedStyle(document.body).getPropertyValue('--card-bg');
    
    // Update semua chart
    [salesChartInstance, distributionChartInstance, performanceChartInstance, 
     quarterlyChartInstance, radarChartInstance].forEach(chart => {
        if (chart) {
            // Update legend
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            
            // Update tooltip
            if (chart.options.plugins && chart.options.plugins.tooltip) {
                chart.options.plugins.tooltip.backgroundColor = bgColor;
                chart.options.plugins.tooltip.titleColor = textColor;
                chart.options.plugins.tooltip.bodyColor = textColor;
                chart.options.plugins.tooltip.borderColor = borderColor;
            }
            
            // Update scales
            if (chart.options.scales) {
                // Handle regular scales
                if (chart.options.scales.x) {
                    if (chart.options.scales.x.ticks) {
                        chart.options.scales.x.ticks.color = textColor;
                    }
                    if (chart.options.scales.x.grid) {
                        chart.options.scales.x.grid.color = borderColor;
                    }
                    if (chart.options.scales.x.title) {
                        chart.options.scales.x.title.color = textColor;
                    }
                }
                
                if (chart.options.scales.y) {
                    if (chart.options.scales.y.ticks) {
                        chart.options.scales.y.ticks.color = textColor;
                    }
                    if (chart.options.scales.y.grid) {
                        chart.options.scales.y.grid.color = borderColor;
                    }
                    if (chart.options.scales.y.title) {
                        chart.options.scales.y.title.color = textColor;
                    }
                }
                
                // Handle radial scale (radar chart)
                if (chart.options.scales.r) {
                    if (chart.options.scales.r.angleLines) {
                        chart.options.scales.r.angleLines.color = borderColor;
                    }
                    if (chart.options.scales.r.grid) {
                        chart.options.scales.r.grid.color = borderColor;
                    }
                    if (chart.options.scales.r.pointLabels) {
                        chart.options.scales.r.pointLabels.color = textColor;
                    }
                    if (chart.options.scales.r.ticks) {
                        chart.options.scales.r.ticks.color = textColor;
                    }
                }
            }
            
            chart.update();
        }
    });
}

// Isi tabel dengan data
let currentSortColumn = -1;
let currentSortDirection = 'asc';

function populateTable() {
    const tableBody = document.querySelector('#productTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    salesData.categories.forEach((category, index) => {
        const row = document.createElement('tr');
        row.setAttribute('data-category', category.name.toLowerCase());
        
        row.innerHTML = `
            <td>
                <div class="category-cell">
                    <i class="fas fa-${category.icon}"></i>
                    <span>${category.name}</span>
                </div>
            </td>
            <td class="revenue">Rp ${(category.revenue / 1000000).toFixed(1)} jt</td>
            <td class="growth">
                <span class="${category.growth >= 0 ? 'positive' : 'negative'}">
                    <i class="fas fa-${category.growth >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                    ${Math.abs(parseFloat(category.growth)).toFixed(1)}%
                </span>
            </td>
            <td class="share">${category.marketShare}%</td>
            <td class="rating">
                <div class="rating">
                    ${getRatingStars(category.rating)}
                </div>
            </td>
            <td>
                <button class="action-btn view-product" data-index="${index}">
                    <i class="fas fa-eye"></i> Detail
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-product').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showProductDetail(index);
        });
    });
    
    // Reset sorting indicators
    document.querySelectorAll('#productTable th').forEach(th => {
        th.classList.remove('sorted');
        th.innerHTML = th.innerHTML.replace(/<i class="fas fa-sort-(up|down)"><\/i>/, '');
    });
}

// Isi ranking produk
function populateRanking() {
    const rankingContainer = document.getElementById('topProducts');
    if (!rankingContainer) return;
    
    rankingContainer.innerHTML = '';
    
    // Ambil top 5 produk berdasarkan revenue
    const topProducts = [...salesData.categories]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
    
    // Cari revenue maksimum untuk normalisasi
    const maxRevenue = Math.max(...topProducts.map(p => p.revenue));
    
    topProducts.forEach((product, index) => {
        const rank = index + 1;
        const percentage = (product.revenue / maxRevenue) * 100;
        
        const rankingItem = document.createElement('div');
        rankingItem.className = 'ranking-item';
        rankingItem.setAttribute('data-index', salesData.categories.findIndex(c => c.name === product.name));
        
        rankingItem.innerHTML = `
            <div class="rank rank-${rank}">${rank}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-sales">Rp ${(product.revenue / 1000000).toFixed(1)} jt</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
            <div class="product-growth ${product.growth >= 0 ? 'positive' : 'negative'}">
                <i class="fas fa-${product.growth >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                ${Math.abs(parseFloat(product.growth)).toFixed(1)}%
            </div>
        `;
        
        rankingContainer.appendChild(rankingItem);
    });
    
    // Add event listeners to ranking items
    document.querySelectorAll('.ranking-item').forEach(item => {
        item.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showProductDetail(index);
        });
    });
}

// Helper untuk bintang rating
function getRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Set rating filter
function setRatingFilter(value) {
    const stars = document.querySelectorAll('#ratingFilter i');
    stars.forEach((star, index) => {
        if (index < value) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Search produk
function searchProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#productTable tbody tr');
    
    rows.forEach(row => {
        const categoryName = row.querySelector('.category-cell span').textContent.toLowerCase();
        if (categoryName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Sort produk
let sortState = {
    column: null,
    direction: 'asc'
};

function toggleSortProducts() {
    // Rotate through sorting options
    if (!sortState.column) {
        sortState = { column: 'revenue', direction: 'desc' };
    } else if (sortState.column === 'revenue' && sortState.direction === 'desc') {
        sortState = { column: 'growth', direction: 'desc' };
    } else if (sortState.column === 'growth' && sortState.direction === 'desc') {
        sortState = { column: 'rating', direction: 'desc' };
    } else {
        sortState = { column: null, direction: 'asc' };
    }
    
    applySorting();
}

function sortTableByColumn(columnIndex) {
    const columns = ['name', 'revenue', 'growth', 'share', 'rating'];
    const column = columns[columnIndex];
    
    if (sortState.column === column) {
        sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sortState.column = column;
        sortState.direction = 'asc';
    }
    
    applySorting();
    
    // Update sorting indicators
    document.querySelectorAll('#productTable th').forEach((th, idx) => {
        th.classList.remove('sorted');
        th.innerHTML = th.innerHTML.replace(/<i class="fas fa-sort-(up|down)"><\/i>/, '');
        
        if (columns[idx] === sortState.column) {
            th.classList.add('sorted');
            const icon = sortState.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
            th.innerHTML += ` <i class="fas ${icon}"></i>`;
        }
    });
}

function applySorting() {
    if (!sortState.column) {
        populateTable();
        return;
    }
    
    let sortedCategories = [...salesData.categories];
    
    switch(sortState.column) {
        case 'name':
            sortedCategories.sort((a, b) => {
                return sortState.direction === 'asc' 
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            });
            break;
            
        case 'revenue':
            sortedCategories.sort((a, b) => {
                return sortState.direction === 'asc' 
                    ? a.revenue - b.revenue
                    : b.revenue - a.revenue;
            });
            break;
            
        case 'growth':
            sortedCategories.sort((a, b) => {
                return sortState.direction === 'asc' 
                    ? parseFloat(a.growth) - parseFloat(b.growth)
                    : parseFloat(b.growth) - parseFloat(a.growth);
            });
            break;
            
        case 'share':
            sortedCategories.sort((a, b) => {
                return sortState.direction === 'asc' 
                    ? a.marketShare - b.marketShare
                    : b.marketShare - a.marketShare;
            });
            break;
            
        case 'rating':
            sortedCategories.sort((a, b) => {
                return sortState.direction === 'asc' 
                    ? a.rating - b.rating
                    : b.rating - a.rating;
            });
            break;
    }
    
    // Update table with sorted data
    const tableBody = document.querySelector('#productTable tbody');
    tableBody.innerHTML = '';
    
    sortedCategories.forEach((category, index) => {
        const originalIndex = salesData.categories.findIndex(c => c.name === category.name);
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <div class="category-cell">
                    <i class="fas fa-${category.icon}"></i>
                    <span>${category.name}</span>
                </div>
            </td>
            <td class="revenue">Rp ${(category.revenue / 1000000).toFixed(1)} jt</td>
            <td class="growth">
                <span class="${category.growth >= 0 ? 'positive' : 'negative'}">
                    <i class="fas fa-${category.growth >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                    ${Math.abs(parseFloat(category.growth)).toFixed(1)}%
                </span>
            </td>
            <td class="share">${category.marketShare}%</td>
            <td class="rating">
                <div class="rating">
                    ${getRatingStars(category.rating)}
                </div>
            </td>
            <td>
                <button class="action-btn view-product" data-index="${originalIndex}">
                    <i class="fas fa-eye"></i> Detail
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Re-attach event listeners
    document.querySelectorAll('.view-product').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showProductDetail(index);
        });
    });
}

// Apply product filter
function applyProductFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const growthFilter = document.getElementById('growthFilter');
    const ratingFilter = document.querySelectorAll('#ratingFilter i.active').length;
    
    const selectedCategories = Array.from(categoryFilter.selectedOptions).map(opt => opt.value);
    const minGrowth = parseInt(growthFilter.value);
    const minRating = ratingFilter;
    
    // Filter data
    let filteredCategories = [...salesData.categories];
    
    // Filter by category
    if (!selectedCategories.includes('all')) {
        const categoryMap = {
            'electronics': 'Elektronik',
            'clothing': 'Pakaian',
            'food': 'Makanan & Minuman',
            'books': 'Buku & Alat Tulis',
            'sports': 'Olahraga & Outdoor'
        };
        
        const selectedCategoryNames = selectedCategories.map(cat => categoryMap[cat]);
        filteredCategories = filteredCategories.filter(cat => 
            selectedCategoryNames.includes(cat.name)
        );
    }
    
    // Filter by growth
    filteredCategories = filteredCategories.filter(cat => 
        parseFloat(cat.growth) >= minGrowth
    );
    
    // Filter by rating
    filteredCategories = filteredCategories.filter(cat => 
        cat.rating >= minRating
    );
    
    // Update table with filtered data
    updateFilteredTable(filteredCategories);
    
    showNotification(`Menampilkan ${filteredCategories.length} produk berdasarkan filter`, 'success');
}

function resetProductFilter() {
    // Reset category filter
    document.getElementById('categoryFilter').selectedIndex = 0;
    
    // Reset growth filter
    document.getElementById('growthFilter').value = 0;
    document.getElementById('growthValue').textContent = '0%';
    
    // Reset rating filter
    setRatingFilter(0);
    
    // Reset table
    populateTable();
    
    showNotification('Filter berhasil direset', 'success');
}

function updateFilteredTable(filteredCategories) {
    const tableBody = document.querySelector('#productTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    filteredCategories.forEach((category, index) => {
        const originalIndex = salesData.categories.findIndex(c => c.name === category.name);
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <div class="category-cell">
                    <i class="fas fa-${category.icon}"></i>
                    <span>${category.name}</span>
                </div>
            </td>
            <td>Rp ${(category.revenue / 1000000).toFixed(1)} jt</td>
            <td>
                <span class="${category.growth >= 0 ? 'positive' : 'negative'}">
                    <i class="fas fa-${category.growth >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                    ${Math.abs(parseFloat(category.growth)).toFixed(1)}%
                </span>
            </td>
            <td>${category.marketShare}%</td>
            <td>
                <div class="rating">
                    ${getRatingStars(category.rating)}
                </div>
            </td>
            <td>
                <button class="action-btn view-product" data-index="${originalIndex}">
                    <i class="fas fa-eye"></i> Detail
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Update summary
    const totalRevenue = filteredCategories.reduce((sum, cat) => sum + cat.revenue, 0);
    const avgGrowth = filteredCategories.reduce((sum, cat) => sum + parseFloat(cat.growth), 0) / filteredCategories.length;
    
    document.getElementById('totalCategories').textContent = filteredCategories.length;
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('avgGrowth').textContent = filteredCategories.length > 0 ? avgGrowth.toFixed(1) + '%' : '0%';
    
    // Re-attach event listeners
    document.querySelectorAll('.view-product').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showProductDetail(index);
        });
    });
}

// Show product detail modal
function showProductDetail(index) {
    const product = salesData.categories[index];
    if (!product) return;
    
    const modalContent = `
        <div class="product-detail-header">
            <div class="product-detail-icon">
                <i class="fas fa-${product.icon}"></i>
            </div>
            <div class="product-detail-title">
                <h4>${product.name}</h4>
                <p>Kategori Produk</p>
            </div>
        </div>
        
        <div class="product-detail-stats">
            <div class="stat-card">
                <div class="stat-value">Rp ${(product.revenue / 1000000).toFixed(1)} jt</div>
                <div class="stat-label">Total Pendapatan</div>
            </div>
            <div class="stat-card">
                <div class="stat-value ${product.growth >= 0 ? 'positive' : 'negative'}">${product.growth}%</div>
                <div class="stat-label">Pertumbuhan</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${product.marketShare}%</div>
                <div class="stat-label">Market Share</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${product.rating}/5</div>
                <div class="stat-label">Rating Produk</div>
            </div>
        </div>
        
        <div class="product-detail-description">
            <h5><i class="fas fa-info-circle"></i> Deskripsi Kinerja</h5>
            <p>${product.description}</p>
            <p>Kategori ini menunjukkan kinerja yang ${parseFloat(product.growth) >= 10 ? 'sangat baik' : 'cukup baik'} dengan pertumbuhan ${product.growth}% selama periode ini. Kontribusi terhadap total pendapatan perusahaan sebesar ${((product.revenue / kpiData.totalRevenue) * 100).toFixed(1)}%.</p>
            
            <div style="margin-top: 15px;">
                <h6><i class="fas fa-chart-line"></i> Rekomendasi Strategis:</h6>
                <ul>
                    <li>${parseFloat(product.growth) >= 15 ? 'Pertahankan strategi pemasaran yang sudah berjalan dengan baik' : 'Perlu peningkatan strategi pemasaran untuk mendongkrak pertumbuhan'}</li>
                    <li>${product.rating >= 4.5 ? 'Produk sangat diterima pasar, pertahankan kualitas' : 'Perlu peningkatan kualitas produk untuk meningkatkan rating'}</li>
                    <li>${product.marketShare >= 20 ? 'Dominasi pasar sudah kuat, fokus pada retensi pelanggan' : 'Perlu ekspansi pasar untuk meningkatkan market share'}</li>
                    <li>${product.revenue >= 1000000000 ? 'Produk high-value, fokus pada margin profit' : 'Tingkatkan volume penjualan untuk meningkatkan revenue'}</li>
                </ul>
            </div>
        </div>
    `;
    
    document.getElementById('productDetail').innerHTML = modalContent;
    openModal(document.getElementById('productModal'));
}

// Modal functions
function openModal(modal) {
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function openHelpModal() {
    openModal(document.getElementById('helpModal'));
}

// Ekspor dashboard
function exportDashboard() {
    showNotification("Mempersiapkan ekspor dashboard...", 'warning');
    
    // Simulasi proses ekspor
    setTimeout(() => {
        showNotification("Dashboard berhasil diekspor sebagai PDF!", 'success');
        
        // Buat tautan unduh dummy
        const exportLink = document.createElement('a');
        exportLink.href = '#';
        exportLink.download = `dashboard-penjualan-${new Date().toISOString().split('T')[0]}.pdf`;
        exportLink.click();
    }, 1500);
}

// Cetak dashboard
function printDashboard() {
    showNotification("Mempersiapkan cetak dashboard...", 'warning');
    
    setTimeout(() => {
        window.print();
        showNotification("Dashboard siap dicetak", 'success');
    }, 1000);
}

// Bagikan dashboard
function shareDashboard() {
    if (navigator.share) {
        navigator.share({
            title: 'Dashboard Multimedia - Analisis Penjualan',
            text: 'Dashboard interaktif analisis penjualan dan performa produk',
            url: window.location.href
        })
        .then(() => showNotification('Berhasil membagikan dashboard', 'success'))
        .catch(() => showNotification('Gagal membagikan dashboard', 'error'));
    } else {
        // Fallback untuk browser yang tidak support Web Share API
        navigator.clipboard.writeText(window.location.href)
            .then(() => showNotification('Link dashboard disalin ke clipboard', 'success'))
            .catch(() => showNotification('Gagal menyalin link', 'error'));
    }
}

// Tampilkan notifikasi
function showNotification(message, type = 'info') {
    // Hapus notifikasi sebelumnya
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    // Tambahkan ke body
    document.body.appendChild(notification);
    
    // Hapus setelah beberapa detik
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 4000);
}

// Tampilkan loading spinner
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
    }
}

// Cek tema dari localStorage saat load
window.addEventListener('load', function() {
    const savedTheme = localStorage.getItem('dashboard-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            themeBtn.innerHTML = '<i class="fas fa-sun"></i> Mode Terang';
        }
    }
});