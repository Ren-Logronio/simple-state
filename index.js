
class SimpleState {

  constructor() {
    this.state = {};
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = newState;
  }
}

module.exports = SimpleState;