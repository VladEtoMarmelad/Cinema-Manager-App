import { z } from "zod";
import { isBefore } from "date-fns";

const filmSessionSchema = z.object({
    cinemaId: z.string(),
    roomId: z.string(),
    film: z.string(),
    sessionTime: z.string()
}).superRefine((val, ctx) => {
    const now = new Date()
    if ( isBefore(val.sessionTime, now) ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Невозможно добавить киносессию, которая уже прошла"
        })
    }
})

export { filmSessionSchema };