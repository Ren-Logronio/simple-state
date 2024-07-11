# simple-state v0.0.1 pre-alpha

SimpleState is a super simple state management library designed in hopes to get reactivity as close to vanilla web development.

###### Key Features

- declaring state via SimpleState class
- get and set methods
- observer like pattern with state binding with the dom
- derived states that changes automatically upon state change
- state actions
- no other dependencies required (right now)

###### Usage

**Creating a state**

```javascript
const count = new SimpleState(0);
```

**Getter and Setter**

```javascript
count.set(12);

console.log(count.get()); // 12
console.log(count + 3); // 15
```

**State Binding**

To bind a state and its changes to a dom element, the method bind(_selector_) is used

> make sure that this method is called after the dom has been loaded

```javascript
document.addEventListener("DOMContentLoaded", () => {
  count.bind("#counter"); // binds to element with id 'counter'
  count.bind(".display"); // binds to all element with class 'display'
  count.set(10); // will update the content of the binded elements accordingly
});
```

**Derived Values**

You can get derived state from an existing state, where the changes propagate accordingly, you can go as far as you want with derived state

> the derived state is another instance of SimpleState which depends on the another deriving SimpleState instance

```javascript
const countIsOdd = count.derive((state) => state % 2 == 1);

count.set(3);
console.log(countIsOdd); // true

count.set(2);
console.log(countIsOdd); // false
```

**Actions**

You can essentially simplify how you change your states through actions, which returns a function that you'd call to simplify your process

```javascript
const increment = count.action(state => state + 1);
const decrement = count.action(state => state - 1);
const incrementByValue = const.action((state, stagedValue) => state + stagedValue);

count.set(1);
console.log(count); // 1

increment();
console.log(count); // 2

decrement();
console.log(count); // 1

incrementByValue(10);
console.log(count); // 11
```

for multiple values you can use object deconstruction

```javascript
const divideByXMultiplyByY = const.action((state, {x, y}) => (state / x) * y);

divideByXMultiplyByY({x: 2, y: 5});
```

### Future Progress

- state coupling
- asynchronous promised state
- easier dom templating based on state
- easier method linking styles and animation with state
- browser native input support
- jquery support
- lit support
- optimizations
