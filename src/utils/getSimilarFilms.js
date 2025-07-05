import axios from "axios"

const getSimilarFilms = async (filmObject) => {
    const {id, name, publishYear, studio, director, scenarist} = filmObject
    const paramsList = [
        {paramName: "id", value: id},
        {paramName: "name", value: name},
        {paramName: "publishYear", value: publishYear},
        {paramName: "studio", value: studio},
        {paramName: "director", value: director},
        {paramName: "scenarist", value: scenarist}
    ]

    let requestParams = {
        searchSimilar: true
    }
    for (let i=0; i<paramsList.length; i+=1) { 
        requestParams[paramsList[i].paramName] = paramsList[i].value
    }
    const similarFilms = await axios.get("http://127.0.0.1:8000/movies/", {
        params: requestParams
    })
    
    return similarFilms.data
}

export { getSimilarFilms };