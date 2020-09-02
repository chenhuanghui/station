// ====================================
// REACT LIBRARIES
import Head from 'next/head'
import React, { useState, useEffect, useRef } from 'react';
import Router from 'next/router';
import { useRouter } from 'next/router'
import Link from 'next/link';
import { parseCookies, setCookie, destroyCookie } from 'nookies'

// COMPONENT
import NavBar from '../../component/nav/new_nav'
// ====================================
// GLOBAL FUNCTIONS

const AirtablePlus = require('airtable-plus');  
const airtableFEED = new AirtablePlus({
    baseID: process.env.AIR_TABLE_BASE_ID_FEED,
    apiKey: process.env.AIR_TABLE_API_KEY,
});
const airtableUSER = new AirtablePlus({
    baseID: process.env.AIR_TABLE_BASE_ID_USER,
    apiKey: process.env.AIR_TABLE_API_KEY,
});
const airtableSOPERATION = new AirtablePlus({
    baseID: process.env.AIR_TABLE_BASE_ID_SOPERATION,
    apiKey: process.env.AIR_TABLE_API_KEY,
});

const airtableBRAND = new AirtablePlus({
    baseID: process.env.AIR_TABLE_BASE_ID_BRAND,
    apiKey: process.env.AIR_TABLE_API_KEY,
});

async function getUserByID(userID) {
    const userData = await airtableUSER.read({
        filterByFormula: `ID = "${userID}"`,
        maxRecords: 1
    },{tableName:"User"});
    console.log("User", userData)
    if (userData.length > 0) return userData[0].fields
    else return null
}

function LayoutFeedByStation ({brand}) {
    const router = useRouter();
    const cookies = parseCookies();
    const [sID, setSID] = useState(null);
    const [user, setUser] = useState([])

    useEffect(() => {        
        // if not user --> redirect to Sign In page
        if(!cookies.isLoggedIn) {
            destroyCookie(isLoggedIn)
            Router.push('/signin')
        }
        
        getUserByID(cookies.userID)
        .then(user => {
            setUser(user)
        })

    },[])

    return (
        <>
            <NavBar 
                brand_id={brand.fields.ID}
                user_id={cookies.userID}
                avatar = {user && user.avatar ? user.avatar[0].url : "../assets/img/avatars/profiles/avatar-1.jpg"}
            />
            hello world
        </>
    )
}

LayoutFeedByStation.getInitialProps = async ({query}) => {
    console.log("______ initialprops:", query.id)

    console.log(airtableBRAND)
    
    const brandData = await airtableBRAND.read({
        filterByFormula: `ID = "${query.id}"`,
        maxRecords: 1
    },{tableName:"Brand"});
    console.log("Brand", brandData)
    return { brand: brandData[0] }
}

export default LayoutFeedByStation