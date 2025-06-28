import { z } from "zod";

const filmCommentSchema = z.object({
    name: z.string()
    .min(1, "Убедитесь, что поле заголовка заполнено")
    .max(100, "Длина заголовка не должна превышать 100 символов"),
    
    description: z.string()
    .min(1, "Убедитесь, что поле описания заполнено"),

    rating: z.number()
    .int("Оценка фильма должна быть целым числом")
    .nonnegative("Оценка фильма не может быть отрицательным числом")
    .max(10, "Оценка фильма должна быть в промежутке от 0 до 10")
})

export { filmCommentSchema };