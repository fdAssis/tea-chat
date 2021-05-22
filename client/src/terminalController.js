import ComponentsBuilder from './components.js';
import { constants } from './constants.js';

export default class TerminalController {
  #usersCollors = new Map();

  constructor() {}

  // Gerar cores RGB altomaticas **code for stack overflow**
  #pickCollor() {
    return `#${(((1 << 24) * Math.random()) | 0).toString(16)}-fg`;
  }

  #getUserCollor(userName) {
    if (this.#usersCollors.has(userName)) {
      return this.#usersCollors.get(userName);
    }

    const collor = this.#pickCollor();
    this.#usersCollors.set(userName, collor);

    return collor;
  }

  #onInputRecevied(eventEmitter) {
    return function () {
      const message = this.getValue();
      console.log(message);
      this.clearValue();
    };
  }

  #onMessageReceived({ screen, chat }) {
    return (msg) => {
      const { userName, message } = msg;
      const collor = this.#getUserCollor(userName);

      chat.addItem(`{${collor}}{bold}${userName}{/}:${message}`);
      screen.render();
    };
  }

  #onLogChaged({ screen, activityLog }) {
    return (msg) => {
      // francisco left
      // francisco join

      const [userName] = msg.split(/\s/);
      const collor = this.#getUserCollor(userName);
      activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`);

      screen.render();
    };
  }

  #onStatusChaged({ screen, status }) {
    // ['francisco', 'maria']
    return (users) => {
      //Vamos pegar o primeiro elemento da lista
      const { content } = status.items.shift();
      status.clearItems();
      status.addItem(content);

      users.forEach((userName) => {
        const collor = this.#getUserCollor(userName);
        status.addItem(`{${collor}}{bold}${userName}{/}`);
      });

      screen.render();
    };
  }

  #registerEvents(eventEmitter, components) {
    eventEmitter.on(
      constants.events.app.MESSAGE_RECEIVED,
      this.#onMessageReceived(components)
    );
    eventEmitter.on(
      constants.events.app.ACTIVITYLOG_UPDATED,
      this.#onLogChaged(components)
    );
    eventEmitter.on(
      constants.events.app.STATUS_UPDATED,
      this.#onStatusChaged(components)
    );
  }

  async itializeTable(eventEmitter) {
    const components = new ComponentsBuilder()
      .setScreen({ title: 'TeaChat' })
      .setLayoutComponent()
      .setInputComponent(this.#onInputRecevied(eventEmitter))
      .setChatComponent()
      .setActivityLogComponent()
      .setStatusComponent()
      .build();

    this.#registerEvents(eventEmitter, components);

    components.input.focus();
    components.screen.render();

    // --------------------------- Mini testes -----------------------------
    //----------------------------------------------------------------------

    /** 
     * Teste eventEmitter: 'messager:receive'
     * 
      setInterval(() => {
        eventEmitter.emit('messager:receive', {
          message: 'Hey',
          userName: 'Francisco',
        });

        eventEmitter.emit('messager:received', {
          message: 'Ho 😍',
          userName: 'Maria',
        });
      }, 2000);
    */

    /**
     * Teste eventEmitter: 'activityLog:updated'
     * 
      setInterval(() => {
      eventEmitter.emit('activityLog:updated', 'francisco join');
      eventEmitter.emit('activityLog:updated', 'francisco left');
      eventEmitter.emit('activityLog:updated', 'maria join');
      eventEmitter.emit('activityLog:updated', 'maria left');
      eventEmitter.emit('activityLog:updated', 'pedro join');
      eventEmitter.emit('activityLog:updated', 'pedro lrft');
    }, 2000);
    */

    /** 
     * Teste eventEmitter: 'status:updated'
      const users = ['franisco'];
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
      users.push('maria');
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
      users.push('pedro');
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
      users.push('joao');
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
    */
  }
}
