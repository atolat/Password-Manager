var crypto=require('crypto-js');
var secretmessage = 'I killed your mom';
var secretKey='123abc';

//Encrypt
var encryptedMessage=crypto.AES.encrypt(secretmessage, secretKey);
console.log(encryptedMessage);

//Decrypt
var bytes = crypto.AES.decrypt(encryptedMessage,secretKey);
var decryptedMessage = bytes.toString(crypto.enc.Utf8);

console.log(decryptedMessage);