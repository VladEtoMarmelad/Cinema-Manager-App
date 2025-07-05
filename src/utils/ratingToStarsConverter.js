const ratingToStarsConverter = (filmRating) => {
    const normalized = filmRating / 2
    const fullCount = Math.floor(normalized);
    const halfCount = normalized % 1 === 0.5 ? 1 : 0;
    const emptyCount = 5 - fullCount - halfCount;

    const starRating = [
        ...Array(fullCount).fill("full"),
        ...Array(halfCount).fill("half"),
        ...Array(emptyCount).fill("empty")
    ]

    return starRating
}

export { ratingToStarsConverter };