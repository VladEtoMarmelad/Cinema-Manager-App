import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; 
import { redirect } from 'next/navigation';

const URLSlice = (url, lettersBeforeID) => {
    let slicedURL = url.slice(lettersBeforeID)
    slicedURL = slicedURL.slice(0, -1)
    slicedURL = Number(slicedURL)
    return slicedURL
}

export const fetchComments = createAsyncThunk("films/fetchComments", async (movieId) => {
    
    let response = await axios.get("http://127.0.0.1:8000/comments/");
    response = response.data;
    response = response.filter(comment => URLSlice(comment.movieId, 29) === movieId);

    for (let i=0; i<response.length; i+=1) {
        let user = await axios.get(response[i].userId)
        user = user.data
        delete user.password;
        delete user.admin;
        response[i].user = user
    }

    console.log(response)
    return response;
})

const filmCommentsSlice = createSlice({
    name: "filmComments",
    initialState: {
        comments: [],
        status: "idle",
        error: null
    },
    reducers: {
        addComment: (state, action) => {
            axios.post("http://127.0.0.1:8000/comments/", action.payload)
            redirect("/")
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.comments = action.payload;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
});

export default filmCommentsSlice.reducer;
export const { addComment } = filmCommentsSlice.actions;