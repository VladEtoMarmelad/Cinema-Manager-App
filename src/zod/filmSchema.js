import { z } from 'zod';

const filmSchema = z.object({
    name: z.string().min(1, "Убедитесь, что поле названия заполнено"),
    description: z.string().min(1, "Убедитесь, что поле описания заполнено"),
    ageRating: z.number({invalid_type_error: "Убедитесь, что ограничение возраста указано"}).int(),
    publishYear: z.number({invalid_type_error: "Убедитесь, что год указан"}).int(),
    language: z.string(),
    studio: z.string().min(1, "Убедитесь, что студии указана"),
    duration: z.string().min(4, "Убедитесь, что количество часов введено правильно").max(5, "Убедитесь, что длительность фильма введена правильно!"),
    scenarist: z.string().min(1, "Убедитесь, что сценарист указан"),
    production: z.string().min(1, "Убедитесь, что страна производства указана")
}).superRefine(async (value, ctx) => {
    let allFilms = await axios.get("http://127.0.0.1:8000/movies/")
    allFilms = allFilms.data

    if (allFilms.find(film => film.name === value.name)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Этот фильм уже добавлен на сайт"
        })
    }

})

export { filmSchema };