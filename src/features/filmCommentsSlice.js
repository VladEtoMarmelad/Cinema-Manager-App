import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; 
import { redirect } from 'next/navigation';
import { URLSlice } from '@/URLSlice.mjs';

const pathchFilmRating = async (movieId) => {

    if (typeof movieId === "number") {
        movieId = `http://127.0.0.1:8000/movies/${movieId}/`
    }

    let response = await axios.get("http://127.0.0.1:8000/comments/");
    response = response.data;
    const allFilmComments = response.filter(comment => comment.movieId === movieId);
    
    let rating = 0
    for (let i=0; i<allFilmComments.length; i+=1) {
        rating = rating + allFilmComments[i].rating
    }
    if (allFilmComments.length>0) {
        rating = rating/allFilmComments.length
    }
    rating = Math.trunc(rating)

    axios.patch(movieId, {rating})
    redirect("/")
}

export const fetchComments = createAsyncThunk("films/fetchComments", async (data) => {
    const {movieId, userId} = data 

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

    if (userId) {
        const firstComment = response.find(comment => comment.user.id === userId)
        if (firstComment) {
            response = response.filter(comment => comment.id !== firstComment.id)
            response.unshift(firstComment)
        }
    }

    return response;
})

export const addComment = createAsyncThunk("films/addComment", async (commentData) => {
    await axios.post("http://127.0.0.1:8000/comments/", commentData)
    pathchFilmRating(commentData.movieId)
})

export const deleteComment = createAsyncThunk("films/deleteComment", async (commentData) => {
    await axios.delete(`http://127.0.0.1:8000/comments/${commentData.commentId}/`)
    pathchFilmRating(commentData.movieId)
})

const filmCommentsSlice = createSlice({
    name: "filmComments",
    initialState: {
        comments: [],
        status: "idle",
        error: null
    },
    reducers: {},
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

            .addCase(addComment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addComment.fulfilled, (state) => {
                state.status = 'loading';
            })
            .addCase(addComment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
});

export default filmCommentsSlice.reducer;