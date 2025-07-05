const ValidationErrors = ({errors}) => {
    if (errors.length > 0) return (
        <section className="errorSection" style={{marginTop: '15px', marginBottom: '15px'}}>
            {errors.map((error, index) => 
                <li key={index}>{error}</li>
            )}
        </section>
    )
}

export { ValidationErrors };