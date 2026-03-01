const CryptoUtils = {
  secretKey: 'love-journey-secret',
  
  encrypt(text) {
    try {
      let encoded = btoa(text);
      let reversed = encoded.split('').reverse().join('');
      let obfuscated = '';
      
      for (let i = 0; i < reversed.length; i++) {
        let charCode = reversed.charCodeAt(i);
        obfuscated += String.fromCharCode(charCode + 3);
      }
      
      return btoa(obfuscated);
    } catch (error) {
      console.error('加密失败:', error);
      return text;
    }
  },
  
  decrypt(encryptedText) {
    try {
      let obfuscated = atob(encryptedText);
      let reversed = '';
      
      for (let i = 0; i < obfuscated.length; i++) {
        let charCode = obfuscated.charCodeAt(i);
        reversed += String.fromCharCode(charCode - 3);
      }
      
      let encoded = reversed.split('').reverse().join('');
      return atob(encoded);
    } catch (error) {
      console.error('解密失败:', error);
      return encryptedText;
    }
  }
};
