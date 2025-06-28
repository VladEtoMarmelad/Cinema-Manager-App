const FilmRating = ({rating, starRating}) => {
    return (
        <>
            <h2 style={{alignSelf:'flex-end', display:'inline-block'}}>{rating}/10</h2>
            <div style={{display:'inline-block', position:'relative', bottom:'3px', left:'5px'}}>
                {starRating.map((star, index) =>
                    <i 
                        key={index}
                        className={`bi bi-star${
                            star === "full" && "-fill" ||
                            star === "half" && "-half" ||  ""
                        }`}
                        style={{color:'orange'}}
                    />
                )}
            </div>
        </>
    )
}

export { FilmRating };