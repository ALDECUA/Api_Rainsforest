/**
 *  token.js
 *  @version: 1.0.0
 *  @author: trejocode
 *  @description: Proceso de cifrado de datos
 * 	@process: 2
 */

const crypto = require("crypto");

function getToken(data) {
    var cipher = crypto.createCipher("aes-256-cbc", "beFlippio API Key");
    var encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}

function getDecode(token) {
    var decipher = crypto.createDecipher("aes-256-cbc", "beFlippio API Key");
    var decrypted = decipher.update(token, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

function makeid(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function setTokenRandom() {
    const token = crypto.randomBytes(20);
    return token.toString("hex");
}

module.exports = {
    getToken,
    getDecode,
    makeid,
    setTokenRandom
};
