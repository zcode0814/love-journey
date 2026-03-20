const OSS = require('ali-oss');

// 从环境变量获取配置
const config = {
  region: process.env.OSS_REGION,
  bucket: process.env.OSS_BUCKET,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  configPath: process.env.OSS_CONFIG_PATH || 'config.json'
};

// 按摩卡配置
const couponConfig = {
  duration: parseInt(process.env.COUPON_DURATION) || 5,
  title: process.env.COUPON_TITLE || '每周按摩卡'
};

// 创建 OSS 客户端
const client = new OSS({
  region: config.region,
  bucket: config.bucket,
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret
});

// 格式化日期
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 从 OSS 加载配置
async function loadConfigFromOSS() {
  try {
    const result = await client.get(config.configPath);
    const content = result.content.toString();
    return JSON.parse(content);
  } catch (error) {
    console.error('从 OSS 读取配置失败:', error);
    throw error;
  }
}

// 保存配置到 OSS
async function saveConfigToOSS(configData) {
  try {
    const content = JSON.stringify(configData, null, 2);
    const buffer = Buffer.from(content, 'utf-8');
    await client.put(config.configPath, buffer);
    console.log('配置已保存到 OSS');
    return true;
  } catch (error) {
    console.error('保存配置到 OSS 失败:', error);
    throw error;
  }
}

// 添加按摩卡
async function addMassageCoupon(coupon) {
  const config = await loadConfigFromOSS();
  
  if (!config.massageCoupons) {
    config.massageCoupons = [];
  }
  
  const maxId = config.massageCoupons.reduce((max, c) => Math.max(max, c.id || 0), 0);
  coupon.id = maxId + 1;
  coupon.acquiredDate = formatDate(new Date());
  coupon.usedDate = null;
  coupon.status = 'available';
  
  config.massageCoupons.push(coupon);
  
  await saveConfigToOSS(config);
  return coupon;
}

// 主函数
async function main() {
  console.log('=================================');
  console.log('🎁 开始自动赠送按摩卡');
  console.log('=================================');
  console.log(`标题: ${couponConfig.title}`);
  console.log(`时长: ${couponConfig.duration} 分钟`);
  console.log('');

  try {
    // 检查必要的环境变量
    const requiredEnvVars = ['OSS_REGION', 'OSS_BUCKET', 'OSS_ACCESS_KEY_ID', 'OSS_ACCESS_KEY_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`缺少必要的环境变量: ${missingVars.join(', ')}`);
    }

    // 创建按摩卡对象
    const coupon = {
      icon: '💆',
      title: couponConfig.title,
      duration: couponConfig.duration,
      durationUnit: '分钟'
    };

    // 添加到 OSS
    const result = await addMassageCoupon(coupon);
    
    console.log('✅ 按摩卡赠送成功！');
    console.log('---------------------------------');
    console.log(`ID: ${result.id}`);
    console.log(`标题: ${result.title}`);
    console.log(`时长: ${result.duration} ${result.durationUnit}`);
    console.log(`获取时间: ${result.acquiredDate}`);
    console.log(`状态: ${result.status}`);
    console.log('=================================');
    
  } catch (error) {
    console.error('❌ 赠送失败:', error.message);
    process.exit(1);
  }
}

// 执行主函数
main();
