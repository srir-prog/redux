// import { createStore } from 'redux';
// import { devToolsEnhancer } from 'redux-devtools-extension';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import reducer from './reducer';
import logger from './middleware/logger';
import func from './middleware/func';
import error from './middleware/error';
import api from './middleware/api';

export default function () {
    //const store = createStore(reducer, devToolsEnhancer({ trace: true }));
    const store = configureStore({
        reducer,
        middleware: [
            ...getDefaultMiddleware(),
            //logger({ destination: 'console' }),
            error,
            api
        ],
    });
    return store;
};
