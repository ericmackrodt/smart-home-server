export default class BaseController {
  get channel() {
    return this._channel;
  }

  constructor(channel) {
    this._channel = channel;
  }

  receiveMessage(m) {
    if (m.channel !== this._channel) {
      return;
    }
    console.log(m)
    this[m.message.function](m.message);
  }
}
