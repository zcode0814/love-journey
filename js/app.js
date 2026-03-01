let config = {};
let timerInterval;
let myChart;

const cityCoordinates = {
    '北京': { value: [116.4074, 39.9042] },
    '上海': { value: [121.4737, 31.2304] },
    '广州': { value: [113.2644, 23.1291] },
    '深圳': { value: [114.0579, 22.5431] },
    '成都': { value: [104.0668, 30.5728] },
    '重庆': { value: [106.9123, 29.4316] },
    '杭州': { value: [120.1551, 30.2741] },
    '南京': { value: [118.7969, 32.0603] },
    '武汉': { value: [114.3055, 30.5928] },
    '西安': { value: [108.9398, 34.3416] },
    '天津': { value: [117.2010, 39.0842] },
    '苏州': { value: [120.5853, 31.2990] },
    '青岛': { value: [120.3826, 36.0671] },
    '大连': { value: [121.6147, 38.9140] },
    '厦门': { value: [118.0894, 24.4798] },
    '长沙': { value: [112.9388, 28.2282] },
    '昆明': { value: [102.7183, 25.0389] },
    '贵阳': { value: [106.6302, 26.6470] },
    '南宁': { value: [108.3665, 22.8170] },
    '海口': { value: [110.3493, 20.0174] },
    '三亚': { value: [109.5119, 18.2528] },
    '拉萨': { value: [91.1000, 29.6500] },
    '乌鲁木齐': { value: [87.6168, 43.8256] },
    '哈尔滨': { value: [126.5350, 45.8038] },
    '沈阳': { value: [123.4315, 41.8057] },
    '长春': { value: [125.3235, 43.8171] },
    '济南': { value: [117.1201, 36.6512] },
    '郑州': { value: [113.6253, 34.7466] },
    '合肥': { value: [117.2272, 31.8206] },
    '福州': { value: [119.2965, 26.0745] },
    '台北': { value: [121.5654, 25.0330] },
    '香港': { value: [114.1694, 22.3193] },
    '澳门': { value: [113.5439, 22.1987] },
    '大同': { value: [113.2950, 40.0903] },
    '延吉': { value: [129.5130, 42.8893] },
    '张家口': { value: [114.8869, 40.8118] },
    '乌兰察布': { value: [113.1146, 40.9945] },
    '都江堰': { value: [103.6175, 31.0040] },
    '石家庄': { value: [114.5149, 38.0423] },
    '太原': { value: [112.5492, 37.8570] },
    '呼和浩特': { value: [111.7492, 40.8426] },
    '南昌': { value: [115.8579, 28.6829] },
    '银川': { value: [106.2309, 38.4872] },
    '西宁': { value: [101.7782, 36.6171] },
    '兰州': { value: [103.8343, 36.0611] },
    '东京': { value: [139.6503, 35.6762] },
    '首尔': { value: [126.9780, 37.5665] },
    '济州岛': { value: [126.5312, 33.3617] },
    // '曼谷': { value: [100.5018, 13.7563] },
    '新加坡': { value: [103.8198, 1.3521] },
    '吉隆坡': { value: [101.6869, 3.1390] },
    '马累': { value: [73.5, 4.2] },
    // '马尼拉': { value: [120.9842, 14.5995] },
    // '河内': { value: [105.8542, 21.0285] },
    // '胡志明市': { value: [106.6297, 10.8231] },
    // '雅加达': { value: [106.8456, -6.2088] },
    // '德里': { value: [77.2090, 28.6139] },
    // '孟买': { value: [72.8777, 19.0760] },
    '迪拜': { value: [55.2708, 25.2048] }
};

async function loadConfig() {
    try {
        console.log('从 OSS 加载配置...');
        config = await loadConfigFromOSS();
        
        // 立即加载数据
        if (config.massageCoupons) {
            massageCouponsData = config.massageCoupons;
            console.log('数据已加载:', massageCouponsData.length);
        } else {
            console.log('配置中没有数据');
        }
        
        initializeApp();
    } catch (error) {
        console.error('从 OSS 加载配置失败:', error);
        alert('加载配置失败，请检查 OSS 配置是否正确');
    }
}

function initializeApp() {
    updateLoveTime();
    renderMilestones();
    renderGoals();
    initMap();
    startTimer();
    initMusic();
}

