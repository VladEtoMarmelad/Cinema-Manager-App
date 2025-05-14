import { z } from "zod";
import axios from "axios";

const signInSchema = z.object({
    name: z.string().min(1, "Убедитесь, что поле имени заполнено"),
    password: z.string()
}).superRefine(async (value, ctx) => {
    let allUsers = await axios.get("http://127.0.0.1:8000/users/")
    allUsers = allUsers.data

    const signInUser = allUsers.find(user => user.name === value.name)

    if (!signInUser) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Пользователь с таким именем не найден"
        })
    }

    if (signInUser) {
        if (signInUser.password !== value.password) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Неверный пароль"
            })
        }
    }
})

export { signInSchema };