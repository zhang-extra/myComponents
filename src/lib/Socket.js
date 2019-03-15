import io from 'socket.io-client';
import assign from 'lodash/assign';
import find from 'lodash/find';

export default class Socket {
  constructor(url, user) {
    this.socket = io(url, {
      query: {
        userId: user.id,
        appId: user.appId
      },
      autoConnect: false
    });
  }

  createRoom(room, callback) {
    this.socket.emit('rooms:create', room, callback);
  }

  getRooms(callback) {
    this.socket.emit('rooms:list', (rooms) => {
      console.log('getRooms:', rooms)
      callback(rooms);
    });
  }

  joinRoom(roomId, callback) {
    this.socket.emit('rooms:join', roomId, callback);
  }

  sendMessage(message) {
    this.socket.emit('messages:create', message);
  }

  getMessages(query, callback) {
    this.socket.emit('messages:list', query, callback);
  }

  listen(events = {}) {
    this.socket.on('connect', () => {
      // TODO:
      // 获取 rooms,
      this.getRooms(events.setRooms)
      if (events.onConnect) {
        events.onConnect();
      }
    });
    this.socket.on('reconnect', () => {
      // TODO:重新加入room
      if (events.onReConnect) {
        events.onReConnect();
      }
    });
    this.socket.on('messages:new', events.onNewMessage);
    this.socket.on('rooms:new', (data) => {

    });
    this.socket.on('rooms:update', (room) => {

    });
    this.socket.on('rooms:archive', (room) => {

    });
    this.socket.on('users:join', (user) => {

    });
    this.socket.on('users:leave', (user) => {

    });
    this.socket.on('users:update', (user) => {

    });
    this.socket.on('files:new', events.onNewFile);
    this.socket.on('disconnect', () => {

    });
    this.socket.connect();
  }
}

