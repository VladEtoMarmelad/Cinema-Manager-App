import { parse, format } from 'date-fns';

export const fromDBTimeFormat = (time) => {
    const date = parse(time, `yyyy-MM-dd'T'HH:mm:ss'Z'`, new Date())
    return format(date, "dd/LL/yyyy eeee HH:mm")
}