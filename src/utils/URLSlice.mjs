export const URLSlice = (url, lettersBeforeID) => {
    let slicedURL = url.slice(lettersBeforeID)
    slicedURL = slicedURL.slice(0, -1)
    slicedURL = Number(slicedURL)
    return slicedURL
}