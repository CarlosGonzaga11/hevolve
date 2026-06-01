import { useState } from "react"

export default function Counter(){
    const [counterActive,setCounterActive] = useState(false)
    const [time,setTime] = useState(60)
    const [inicioTreino,setInicioTreino] = useState()
    function atualizaTempoContador(x){
        const data = Date.now()
        let inicio = new Date(data)
        setInicioTreino(inicio)

    }
    atualizaTempoContador(10)
    function cronometro(){
        let ho
    }
    return(
        <div>
            <span>hora</span>
             <span>min</span>
              <span>segundos</span>
        </div>
    )
}