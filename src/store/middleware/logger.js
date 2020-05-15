const logger = param => store => next => action => {
    console.log('Logging..', param);
    return next(action);
};

export default logger;

/**
 *
 * "Curried function"
 * Currying is a techinque where you have a function with
 * 'N' parameters maps to bunch of functions with single parameter.
 */