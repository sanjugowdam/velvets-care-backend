const CryptoJS = require('crypto-js');
require('dotenv/config')

const encryptText = async (text) => {
    const key = CryptoJS.enc.Hex.parse(process.env.KEY);
    const iv = CryptoJS.enc.Hex.parse(process.env.IV);
    const encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv });
    return encrypted.toString();
};

const decryptText = async (encryptedText) => {
    const key = CryptoJS.enc.Hex.parse(process.env.KEY);
    const iv = CryptoJS.enc.Hex.parse(process.env.IV);
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

module.exports = {
    encryptText,
    decryptText
}