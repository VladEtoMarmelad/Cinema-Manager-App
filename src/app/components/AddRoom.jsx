"use client"

import { useSelector, useDispatch } from "react-redux";
import { addRow, changeRowInfo, changeSeat, addCinemaRoom } from "@/features/cinemaInteractSlice";
import { useSearchParams } from "next/navigation";
import styles from "@/app/css/CinemaAdminPage.module.css"

const AddSeatButton = ({index, newValue}) => {
    const dispatch = useDispatch();

    return (
        <span className={styles.span} data-descr={
                newValue === "B" && "Обчыное сидение" ||
                newValue === "V" && "VIP сидение" ||
                newValue === "E" && "Пустое пространство"
            }>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    dispatch(changeRowInfo({
                        rowIndex: index,
                        newValue: newValue
                    }))
                }}
                className={`
                    ${styles.addSeat} 
                    ${newValue.includes("B") && styles.basicSeat || 
                    newValue.includes("V") && styles.VIPSeat ||
                    newValue.includes("E") && styles.noSeat}
                `}
                style={{display:'inline'}}
            >
                +
            </button>
        </span>
    )
}

const AddRoom = () => {
    
    const rows = useSelector(state => state.cinemaInteract.roomInfo)
    const validationErrors = useSelector(state => state.cinemaInteract.validationErrors)
    const dispatch = useDispatch();

    const searchParams = useSearchParams();
    const cinemaId = Number(searchParams.get("id"));

    const addCinemaRoomHandler = (e) => {
        e.preventDefault();
        dispatch(addCinemaRoom({
            seats: rows.defaultSeats,
            cinemaId: cinemaId
        }))
    }

    return (
        <section>
            <h2>Добавление комнаты</h2>
            <form onSubmit={addCinemaRoomHandler}>
                {
                    rows.defaultSeats.map((row, index) => 
                        <div key={index}>

                            <h2 style={{display: 'inline'}}>{index}</h2>
                            {row.map((seat, index) => 
                                <button 
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        dispatch(changeSeat({
                                            row: rows.defaultSeats.indexOf(row),
                                            index
                                        }))
                                    }}
                                    className={`
                                        ${styles.addSeat} 
                                        ${seat.includes("B") && styles.basicSeat || 
                                        seat.includes("V") && styles.VIPSeat ||
                                        seat.includes("E") && styles.noSeat}
                                    `} 
                                    style={{display:'inline-block'}}
                                >
                                    <h4>{seat}</h4>
                                </button>
                            )}

                            <div style={{display:'flex', justifyContent:'end'}}>
                                <AddSeatButton index={index} newValue={"B"}/>
                                <AddSeatButton index={index} newValue={"V"}/>
                                <AddSeatButton index={index} newValue={"E"}/>
                            </div>

                        </div>
                    )
                }
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch(addRow())
                    }}
                    className="blackButton"
                    style={{margin:'15px'}}
                >
                Добавить ряд +
                </button>
                <button 
                    type="submit" 
                    className="blackButton"
                >
                    Добавить комнату
                </button>
            </form>
            {validationErrors.length > 0 && 
                <section className="errorSection" style={{marginTop:'25px'}}>
                    {validationErrors.map((validationError, index) => 
                        <li key={index}>{validationError}</li>
                    )}
                </section>
            }
        </section>
    )
}

export { AddRoom };