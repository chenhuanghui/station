import React, { useState, useEffect, useRef } from 'react';
import DatePicker from "react-datepicker";
const AirtablePlus = require('airtable-plus');  

// ====================================
// INIT GLOBAL VARIABLES
const airtable = new AirtablePlus({
  baseID: 'appmREe03n1MQ6ydq',
  apiKey: 'keyLNupG6zOmmokND',
  tableName: 'Brand_Setup',
});

export default class DateTimeCustom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }
    componentDidMount() {
        
    }

    componentDidUpdate(prevProps, prevState) {
                
    }

    

    render() {        
        return (
            <>
            </>
            
        );
    }
}