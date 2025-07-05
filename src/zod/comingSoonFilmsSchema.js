import axios from "axios";
import { z } from "zod";

const comingSoonFilmsSchema = z.object({
    closestSessionTime: z.date().min(new Date(), "Выберите нормальную дату"),
    cinemaId: z.number().int(),
    filmId: z.number("Убедитесь, что вы выбрали фильм").int()
}).superRefine(async (value, ctx) => {
    const filmWithSameCinema = await axios.get("http://127.0.0.1:8000/cinemaComingSoonFilms/", {
        params: {
            cinemaId: value.cinemaId,
            filmId: value.filmId
        }
    })
    const comingSoonFilmExists = filmWithSameCinema.data.length > 0 ? true : false 

    if (comingSoonFilmExists) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Этот фильм уже добавлен в список "Скоро в прокате" вашего кинотеатра`
        })
    }
})

export { comingSoonFilmsSchema };