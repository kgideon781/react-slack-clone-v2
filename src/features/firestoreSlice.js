import { createSlice } from '@reduxjs/toolkit';

export const firestoreSlice = createSlice({
    name: 'firestore',

    initialState: {
        hideBadge: null,
    },
    reducers: {
        showBadge: (state, action) => {
            state.hideBadge =  action.payload.hideBadge;
        },
    },
});

export const { showBadge } = firestoreSlice.actions;



// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const setBadge = state => state.badges.hideBadge;

export default firestoreSlice.reducer;
