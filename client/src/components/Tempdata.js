import fetch from 'node-fetch'
import React, { Component } from 'react'

class Tempdata extends Component {
    
    constructor() {
        super()
        this.state = {
            data: []
        }
    }

    async componentDidMount() {        
        const response = await fetch('http://localhost:3001/fetchdata/checkdata')
        // check how data is being returned in express
        const json = await response.json()        
        console.log(`JSON? ${json}`)
        this.setState({ data: json }, data => (console.log(`DATA? * * * * * * * * ${data}`)))
    }
    
    render() {
        return(
            <div>
                <h2>Temp Data</h2>
            </div>
        )
    }
}

export default Tempdata