function initMusic() {
    const music = document.getElementById('bg-music');
    const musicControl = document.getElementById('music-control');
    
    if (!music || !musicControl) return;
    
    let hasInteracted = false;
    
    const playMusic = () => {
        if (music.paused) {
            const playPromise = music.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    musicControl.classList.add('playing');
                    hasInteracted = true;
                }).catch(error => {
                    console.log('自动播放被阻止:', error);
                });
            }
        }
    };
    
    const tryAutoPlay = () => {
        if (!hasInteracted) {
            playMusic();
        }
    };
    
    musicControl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (music.paused) {
            music.play();
            musicControl.classList.add('playing');
        } else {
            music.pause();
            musicControl.classList.remove('playing');
        }
    });
    
    document.addEventListener('click', tryAutoPlay, { once: true });
    document.addEventListener('touchstart', tryAutoPlay, { once: true });
    document.addEventListener('touchend', tryAutoPlay, { once: true });
    document.addEventListener('scroll', tryAutoPlay, { once: true });
    
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && !hasInteracted) {
            setTimeout(tryAutoPlay, 500);
        }
    });
    
    window.addEventListener('load', () => {
        setTimeout(tryAutoPlay, 100);
    });
    
    music.addEventListener('ended', () => {
        musicControl.classList.remove('playing');
    });
    
    music.volume = 0.5;
}

function updateLoveTime() {
    const startDate = new Date(config.loveStory.startDate);
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    updateTimeDisplay('days', days);
    updateTimeDisplay('hours', hours);
    updateTimeDisplay('minutes', minutes);
    updateTimeDisplay('seconds', seconds);

    document.getElementById('love-title').textContent = config.loveStory.title;
}

function updateTimeDisplay(id, value) {
    const element = document.getElementById(id);
    if (element.textContent !== value.toString()) {
        element.textContent = value;
        element.classList.add('updated');
        setTimeout(() => {
            element.classList.remove('updated');
        }, 500);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        updateLoveTime();
    }, 1000);
}

function renderMilestones() {
    const container = document.getElementById('milestones-container');
    container.innerHTML = '';

    config.milestones.forEach((milestone, index) => {
        const card = document.createElement('div');
        card.className = 'milestone-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const imageUrl = milestone.image || 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop';

        // <img src="${imageUrl}" alt="${milestone.title}" class="milestone-image" loading="lazy">
        card.innerHTML = `
            <div class="milestone-content">
                <div class="milestone-date">${formatDate(milestone.date, false)}</div>
                <h3 class="milestone-title">${milestone.title}</h3>
                <p class="milestone-description">${milestone.description}</p>
            </div>
        `;
        container.appendChild(card);
    });

    const prevBtn = document.getElementById('milestone-prev');
    const nextBtn = document.getElementById('milestone-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            container.scrollBy({ left: -320, behavior: 'smooth' });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            container.scrollBy({ left: 320, behavior: 'smooth' });
        });
    }
}

