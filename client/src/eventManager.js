import { constants } from './constants.js';

export default class EventManger {
  constructor({ componentEmitter, socketClient }) {
    this.componentEmitter = componentEmitter;
    this.socketClient = socketClient;
  }

  joinRoomAndWaitForMessages(data) {
    this.socketClient.sendMessage(constants.events.socket.JOIN_ROOM, data);

    this.componentEmitter.on(constants.events.app.MESSAGE_SET, (msg) => {
      this.socketClient.sendMessage(constants.events.socket.MESSAGE, msg);
    });
  }
}
