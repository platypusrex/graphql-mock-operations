export const createOperation = (name, state) => (action) => ({
    [name]: (parent, variables, context, info) => {
        const currentState = action[name] ? action[name] : 'SUCCESS';
        let currentStateObj = typeof state === 'function' ? state(parent, variables, context, info) : state;
        currentStateObj = [...currentStateObj].find((s) => s.state === currentState);
        if (!currentStateObj) {
            throw new Error(`${name} operation: unable to match state`);
        }
        const { value } = currentStateObj;
        return typeof value === 'function' ? value() : value;
    },
});
//# sourceMappingURL=createOperation.js.map