import axios from "axios";
import { z } from "zod";

const rentCinemaSeatSchema = z.object({
    filmSessionId: z.number().int(),
    seatRowIndex: z.number().int(),
    seatIndex: z.number().int()
}).superRefine(async (value, ctx) => {
    const {filmSessionId, seatRowIndex, seatIndex} = value
    const filmSession = await axios.get(`http://127.0.0.1:8000/filmSessions/${filmSessionId}/`)
    const seatOwned = filmSession.data.seats.seats[seatRowIndex][seatIndex].slice(0, 1) === "O" ? true : false 

    if (seatOwned) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Это место уже занято!"
        })
    }
})

export { rentCinemaSeatSchema };