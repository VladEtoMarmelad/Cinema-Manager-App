import { z } from "zod";

const cinemaRoomSchema = z.object({
    seats: z.array(
        z.array(
            z.string()
        ).min(1, "В каждом ряду должно быть хотя-бы 1 сидение")
    ).min(1, "Должен быть хотя-бы 1 ряд сидений")
})

export { cinemaRoomSchema };