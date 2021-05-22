import ComponentsBuilder from './components.js';

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

  #registerEvents(eventEmitter, components) {
    eventEmitter.on('messager:received', this.#onMessageReceived(components));
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

    setInterval(() => {
      eventEmitter.emit('messager:received', {
        message: 'Hey',
        userName: 'Francisco',
      });

      eventEmitter.emit('messager:received', {
        message: 'Ho 😍',
        userName: 'Maria',
      });
    }, 2000);
  }
}
