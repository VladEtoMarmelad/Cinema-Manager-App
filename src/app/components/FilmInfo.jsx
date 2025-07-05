"use client"

import styles from "@/app/css/SingleFilm.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FilmRating } from "./FilmRating";

const FeatureComponent = (props) => {
    return <><h4>{props.title}: <span>{props.value}</span></h4></>
}

const FilmInfo = (props) => {
    const {filmInfo, showCommentsLink, showSimilar, showPoster, showRating, showDescription} = props

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
            <div style={{display:'flex', flexDirection:'column', textAlign:'center'}}>
                {showPoster &&
                    <img 
                        src={filmInfoPoster && filmInfoPoster || filmInfo.poster} 
                        alt="filmPoster" 
                        id={styles.poster}
                    />
                }

                {showCommentsLink && 
                    <Link 
                        href={`/film/comments?id=${filmInfo.id}`} 
                        className="grayButton"
                        style={{marginTop:'15px', borderRadius:'7.5px'}}
                    >
                        Коментарии <i className="bi bi-chat-dots-fill"/>
                    </Link>
                }
            </div>

            <section id={styles.infoSection} style={{marginLeft:'10px'}}>
                <h1>{filmInfo.name}</h1>
                
                {showRating &&
                    <FilmRating
                        rating={filmInfo.rating}
                        starRating={filmInfo.starRating}
                    />
                }

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
                
                {showDescription &&
                    <p>{filmInfo.description}</p>
                }

                {showSimilar && 
                    <>
                        <h3 style={{marginTop:'30px', marginBottom:'30px'}}>Смотрите также:</h3>
                        <section className={styles.similarFilmsSection}>
                            {filmInfo.similarFilms.map((film) => {
                                if (film) {
                                    return (
                                        <Link key={film.id} href={`/film?id=${film.id}`} className={styles.similarFilm}>
                                            <img src={film.poster} alt="poster"/>
                                            <h3>{film.name}</h3>
                                        </Link>
                                    )
                                }
                            })}
                        </section>
                    </>
                }

            </section>
        </>
    )
}

export { FilmInfo };