function renderGoals() {
    const container = document.getElementById('goals-container');
    container.innerHTML = '';

    config.goals.forEach((goal, index) => {
        const card = document.createElement('div');
        card.className = 'goal-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <span class="goal-icon">${goal.icon}</span>
            <h3 class="goal-title">${goal.title}</h3>
        `;
        container.appendChild(card);
    });

    const prevBtn = document.getElementById('goal-prev');
    const nextBtn = document.getElementById('goal-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            container.scrollBy({ left: -220, behavior: 'smooth' });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            container.scrollBy({ left: 220, behavior: 'smooth' });
        });
    }
}

async function initMap() {
    if (typeof echarts === 'undefined') {
        console.error('ECharts 未加载');
        return;
    }

    const chartDom = document.getElementById('asia-map');
    myChart = echarts.init(chartDom);

    try {
        const response = await fetch('assets/data/china-map.json');
        const geoJson = await response.json();
        
        echarts.registerMap('china', geoJson);

        const visitedCityNames = config.visitedCities.map(city => city.name);

        const scatterData = [];
        Object.entries(cityCoordinates).forEach(([cityName, coords]) => {
            const isVisited = visitedCityNames.includes(cityName);
            scatterData.push({
                name: cityName,
                value: [...coords.value, isVisited ? 1 : 0],
                itemStyle: {
                    color: isVisited ? '#ff69b4' : '#e0e0e0',
                    borderColor: isVisited ? '#ff1493' : '#ccc',
                    borderWidth: isVisited ? 3 : 2
                },
                visited: isVisited
            });
        });

        const option = {
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(255, 182, 193, 0.9)',
                borderColor: '#ff1493',
                borderWidth: 2,
                textStyle: {
                    color: '#fff'
                },
                formatter: function(params) {
                    if (params.componentSubType === 'effectScatter') {
                        const cityData = config.visitedCities.find(c => c.name === params.name);
                        if (cityData) {
                            return `
                                <div style="text-align: center; padding: 5px;">
                                    <small style="font-size: 12px;">${formatDate(cityData.date)}</small><br>
                                    <span style="font-size: 13px;">${cityData.description}</span>
                                </div>
                            `;
                        }
                        return '';
                    }
                    return '';
                }
            },
            geo: {
                map: 'china',
                roam: true,
                zoom: 1.2,
                label: {
                    show: false,
                    color: '#999',
                    fontSize: 10
                },
                itemStyle: {
                    areaColor: '#fff5f8',
                    borderColor: '#ffd1dc',
                    borderWidth: 1.5
                },
                emphasis: {
                    label: {
                        show: false
                    },
                    itemStyle: {
                        areaColor: '#ffe4ec',
                        borderColor: '#ff69b4',
                        borderWidth: 2
                    }
                }
            },
            series: [
                {
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: scatterData.filter(d => d.visited),
                    symbolSize: 15,
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke',
                        scale: 5,
                        period: 4
                    },
                    label: {
                        formatter: '{b}',
                        position: 'right',
                        show: true,
                        fontSize: 14,
                        color: '#ff1493',
                        fontWeight: 'bold',
                        distance: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderColor: '#ffb6c1',
                        borderWidth: 1,
                        borderRadius: 4,
                        padding: [3, 6]
                    },
                    itemStyle: {
                        color: '#ff69b4',
                        shadowBlur: 20,
                        shadowColor: '#ff1493',
                        shadowOffsetX: 0,
                        shadowOffsetY: 0
                    },
                    zlevel: 1
                },
                {
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: scatterData.filter(d => !d.visited),
                    symbolSize: 10,
                    label: {
                        formatter: '{b}',
                        position: 'right',
                        show: true,
                        fontSize: 11,
                        color: '#aaa',
                        distance: 5
                    },
                    itemStyle: {
                        color: '#d0d0d0',
                        borderColor: '#bbb',
                        borderWidth: 1,
                        shadowBlur: 5,
                        shadowColor: '#ccc'
                    },
                    zlevel: 0
                }
            ]
        };

        myChart.setOption(option);

        window.addEventListener('resize', function() {
            myChart.resize();
        });

    } catch (error) {
        console.error('加载地图数据失败:', error);
    }
}

function formatDate(dateString, showTime = true) {
    const date = new Date(dateString.replace(/-/g, '/'));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    if (!showTime) {
        return `${year}年${month}月${day}日`;
    }
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

let massageCouponsData = [];

function initMenu() {
    const menuControl = document.getElementById('menu-control');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuClose = document.getElementById('menu-close');
    const menuItems = document.querySelectorAll('.menu-item');

    if (menuControl) {
        menuControl.addEventListener('click', () => {
            menuOverlay.classList.add('active');
        });
    }

    if (menuClose) {
        menuClose.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) {
                menuOverlay.classList.remove('active');
            }
        });
    }

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            switchPage(page);
            
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            menuOverlay.classList.remove('active');
        });
    });
}

function switchPage(page) {
    const homePage = document.getElementById('page-home');
    const couponsPage = document.getElementById('page-coupons');

    if (page === 'home') {
        homePage.classList.remove('page-hidden');
        couponsPage.classList.add('page-hidden');
    } else if (page === 'coupons') {
        homePage.classList.add('page-hidden');
        couponsPage.classList.remove('page-hidden');
        renderCoupons();
    }
}

let currentFilter = 'all';
let qrCodeInstance = null;

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderCoupons();
        });
    });

    initPullRefresh();
}

function initPullRefresh() {
    const container = document.getElementById('page-coupons');
    const indicator = document.getElementById('pull-refresh-indicator');
    
    if (!container || !indicator) return;
    
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    let isRefreshing = false;
    const threshold = 80; // 下拉阈值
    
    container.addEventListener('touchstart', (e) => {
        // 只有在页面顶部时才启用下拉刷新
        if (container.scrollTop > 0) return;
        
        startY = e.touches[0].clientY;
        isPulling = true;
    }, { passive: true });
    
    container.addEventListener('touchmove', (e) => {
        if (!isPulling || isRefreshing) return;
        
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        
        if (diff > 0 && diff < threshold * 2) {
            indicator.style.transform = `translateY(${diff * 0.5}px)`;
            
            if (diff > threshold) {
                indicator.classList.add('pulling');
                indicator.querySelector('.pull-refresh-text').textContent = '释放刷新';
            } else {
                indicator.classList.remove('pulling');
                indicator.querySelector('.pull-refresh-text').textContent = '下拉刷新';
            }
        }
    }, { passive: true });
    
    container.addEventListener('touchend', async () => {
        if (!isPulling || isRefreshing) return;
        
        isPulling = false;
        const diff = currentY - startY;
        
        if (diff > threshold) {
            // 触发刷新
            isRefreshing = true;
            indicator.classList.add('refreshing');
            indicator.classList.remove('pulling');
            indicator.querySelector('.pull-refresh-text').textContent = '刷新中...';
            indicator.style.transform = 'translateY(0)';
            
            try {
                await loadConfig();
                renderCoupons();
                indicator.querySelector('.pull-refresh-text').textContent = '刷新成功';
            } catch (error) {
                console.error('刷新失败:', error);
                indicator.querySelector('.pull-refresh-text').textContent = '刷新失败';
            } finally {
                setTimeout(() => {
                    indicator.classList.remove('refreshing');
                    indicator.querySelector('.pull-refresh-text').textContent = '下拉刷新';
                    isRefreshing = false;
                }, 1000);
            }
        } else {
            // 未达阈值，回弹
            indicator.style.transform = 'translateY(0)';
            indicator.classList.remove('pulling');
        }
        
        startY = 0;
        currentY = 0;
    });
    
    // 桌面端鼠标事件支持
    container.addEventListener('mousedown', (e) => {
        if (container.scrollTop > 0) return;
        
        startY = e.clientY;
        isPulling = true;
    });
    
    container.addEventListener('mousemove', (e) => {
        if (!isPulling || isRefreshing) return;
        
        currentY = e.clientY;
        const diff = currentY - startY;
        
        if (diff > 0 && diff < threshold * 2) {
            indicator.style.transform = `translateY(${diff * 0.5}px)`;
            
            if (diff > threshold) {
                indicator.classList.add('pulling');
                indicator.querySelector('.pull-refresh-text').textContent = '释放刷新';
            } else {
                indicator.classList.remove('pulling');
                indicator.querySelector('.pull-refresh-text').textContent = '下拉刷新';
            }
        }
    });
    
    container.addEventListener('mouseup', async () => {
        if (!isPulling || isRefreshing) return;
        
        isPulling = false;
        const diff = currentY - startY;
        
        if (diff > threshold) {
            isRefreshing = true;
            indicator.classList.add('refreshing');
            indicator.classList.remove('pulling');
            indicator.querySelector('.pull-refresh-text').textContent = '刷新中...';
            indicator.style.transform = 'translateY(0)';
            
            try {
                await loadConfig();
                renderCoupons();
                indicator.querySelector('.pull-refresh-text').textContent = '刷新成功';
            } catch (error) {
                console.error('刷新失败:', error);
                indicator.querySelector('.pull-refresh-text').textContent = '刷新失败';
            } finally {
                setTimeout(() => {
                    indicator.classList.remove('refreshing');
                    indicator.querySelector('.pull-refresh-text').textContent = '下拉刷新';
                    isRefreshing = false;
                }, 1000);
            }
        } else {
            indicator.style.transform = 'translateY(0)';
            indicator.classList.remove('pulling');
        }
        
        startY = 0;
        currentY = 0;
    });
    
    container.addEventListener('mouseleave', () => {
        if (isPulling && !isRefreshing) {
            isPulling = false;
            indicator.style.transform = 'translateY(0)';
            indicator.classList.remove('pulling');
            startY = 0;
            currentY = 0;
        }
    });
}

function initQRModal() {
    const qrModal = document.getElementById('qr-modal');
    const qrModalClose = document.getElementById('qr-modal-close');

    if (qrModalClose) {
        qrModalClose.addEventListener('click', closeQRModal);
    }

    if (qrModal) {
        qrModal.addEventListener('click', (e) => {
            if (e.target === qrModal) {
                closeQRModal();
            }
        });
    }
}

function openQRModal(coupon) {
    const qrModal = document.getElementById('qr-modal');
    const qrCodeContainer = document.getElementById('qr-code');

    if (!qrModal || !qrCodeContainer) return;

    qrCodeContainer.innerHTML = '';

    // 校验是否已被使用
    if (coupon.status === 'used') {
        alert(`该${coupon.title}已被使用，无法重复使用`);
        return;
    }

    // 生成核销页面 URL
    const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '').replace(/\/$/, '');
    const useUrl = `${baseUrl}/use.html?id=${coupon.id}`;
    
    console.log('核销链接:', useUrl);

    try {
        if (typeof QRCode !== 'undefined') {
            qrCodeInstance = new QRCode(qrCodeContainer, {
                text: useUrl,
                width: 170,
                height: 170,
                colorDark: '#ff69b4',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
        } else {
            qrCodeContainer.innerHTML = '<div style="color: #999;">二维码加载失败</div>';
        }
    } catch (error) {
        console.error('二维码生成失败:', error);
        qrCodeContainer.innerHTML = '<div style="color: #999;">二维码生成失败</div>';
    }

    qrModal.classList.add('active');
}

function closeQRModal() {
    const qrModal = document.getElementById('qr-modal');
    if (qrModal) {
        qrModal.classList.remove('active');
    }
}

function renderCoupons() {
    const container = document.getElementById('coupons-container');
    if (!container) return;

    container.innerHTML = '';

    if (!massageCouponsData || massageCouponsData.length === 0) {
        console.log('数据为空，尝试从配置加载');
        if (config.massageCoupons) {
            massageCouponsData = config.massageCoupons;
        }
    }

    if (massageCouponsData.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">暂无数据</div>';
        return;
    }

    const filteredCoupons = massageCouponsData.filter(coupon => {
        if (currentFilter === 'all') return true;
        return coupon.status === currentFilter;
    });

    if (filteredCoupons.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">该分类下暂无数据</div>';
        return;
    }

    // 按获取时间降序排序（最新的在前面）
    filteredCoupons.sort((a, b) => {
        const dateA = new Date(a.acquiredDate.replace(/-/g, '/'));
        const dateB = new Date(b.acquiredDate.replace(/-/g, '/'));
        return dateB - dateA;
    });

    filteredCoupons.forEach((coupon, index) => {
        const card = document.createElement('div');
        card.className = `coupon-card ${coupon.status}`;
        card.style.animationDelay = `${index * 0.1}s`;

        const statusText = coupon.status === 'available' ? '立即使用' : '已使用';
        const statusClass = coupon.status === 'available' ? 'available' : 'used';

        card.innerHTML = `
            <div class="coupon-card-header">
                <span class="coupon-number">NO.${String(coupon.id).padStart(3, '0')}</span>
                <button class="coupon-status ${statusClass}" data-coupon-id="${coupon.id}">${statusText}</button>
            </div>
            <div class="coupon-main">
                <span class="coupon-icon">${coupon.icon}</span>
                <div class="coupon-content">
                    <h3 class="coupon-title">${coupon.title}</h3>
                    <div class="coupon-meta">
                        <span class="coupon-duration">${coupon.duration}${coupon.durationUnit}</span>
                    </div>
                </div>
            </div>
            <div class="coupon-timeline">
                <div class="timeline-item">
                    <div class="timeline-dot ${coupon.status === 'available' ? 'active' : ''}"></div>
                    <div class="timeline-content">
                        <span class="timeline-label">获取时间</span>
                        <span class="timeline-time">${formatDate(coupon.acquiredDate)}</span>
                    </div>
                </div>
                ${coupon.usedDate ? `
                <div class="timeline-item">
                    <div class="timeline-dot used"></div>
                    <div class="timeline-content">
                        <span class="timeline-label">使用时间</span>
                        <span class="timeline-time">${formatDate(coupon.usedDate)}</span>
                    </div>
                </div>
                ` : `
                <div class="timeline-item pending">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <span class="timeline-label">等待使用</span>
                        <span class="timeline-time">-</span>
                    </div>
                </div>
                `}
            </div>
            <div class="coupon-stamp">
                <span class="coupon-stamp-text">已使用</span>
            </div>
        `;

        const statusBtn = card.querySelector('.coupon-status');
        if (statusBtn && coupon.status === 'available') {
            statusBtn.addEventListener('click', () => {
                // 再次检查最新状态，防止并发问题
                if (coupon.status === 'used') {
                    alert(`该${coupon.title}已被使用，无法重复使用`);
                    return;
                }
                openQRModal(coupon);
            });
        }

        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initMenu();
    initTabs();
    initQRModal();
});