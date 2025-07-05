import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fromDBTimeFormat } from '@/utils/dateConverter';
import { URLSlice } from '@/utils/URLSlice.mjs';
import { isBefore } from 'date-fns';
import axios from 'axios';

export const getUserTickets = createAsyncThunk("tickets/get", async (userId) => {
    let userTickets = await axios.get("http://127.0.0.1:8000/filmTickets/", {
        params: {userId}
    })
    userTickets = userTickets.data
    userTickets = await Promise.all(
        userTickets.map(async (ticket) => {
            let filmSession = await axios.get(ticket.filmSessionId)
            filmSession = filmSession.data
            const filmData = await axios.get(filmSession.film)
            const cinemaData = await axios.get(filmSession.cinemaId)

            return {
                ...ticket,
                DBTime: filmSession.sessionTime,
                sessionTime: fromDBTimeFormat(filmSession.sessionTime),
                film: filmData.data,
                cinemaName: cinemaData.data.name,
                roomId: URLSlice(filmSession.roomId, 34),
            };
        })
    )

    let sortedTickets = {
        "used": [],
        "notUsed": []
    }
    const now = new Date();
    for (let i=0; i<userTickets.length; i+=1) {
        const ticket = userTickets[i]
        if (isBefore(ticket.DBTime, now)) {
            sortedTickets.used.push(ticket)
        } else {
            sortedTickets.notUsed.push(ticket)
        }
    }

    console.log(sortedTickets)
    return sortedTickets
})

const filmTicketSlice = createSlice({
    name: "filmTicket",
    initialState: {
        filmTickets: {},
        status: "idle",
        error: null
    },
    reducers: {
        deleteUsedTicket: (state) => {
            const usedTickets = state.filmTickets.used
            for (let i=0; i<usedTickets.length; i+=1) {
                axios.delete(`http://127.0.0.1:8000/filmTickets/${usedTickets[i].id}/`)
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserTickets.pending, (state) => {
                state.status = "loading"
            })
            .addCase(getUserTickets.rejected, (state, action) => {
                state.error = action.error.message
            })
            .addCase(getUserTickets.fulfilled, (state, action) => {
                state.filmTickets = action.payload
            })
    }
});

export default filmTicketSlice.reducer;
export const { deleteUsedTicket } = filmTicketSlice.actions;