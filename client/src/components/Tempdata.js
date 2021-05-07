import fetch from 'node-fetch'
import React, { useState, useEffect } from 'react'

let xyz;

const Tempdata = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        async function fetchData() {
            const data = await fetch('http://localhost:3001/fetchdata')
            const response = await data.json()
            setTimeout(() => {
                console.log("Response?", response)
            }, 3000)            
        }
        fetchData()
        setTimeout(() => {
            console.log("XYZ?", xyz)
        }, 3000)
    })
    console.log(`DATA? ${data}`)
    return (
        <div>
            <h2>JSON Data</h2>                        
        </div>
    )
}

export default Tempdata;