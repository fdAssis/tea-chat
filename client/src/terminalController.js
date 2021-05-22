import ComponentsBuilder from './components.js';

export default class TerminalController {
  constructor() {}

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
      chat.addItem(`{bold}${userName}{/}:${message}`);
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
        message: 'Ho',
        userName: 'Maria',
      });
    }, 2000);
  }
}
