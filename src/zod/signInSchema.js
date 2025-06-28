import { z } from "zod";
import axios from "axios";

const signInSchema = z.object({
    name: z.string().min(1, "Убедитесь, что поле имени заполнено"),
    password: z.string()
}).superRefine(async (value, ctx) => {
    let signInUser = await axios.get("http://127.0.0.1:8000/users/", {
        params: {name: value.name} 
    })
    signInUser = signInUser.data[0]

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

    const notAllowedPasswords = ["null", "undefinded"] 
    if (notAllowedPasswords.includes(value.password)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Пароли "null" и "undefinded" - запрещены`
        })
    }
})

export { signInSchema };