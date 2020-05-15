
import reducer from './reducer';
function createStore(reducer) {
    let state;
    const listeners = [];
    function getState() {
        return state;
    }
    function subscribe(listener) {
        listeners.push(listener);
    }
    function dispatch(action) {
        //call the reducer to update the state.
        state = reducer(state, action);
        //Notify all the subscribers.
        for (const listener of listeners) {
            listener();
        }
    }
    return {
        getState,
        subscribe,
        dispatch
    }
}

export default createStore(reducer);