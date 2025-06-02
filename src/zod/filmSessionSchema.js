import { z } from "zod";

const filmSessionSchema = z.object({
    roomId: z.string(),
    film: z.string(),
    sessionTime: z.iso.datetime()
})

export { filmSessionSchema };