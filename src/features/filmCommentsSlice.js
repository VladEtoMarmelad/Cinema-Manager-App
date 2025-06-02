import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { redirect } from 'next/navigation';
import { URLSlice } from '@/URLSlice.mjs';
import { z } from 'zod';
import { filmCommentSchema } from '@/zod/filmCommentSchema';
import axios from 'axios'; 

const pathchFilmRating = async (movieId) => {
    const response = await axios.get("http://127.0.0.1:8000/comments/", {params: {
        movieId: URLSlice(movieId, 29)
    }});
    const allFilmComments = response.data
    
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

    let response = await axios.get("http://127.0.0.1:8000/comments/", {params: {
        movieId: movieId
    }});
    response = response.data;

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
    try {
        await filmCommentSchema.parseAsync(commentData)

        await axios.post("http://127.0.0.1:8000/comments/", commentData)
        pathchFilmRating(commentData.movieId)
    } catch (error) {
        if (error instanceof z.ZodError) {
            const validationErrors = []

            for (let i=0; i<error.errors.length; i+=1) {
                validationErrors.push(error.errors[i].message)
            }

            return validationErrors
        } else {
            console.error("Unexpected error:", error);
        }
    }
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
        error: null,
        validationErrors: []
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
                state.validationErrors = [];
            })
            .addCase(addComment.fulfilled, (state, action) => {
                if (action.payload) {
                    state.validationErrors = action.payload
                }
            })
            .addCase(addComment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
});

export default filmCommentsSlice.reducer;