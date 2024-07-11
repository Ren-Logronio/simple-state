const SimpleState = (function () {
  const hash = () => {
    return btoa(Math.random() * Number.MAX_SAFE_INTEGER);
  };
  const debounceCallback = (func, wait = 250) => {
    let timeout;

    return function (...args) {
      const context = this;
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  };

  // Private instance variable
  let instanceId = hash();
  let instance;
  const simpleStateSet = new Set();

  // Constructor function
  function SimpleState(value) {
    if (instance) {
      const dispatchedStateValue = new DispatchedSimpleState(value, instance);
      simpleStateSet.add(dispatchedStateValue);
      return dispatchedStateValue;
    }
    instance = this;
    const dispatchedStateValue = new DispatchedSimpleState(value, {
      instance,
    });
    simpleStateSet.add(dispatchedStateValue);
    return dispatchedStateValue;
  }

  function DispatchedSimpleState(value, config) {
    let id = hash();
    let state = value;
    let singleInstance = config?.instance;
    let numberTypeCoercion = typeof value === "number";
    let effects = [];
    const bindingElements = new Set();

    const updateDom = (value) => {
      bindingElements.forEach((element) => {
        Array.from(document.querySelectorAll(element)).forEach((el) => {
          if (el.tagName === "INPUT") {
            el.value = value;
            return;
          }

          el.innerText = value;
        });
      });
    };

    this.id = (compareId) => {
      return compareId === id ? true : id;
    };

    this.get = () => {
      return state;
    };

    this.set = (value) => {
      if (numberTypeCoercion && !Number.isNaN(Number(value)) && typeof value !== "boolean") {
        value = Number(value);
      } else {
        numberTypeCoercion = typeof value === "number";
      }
      effects.forEach((effect) => {
        effect(value);
      });
      updateDom(value);
      state = value;
    };

    this.derive = (callback) => {
      const derivedValue = callback(state);
      const derivedSimpleState = new SimpleState(derivedValue);
      const derivedCallback = debounceCallback((state) =>
        derivedSimpleState.set(callback(state))
      );
      effects.push(derivedCallback);
      return derivedSimpleState;
    };

    this.action = (callback) => {
      const instance = this;
      return (stagedValue) => {
        const derivedStateFromAction = callback(state, stagedValue);
        instance.set(derivedStateFromAction);
      };
    };

    this.bind = (selector, config = {}) => {
      const instance = this;
      bindingElements.add(selector);
      const inputs = Array.from(document.querySelectorAll(selector)).filter(
        (el) => el.tagName === "INPUT"
      );
      inputs.forEach((input) => {
        input.oninput = (e) => {
          instance.set(e.target.value);
        };
      });
      updateDom(state);
    };

    this.valueOf = () => {
      return state;
    };
  }

  return SimpleState;
})();

module.exports = SimpleState;