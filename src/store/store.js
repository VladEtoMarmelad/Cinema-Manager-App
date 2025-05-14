import { configureStore } from '@reduxjs/toolkit';
import filmsReducer from '../features/filmsSlice';
import filmCommentsReducer from '@/features/filmCommentsSlice';
import filmInteractReducer from '@/features/filmInteractSlice';
import cinemaReducer from "@/features/cinemaSlice";
import usersReducer from "@/features/usersSlice"

export const store = configureStore({
    reducer: {
        films: filmsReducer,
        filmComments: filmCommentsReducer,
        filmInteract: filmInteractReducer,
        cinema: cinemaReducer,
        users: usersReducer
    }
});
