import { createAction, createReducer, createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { apiCallBegan } from './api';
import moment from 'moment';
//Action types.
// const BUG_ADDED = "bugAdded";
// const BUG_REMOVED = "bugRemoved";
// const BUG_RESOLVED = "bugResolved";

//Action creators.
// export const addBug = (description) => ({
//     type: BUG_ADDED,
//     payload: {
//         description
//     }
// });
//////export const bugAdded = createAction('bugAdded');
// export const removeBug = (id) => ({
//     type: BUG_REMOVED,
//     payload: {
//         id
//     }
// });
///////export const bugRemoved = createAction('bugRemoved');

// export const resolveBug = (id) => ({
//     type: BUG_RESOLVED,
//     payload: {
//         id
//     }
// });
//////export const bugResolved = createAction('bugResolved');

//Reducer.
let index = 0;
const slice = createSlice({
    name: 'bugs',
    initialState: {
        list: [],
        loading: false,
        lastFetch: null
    },
    reducers: {

        bugsRequested: (bugs, action) => {
            bugs.loading = true;
        },
        bugsRequestFailed: (bugs, action) => {
            bugs.loading = false;
        },
        bugsReceived: (bugs, action) => {
            bugs.list = action.payload;
            bugs.loading = false;
            bugs.lastFetch = Date.now();
        },

        bugAssignedToUser: (bugs, action) => {
            const { id: bugId, userId } = action.payload;
            const index = bugs.list.findIndex(bug => bug.id === bugId);
            bugs.list[index].userId = userId;
        },
        bugAdded: (bugs, action) => {
            // bugs.list.push({
            //     id: ++index,
            //     description: action.payload.description,
            //     resolved: action.payload.resolved || false
            // });
            bugs.list.push(action.payload);
        },
        bugResolved: (bugs, action) => {
            const index = bugs.list.findIndex(bug => bug.id === action.payload.id);
            bugs.list[index].resolved = true;
        },
        bugRemoved: (bugs, action) => {
            const index = bugs.list.findIndex(bug => bug.id === action.payload.id);
            bugslist.splice(index, 1);
        }
    }
});

//console.log(slice);
export const { bugAdded, bugResolved, bugRemoved, bugAssignedToUser, bugsReceived, bugsRequested, bugsRequestFailed } = slice.actions;
export default slice.reducer;

//Selector - A function that takes a state and returns a computated state.
// export const getUnResolvedBugs = (state) => {
//     return state.entities.bugs.filter(bug => !bug.resolved);
// }

/**
 * Using reselectors.
 */

export const getUnResolvedBugs = createSelector(
    state => state.entities.bugs,
    bugs => bugs.list.filter(bug => !bug.resolved)
);

export const getBugsAssignedToUsers = userId =>
    createSelector(
        state => state.entities.bugs,
        bugs => bugs.list.filter(bug => bug.userId === userId)
    );

//Action creators.
const url = '/bugs';
export const loadBugs = () => (dispatch, getState) => {
    const { lastFetch } = getState().entities.bugs;
    const diffInMins = moment().diff(moment(lastFetch), 'minutes');
    console.log(diffInMins);
    if (diffInMins < 1) return;
    dispatch(apiCallBegan({
        url,
        onStart: bugsRequested.type,
        onSuccess: bugsReceived.type,
        onError: bugsRequestFailed.type
    }));
};

export const addBug = bug => (
    apiCallBegan({
        url,
        method: 'post',
        data: bug,
        onSuccess: bugAdded.type
    })
);

export const assignBugToUser = (bugId, userId) => apiCallBegan({
    url: `${url}/${bugId}`,
    method: 'patch',
    data: { userId },
    onSuccess: bugAssignedToUser.type
});

export const resolveBug = id => apiCallBegan({
    url: `${url}/${id}`,
    method: 'patch',
    data: { resolved: true },
    onSuccess: bugResolved.type
});

// export const loadBugs = () => apiCallBegan({
//     url,
//     onStart: bugsRequested.type,
//     onSuccess: bugsReceived.type,
//     onError: bugsRequestFailed.type
// });


// createReducer([], {
//     [bugAdded.type]: (bugs, action) => {
//         bugs.push({
//             id: ++index,
//             description: action.payload.description,
//             resolved: action.payload.resolved || false
//         });
//     },
//     [bugResolved.type]: (bugs, action) => {
//         const index = bugs.findIndex(bug => bug.id === action.payload.id);
//         bugs[index].resolved = true;
//     },
//     [bugRemoved.type]: (bugs, action) => {
//         const index = bugs.findIndex(bug => bug.id === action.payload.id);
//         bugs.splice(index, 1);
//     }

// });
//export default function reducer(state = [], action) {
    // switch (action.type) {
    //     //case BUG_ADDED:
    //     case addBug.type:
    //         return [
    //             ...state,
    //             {
    //                 id: ++index,
    //                 description: action.payload.description,
    //                 resolved: action.payload.resolved || false
    //             }
    //         ];
    //     //case BUG_REMOVED:
    //     case removeBug.tyoe:
    //         return state.filter(item => item.id !== action.payload.id);
    //     //case BUG_RESOLVED:
    //     case resolveBug.type:
    //         return state.map(bug => (bug.id !== action.payload.id) ? bug : { ...bug, resolved: true });
    //     default:
    //         return state;
    // }
//}