const crypto = require('crypto');

const SECRET = '12345'
const AES_METHOD = 'aes-256-cbc';

const encrypt = (data) => {
    const key = crypto.createHash("sha256").update(SECRET).digest('hex');
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(key).slice(0,32), iv);
    let encrypted = cipher.update(JSON.stringify(data));

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

const decrypt = (data) => {
    const key = crypto.createHash("sha256").update(SECRET).digest('hex');
    let textParts = data.split(':');
    let iv = new Buffer(textParts.shift(), 'hex');
    let encryptedText = new Buffer(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(AES_METHOD, new Buffer(key).slice(0,32), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString());
}

const run = async () => {
    let data = {
        message: "Hey how are you"
    }

    console.log('data', data)

    const encryptedData = encrypt(data)

    console.log('encryptedData', encryptedData)

    const descryptedData = decrypt(encryptedData)

    console.log('descryptedData', descryptedData)
}

run().catch(e => console.error(e))