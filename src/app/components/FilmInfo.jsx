"use client"

import styles from "@/app/css/SingleFilm.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";

const FeatureComponent = (props) => {
    return <><h4>{props.title}: <span>{props.value}</span></h4></>
}

const FilmInfo = (props) => {
    const {filmInfo, showCommentsLink, showSimilar, showPoster} = props

    const [filmInfoPoster, setfilmInfoPoster] = useState(null)

    useEffect(() => {
        if (showPoster && document.getElementById("posterInput")) {
            const newPoster = document.getElementById("posterInput").files[0]
            const newPosterURL = URL.createObjectURL(newPoster)
            setfilmInfoPoster(newPosterURL)
        }
    }, [showPoster])

    return (
        <>
            {showPoster &&
                <section id={styles.posterSection}>
                    <img 
                        src={filmInfoPoster && filmInfoPoster || filmInfo.poster} 
                        alt="filmPoster" 
                        style={{borderRadius:'15px', width: '200px', height:'300px'}}
                    />
                </section>
            }

            <section id={styles.infoSection}>
                <h1>{filmInfo.name}</h1>
                <div style={{marginTop:'30px', marginBottom:'30px'}}>
                    <FeatureComponent title="Возрастное ограничение" value={`${filmInfo.ageRating}+`}/>
                    <FeatureComponent title="Год" value={filmInfo.publishYear}/>
                    <FeatureComponent title="Язык сеанса" value={filmInfo.language}/>
                    <FeatureComponent title="Студия" value={filmInfo.studio}/>
                    <FeatureComponent title="Длительность" value={filmInfo.duration}/>
                    <FeatureComponent title="Режисёр" value={filmInfo.director}/>
                    <FeatureComponent title="Сценарист" value={filmInfo.scenarist}/>
                    <FeatureComponent title="Производство" value={filmInfo.production}/>
                </div>
                <p>{filmInfo.description}</p>

                {showCommentsLink && 
                    <Link href={`/film/comments?id=${filmInfo.id}`} className="grayButton">Коментарии <i className="bi bi-chat-dots-fill"/></Link>
                }

                {showSimilar && 
                    <h3 style={{marginTop:'30px'}}>Смотрите также:</h3>
                }

            </section>
        </>
    )
}

export { FilmInfo };