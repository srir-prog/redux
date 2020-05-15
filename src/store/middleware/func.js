const func = ({ getState, dispatch }) => next => action => {
    if (typeof action === 'function') {
        action(dispatch, getState);
    } else {
        next(action);
    }
};

export default func;