import { configureStore } from '@reduxjs/toolkit';
import filmsReducer from '../features/filmsSlice';
import filmCommentsReducer from '@/features/filmCommentsSlice';

export const store = configureStore({
    reducer: {
        films: filmsReducer,
        filmComments: filmCommentsReducer
    }
});
