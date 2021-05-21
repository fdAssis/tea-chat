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

  async itializeTable(eventEmitter) {
    const components = new ComponentsBuilder()
      .setScreen({ title: 'TeaChat' })
      .setLayoutComponent()
      .setInputComponent(this.#onInputRecevied(eventEmitter))
      .build();

    components.input.focus();
    components.screen.render();
  }
}
