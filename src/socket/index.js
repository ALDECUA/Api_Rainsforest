const options = { cors: { origin: '*' } };
const io = require('socket.io')(options);
const { app } = require('../../server');
let users = [];
const events = {};
const co = require('co');
const fs = require('fs');

function setUsers(users) {
    //fs.writeFileSync('./socket/users.json', JSON.stringify(users));
}

io.on('connection', (socket) => {
    console.log(socket.id);
    socket.emit('hola', {});
    /*socket.on('tokenSocket', (data) => {
        users.push({ socket: socket.id, data });
        setUsers(users);
    });
    socket.on('disconnect', () => {
        console.log(`Socket: ${socket.id} is disconnected`);
        users = users.filter(user => user.socket !== socket.id);
        setUsers(users);
    });
    //Envia petición para que la app de seguridad mande sus datos de usuario
    socket.emit('securityConnect', {});

    socket.on('action', (action, cb) => {
        const { type, data } = action;
        const event = events[type];
        const callback = cb ? cb : resp => socket.emit('action', resp);

        if (event) {
            co(event.bind(socket, data, socket.id)).then(result => callback({
                type: `${type}_SUCCESS`,
                result
            })).catch(error => callback({
                type: `${type}_FAIL`,
                error: [error, error.stack]
            }));
        }
    });*/
});

const on = (event, fn) => {
    if (events[event]) {
        throw new Error(`Sockets: Already listening to ${event}.`);
    }
    events[event] = fn;
};

module.exports = new Proxy(io, {
    get: (target, property) => {
        if (property === 'on') {
            return on;
        }

        return target[property];
    }
});