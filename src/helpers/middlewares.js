const jwt = require("jsonwebtoken");

async function verifyToken(ctx, next) {
    const bearerHeader = ctx.get('Authorization');

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        ctx.request.body.token = bearerToken;
        const validator = await JwtVerify(bearerToken);
        if (validator !== false) {
            await next();
        } else {
            ctx.body = { error: true, message: 'La sesión no es valida', unauthorized: true };
        }
    } else {
        ctx.body = { error: true, message: 'No autorizado', unauthorized: true };
    }

}

function JwtVerify(token) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, 'secretKey', (error, authData) => {
            if (error) {
                resolve(false);
            } else {
                resolve(authData);
            }
        });
    });
}

module.exports = {
    verifyToken,
    JwtVerify
}