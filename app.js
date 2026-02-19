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
    '东京': { value: [139.6503, 35.6762] },
    '首尔': { value: [126.9780, 37.5665] },
    '济州岛': { value: [126.5312, 33.3617] },
    '曼谷': { value: [100.5018, 13.7563] },
    '新加坡': { value: [103.8198, 1.3521] },
    '吉隆坡': { value: [101.6869, 3.1390] },
    '马尼拉': { value: [120.9842, 14.5995] },
    '河内': { value: [105.8542, 21.0285] },
    '胡志明市': { value: [106.6297, 10.8231] },
    '雅加达': { value: [106.8456, -6.2088] },
    '德里': { value: [77.2090, 28.6139] },
    '孟买': { value: [72.8777, 19.0760] },
    '迪拜': { value: [55.2708, 25.2048] }
};

async function loadConfig() {
    try {
        const response = await fetch('config.json');
        config = await response.json();
        initializeApp();
    } catch (error) {
        console.error('加载配置文件失败:', error);
    }
}

function initializeApp() {
    updateLoveTime();
    renderMilestones();
    renderGoals();
    initMap();
    startTimer();
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

    config.milestones.forEach(milestone => {
        const card = document.createElement('div');
        card.className = 'milestone-card';
        card.innerHTML = `
            <div class="milestone-date">${formatDate(milestone.date)}</div>
            <h3 class="milestone-title">${milestone.title}</h3>
            <p class="milestone-description">${milestone.description}</p>
        `;
        container.appendChild(card);
    });
}

function renderGoals() {
    const container = document.getElementById('goals-container');
    container.innerHTML = '';

    config.goals.forEach(goal => {
        const card = document.createElement('div');
        card.className = 'goal-card';
        card.innerHTML = `
            <span class="goal-icon">${goal.icon}</span>
            <h3 class="goal-title">${goal.title}</h3>
        `;
        container.appendChild(card);
    });
}

async function initMap() {
    if (typeof echarts === 'undefined') {
        console.error('ECharts 未加载');
        return;
    }

    const chartDom = document.getElementById('asia-map');
    myChart = echarts.init(chartDom);

    try {
        const response = await fetch('china-map.json');
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
                    show: false
                },
                itemStyle: {
                    areaColor: '#f8f0f5',
                    borderColor: '#ffb6c1',
                    borderWidth: 1
                },
                emphasis: {
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
                        scale: 3
                    },
                    label: {
                        formatter: '{b}',
                        position: 'right',
                        show: true,
                        fontSize: 12,
                        color: '#5a4a5a',
                        fontWeight: 'bold',
                        distance: 5
                    },
                    itemStyle: {
                        color: '#ff69b4',
                        shadowBlur: 10,
                        shadowColor: '#ff1493'
                    },
                    zlevel: 1
                },
                {
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: scatterData.filter(d => !d.visited),
                    symbolSize: 8,
                    label: {
                        formatter: '{b}',
                        position: 'right',
                        show: true,
                        fontSize: 10,
                        color: '#999',
                        distance: 5
                    },
                    itemStyle: {
                        color: '#e0e0e0',
                        borderColor: '#ccc',
                        borderWidth: 1
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

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
}

document.addEventListener('DOMContentLoaded', loadConfig);