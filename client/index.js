#!/usr/bin/env node

/*
npm i -g @francisco_o_deassis/tea-chat-client

npm unlink -g @francisco_o_deassis/tea-chat-client

tea-chat \
  --username francisco \
  --room sala01

./index.js \
  --username francisco \
  --room sala01

node index.js \
  --username francisco \
  --room sala01
  -- hostUri
*/


import Events from 'events';
import TerminalController from './src/terminalController.js';
import CliConfig from './src/cliConfig.js';
import SocketClient from './src/socket.js';
import EventManager from './src/eventManager.js';

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);
//console.log({ config });

const componentEmitter = new Events();
const socketClient = new SocketClient(config);
await socketClient.initialize();
const eventManager = new EventManager({ componentEmitter, socketClient });
const events = eventManager.getEvents();
socketClient.attachEvents(events);
const data = {
  roomId: config.room,
  userName: config.username,
};
eventManager.joinRoomAndWaitForMessages(data);

const controller = new TerminalController();
await controller.itializeTable(componentEmitter);
