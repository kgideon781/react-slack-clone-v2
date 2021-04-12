import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../features/appSlice';
import firestoreReducer from '../features/firestoreSlice'

export default configureStore({
  reducer: {
    app: appReducer,
    badges: firestoreReducer,
  },
});
