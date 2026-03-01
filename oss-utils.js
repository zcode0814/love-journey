let ossClient = null;

function initOSS() {
  if (typeof OSS === 'undefined') {
    console.error('OSS SDK 未加载');
    return false;
  }
  
  if (!ossClient) {
    const decryptedAccessKeyId = CryptoUtils.decrypt(OSS_CONFIG.ak);
    const decryptedAccessKeySecret = CryptoUtils.decrypt(OSS_CONFIG.sk);
    
    ossClient = new OSS({
      region: OSS_CONFIG.region,
      bucket: OSS_CONFIG.bucket,
      accessKeyId: decryptedAccessKeyId,
      accessKeySecret: decryptedAccessKeySecret
    });
  }
  
  return true;
}

async function loadConfigFromOSS() {
  if (!initOSS()) {
    throw new Error('OSS 初始化失败');
  }
  
  try {
    const result = await ossClient.get(OSS_CONFIG.configPath);
    const content = result.content.toString();
    return JSON.parse(content);
  } catch (error) {
    console.error('从 OSS 读取配置失败:', error);
    throw error;
  }
}

async function saveConfigToOSS(configData) {
  if (!initOSS()) {
    throw new Error('OSS 初始化失败');
  }
  
  try {
    const content = JSON.stringify(configData, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    await ossClient.put(OSS_CONFIG.configPath, blob);
    console.log('配置已保存到 OSS');
    return true;
  } catch (error) {
    console.error('保存配置到 OSS 失败:', error);
    throw error;
  }
}

async function addMassageCoupon(coupon) {
  const config = await loadConfigFromOSS();
  
  if (!config.massageCoupons) {
    config.massageCoupons = [];
  }
  
  const maxId = config.massageCoupons.reduce((max, c) => Math.max(max, c.id), 0);
  coupon.id = maxId + 1;
  
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  coupon.acquiredDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
  coupon.usedDate = null;
  coupon.status = 'available';
  
  config.massageCoupons.push(coupon);
  
  await saveConfigToOSS(config);
  return coupon;
}

async function useMassageCoupon(couponId) {
  const config = await loadConfigFromOSS();
  
  if (!config.massageCoupons) {
    throw new Error('没有按摩券数据');
  }
  
  const coupon = config.massageCoupons.find(c => c.id === couponId);
  
  if (!coupon) {
    throw new Error('找不到该按摩券');
  }
  
  if (coupon.status === 'used') {
    throw new Error('该按摩券已被使用');
  }
  
  coupon.status = 'used';
  
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  coupon.usedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
  await saveConfigToOSS(config);
  return coupon;
}

function verifyPasscode(inputPasscode) {
  return inputPasscode === OSS_CONFIG.adminPasscode;
}
