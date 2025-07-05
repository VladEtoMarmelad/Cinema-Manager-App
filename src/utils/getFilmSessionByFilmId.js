import axios from "axios"
import { fromDBTimeFormat } from "./dateConverter"

const getFilmSessionByFilmId = async (filmId) => {
    let filmSessions = await axios.get("http://127.0.0.1:8000/filmSessions/", {
        params: {filmId}
    })
    filmSessions = filmSessions.data
    filmSessions = filmSessions.map(filmSession => {
        const readableSessionTime = fromDBTimeFormat(filmSession.sessionTime) 
        return {
            ...filmSession,
            sessionTime: readableSessionTime
        }
    })
    return filmSessions
}

export { getFilmSessionByFilmId };