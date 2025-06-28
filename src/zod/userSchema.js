import { z } from "zod";
import axios from "axios";

const userSchema = z.object({
    name: z.string().min(1, "Имя пользователя не должно быть пустой строкой").superRefine(async (name, ctx) => {

        const userWithSameName = await axios.get("http://127.0.0.1:8000/users/", {
            params: {name}
        })
        const userExists = userWithSameName.data.length > 0 ? true : false 

        if (userExists) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Пользователь с таким именем уже существует"
            })
        }
    }),
    email: z.string().email("Поле должно содержать email"),
    password: z.string().min(8, "Длина пароля должна быть как минимум 8 символов"), 
    repeatPassword: z.string()
}).superRefine((values, ctx) => {
    const {password, repeatPassword} = values
    
    if (password !== repeatPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Пароли должны совпадать"
        })
    }

    const notAllowedPasswords = ["null", "undefinded"] 
    if (notAllowedPasswords.includes(password)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Пароли 'null' и 'undefinded' - запрещены"
        })
    }
})

export { userSchema };