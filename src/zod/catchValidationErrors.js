import { z } from "zod"

const catchValidationErrors = (error) => {
    if (error instanceof z.ZodError) {
        const validationErrors = []

        for (let i=0; i<error.errors.length; i+=1) {
            validationErrors.push(error.errors[i].message)
        }
        return validationErrors
    } else {
        console.error("Unexpected error:", error);
    }
}

export { catchValidationErrors };