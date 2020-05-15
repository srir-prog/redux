import configureStore from './store/configureStore';
import { createStore, applyMiddleware } from 'redux';
import { projectAdded } from './store/projects';
import { userAdded } from './store/users';
import { loadBugs, assignBugToUser, resolveBug, addBug, getUnResolvedBugs, getBugsAssignedToUsers } from './store/bugs';
import reducer from './store/reducer';
import logger from './store/middleware/logger';
import * as Actions from './store/api';


const store = configureStore(); //With redux toolkit

//const store = createStore(reducer, applyMiddleware(logger)); //Without using redux toolkit.

store.subscribe(() => {
    //console.log('Store got updated!');
});

//store.dispatch(addBug({ description: 'aaa' }));
store.dispatch(loadBugs());
// setTimeout(() => {
//     store.dispatch(resolveBug(1));
// }, 2000);
setTimeout(() => {
    store.dispatch(assignBugToUser(1, 4));
}, 2000);

// setTimeout(() => {
//     store.dispatch(loadBugs());
// }, 2000);


//store.dispatch(Actions.apiCallBegan({ url: '/bugs', onSuccess: 'bugs/bugsReceived' }));


// store.dispatch(
//     // (dispatch, getState) => {
//     //     dispatch({ type: 'bugsReceived', bugs: [1, 2, 3] });
//     //     console.log(getState());
//     // }
//     {
//         type: Actions.apiCallBegan.type,
//         payload: {
//             url: '/bugs',
//             //method: 'get',
//             //data: {},
//             onSuccess: 'bugsReceived',
//             onError: 'apiRequestFailed'
//         }
//     });

//store.dispatch(userAdded({ name: 'User 1' }));
// store.dispatch(userAdded({ name: 'User 2' }));
// store.dispatch(projectAdded({ name: 'Project 1' }));
// store.dispatch(projectAdded({ name: 'Project 2' }));
// store.dispatch(projectAdded({ name: 'Project 3' }));

// store.dispatch(bugAdded({ description: 'Bug 1' }));
// store.dispatch(bugAdded({ description: 'Bug 2' }));
// store.dispatch(bugAdded({ description: 'Bug 3' }));
// store.dispatch(bugAdded({ description: 'Bug 4' }));

// store.dispatch(bugAssignedToUser({ userId: 1, bugId: 1 }));
// store.dispatch(bugAssignedToUser({ userId: 1, bugId: 3 }));

// store.dispatch(bugResolved({ id: 1 }));
// console.log('Bugs', store.getState());

//const unResolvedBugs = getUnResolvedBugs(store.getState());
//console.log('Un ResolvedBugs', unResolvedBugs);

//const bugsAssignedToUsers = getBugsAssignedToUsers(1)(store.getState());
//console.log('Bugs assigned to users', bugsAssignedToUsers);

