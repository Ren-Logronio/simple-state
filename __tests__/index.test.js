describe("SimpleState", () => {
    let SimpleState;

    // for every test
    beforeEach(() => {
        SimpleState = require("../index");
    });

    describe("initialization", () => {
        it("should be a function", () => {
            expect(typeof SimpleState).toBe("function");
        });
    
        it("should take a value and return an object", () => {
            const state = SimpleState(0);
            expect(typeof state).toBe("object");
        });
    
        it("should return a new object when called", () => {
            const state1 = SimpleState(0);
            const state2 = SimpleState(0);
            expect(state1).not.toBe(state2);
        });
    
        it("should be valueof the initial value", () => {
            const state = SimpleState(0);
            expect(state.valueOf()).toBe(0);
        });
    });

    describe("instance setter/getter", () => {
        it("should change value according to the set method", () => {
            const state = SimpleState(0);
            state.set(1);
            expect(state.valueOf()).toBe(1);
        });

        it("should return the value according to the get method", () => {
            const state = SimpleState(0);
            state.set(1);
            expect(state.get()).toBe(1);
        });

        it("should be able to set a string value", () => {
            const state = SimpleState(0);
            state.set("hello");
            expect(state.valueOf()).toBe("hello");
        });

        it("should be able to set a boolean value", () => {
            const state = SimpleState(0);
            state.set(true);
            expect(state.valueOf()).toBe(true);
        });

        it("should be able to set a number value", () => {
            const state = SimpleState("test");
            state.set(1);
            expect(state.valueOf()).toBe(1);
        });
    });

    describe("derived state", () => {
        it("should be able to derive state", () => {
            const state = SimpleState(10);
            const derivedState = state.derive((state) => state * 2);
            expect(derivedState.valueOf()).toBe(20);
        });

        it("should update derived state when parent state changes", () => {
            const state = SimpleState(10);
            const derivedState = state.derive((state) => state * 2);
            expect(derivedState.valueOf()).toBe(20);
            state.set(20);
            setTimeout(() => {
                expect(derivedState.valueOf()).toBe(40);
            }, 1000);
        });

        it("should be able to derive state from derived state", () => {
            const state = SimpleState(10);
            const derivedState = state.derive((state) => state * 2);
            const derivedState2 = derivedState.derive((state) => state * 2);
            setTimeout(() => {
                expect(derivedState2.valueOf()).toBe(40);
            }, 1000);
        });
    });

    describe("actions", () => {
        it("should be able to perform actions on the state", () => {
            const state = SimpleState(10);
            const action = state.action((state, value) => state + value);
            action(10);
            expect(state.valueOf()).toBe(20);
        });
    });

    describe("bindings", () => {
        it("should bind to an input element", () => {
            document.body.innerHTML = "<input id='input' />";
            const state = SimpleState(0);
            state.bind("#input");
            const input = document.getElementById("input");
            input.value = 10;
            input.dispatchEvent(new Event("input"));
            expect(state.valueOf()).toBe(10);
        });

        it("should bind to an element", () => {
            document.body.innerHTML = "<div id='div'></div>";
            const state = SimpleState(0);
            state.bind("#div");
            const div = document.getElementById("div");
            div.innerText = 10;
            setTimeout(() => {
                expect(state.valueOf()).toBe(10);
            }, 1000);
        });

        it("should bind to an element and update the element", () => {
            document.body.innerHTML = "<div id='div'></div>";
            const state = SimpleState(0);
            state.bind("#div");
            state.set(10);
            setTimeout(() => {
                const div = document.getElementById("div");
                expect(div.innerText).toBe("10");
            }, 1000);
        });
    });

    describe("id", () => {
        it("should return the id of the state", () => {
            const state = SimpleState(0);
            expect(state.id()).toBeTruthy();
        });

        it("should have states with different ids", () => {
            const state1 = SimpleState(0);
            const state2 = SimpleState(0);
            expect(state1.id()).not.toBe(state2.id());
        });

        it("should return true if id is the same", () => {
            const state = SimpleState(0);
            expect(state.id(state.id())).toBeTruthy();
        });
    });

});