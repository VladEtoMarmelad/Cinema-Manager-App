import { parse, format } from 'date-fns';

const replaceWith = [
    {from: "Mo", to: "Пн"},
    {from: "Tu", to: "Вт"},
    {from: "We", to: "Ср"},
    {from: "Th", to: "Чт"},
    {from: "Fr", to: "Пт"},
    {from: "Sa", to: "Сб"},
    {from: "Su", to: "Вс"},

    {from: "/01/", to: " Января "},
    {from: "/02/", to: " Февраля "},
    {from: "/03/", to: " Марта "},
    {from: "/04/", to: " Апреля "},
    {from: "/05/", to: " Мая "},
    {from: "/06/", to: " Июня "},
    {from: "/07/", to: " Июля "},
    {from: "/08/", to: " Августа "},
    {from: "/09/", to: " Сентября "},
    {from: "/10/", to: " Октября "},
    {from: "/11/", to: " Ноября "},
    {from: "/12/", to: " Декабря "},
]

export const fromDBTimeFormat = (time) => { //time - DateTimeField
    let date = parse(time, `yyyy-MM-dd'T'HH:mm:ss'Z'`, new Date())
    date = format(date, "eeeeee d/LL/ HH:mm")

    for (let i=0; i<replaceWith.length; i+=1) {
        date = date.replaceAll(replaceWith[i].from, replaceWith[i].to)
    }

    return date
}

export const fromDBTimeFormatDateOnly = (time) => { //time - DateField
    let date = parse(time, `yyyy-MM-dd`, new Date())
    date = format(date, "eeeeee d/LL/yyyy год")

    for (let i=0; i<replaceWith.length; i+=1) { 
        date = date.replaceAll(replaceWith[i].from, replaceWith[i].to)
    }

    return date
}