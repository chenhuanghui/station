// ====================================
// REACT LIBRARIES
import Head from 'next/head'
import React, { useState, useEffect, useRef } from 'react';
import Router from 'next/router';
import { useRouter } from 'next/router'
import Link from 'next/link';
import { parseCookies, setCookie, destroyCookie } from 'nookies'

// COMPONENT
import NavBar from '../../component/nav/nav_bar'
import PostInput from '../../component/posts/post-input'
import PostShow from '../../component/posts/post-show'

// COMPONENT LIBRARIES
const AirtablePlus = require('airtable-plus');  
const airtable = new AirtablePlus({
    baseID: process.env.AIR_TABLE_BASE_ID_STATION,
    apiKey: process.env.AIR_TABLE_API_KEY_STATION,
});

// ====================================
// GLOBAL FUNCTIONS
async function retrieveData(formular,tbName) {
    try {
        const readRes = await airtable.read(formular,{tableName:tbName});
        return readRes
    } catch(e) {
        console.error(e);
    }
}

async function updateData(rowID, data,tbName) {
    try {
      const res = await airtable.update(rowID, data,{tableName:tbName});
      return res
    } catch(e) {
      console.error(e);
    }
}

export default function LayoutCabinDetail () {
    const router = useRouter();
    const cookies = parseCookies();
    const [sID, setStationID] = useState(null);

    function getPostByStationID(stationID) {
        (async () => {
            try {
                
            }
            catch(e) {
                console.error(e);
            }
        })();
    }

    useEffect(() => {        
        // if not user --> redirect to Sign In page
        if(!cookies.userID | !cookies.isLoggedIn | !cookies.stationID | !cookies.role) {
            destroyCookie(userID)
            destroyCookie(isLoggedIn)
            destroyCookie(stationID)
            destroyCookie(role)
            Router.push('/signin')
        }
        
        // ===============================================
        setStationID(router.query.id)
        console.log('router 1: ',router)
        console.log('router id 1: ',router.query.id)

        // when docID was assigned successful retrieve data from Contenful
        if(sID === router.query.id) {
            console.log("______ welcome: ", sID)

        }             

    },[sID])

    return (
        <>
            <NavBar />
            <div className="main-content">
                <div className="container-fluid">
                    <div className="row mt-4 mt-md-5 justify-content-center">
                        <div className="col-12 col-lg-10 col-xl-8">
                            <PostInput>
                                <span className="hide" data={sID}></span>
                            </PostInput>
                            
                            <PostShow>
                                <span className="hide" postID="recJSjMYKXLU9typ8"></span>
                            </PostShow>
                        </div>
                    </div>
                </div>
            </div> 
        </>
    )

}