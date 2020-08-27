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

function LayoutFeedByStation ({stationPost}) {
    const router = useRouter();
    const cookies = parseCookies();
    const [sID, setStationID] = useState(null);
    const [brandFeedID, setBrandFeedID] = useState(null);

    useEffect(() => {        
        // if not user --> redirect to Sign In page
        if(!cookies.isLoggedIn) {
            destroyCookie(isLoggedIn)
            Router.push('/signin')
        }
        
        // ===============================================
        setStationID(router.query.id)
        console.log('router 1: ',router)
        console.log('router id 1: ',router.query.id)

        if (router.query.id === sID) {
            setCookie(null,'brandID', sID, {maxAge: 30 * 24 * 60 * 60,path:'/'})
            retrieveData({
                filterByFormula:`brandBusinessID="${sID}"`
            },"Brand")
            .then(res => {
                if (res.length > 0) setBrandFeedID(res[0].id)
            })
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
                                <span className="hide" data={sID} brandFeedID={brandFeedID}></span>
                            </PostInput>
                            
                            {stationPost && stationPost.map((item, index) => (
                                item.fields.Post
                                ? 
                                    <PostShow key={index}>
                                        <span className="hide" postID={item.fields.Post[0]}></span>
                                    </PostShow>
                                : null
                            ))}
                        </div>
                    </div>
                </div>
            </div> 
        </>
    )
}

LayoutFeedByStation.getInitialProps = async ({query}) => {
    console.log("______ initialprops:", query.id)
    // console.log("______ welcome: ", cookies.stationID)
    
    const readRes = await airtable.read({
        filterByFormula: `brandBusinessID = "${query.id}"`,
        sort: [ {field: 'posCreatedAt', direction: 'desc'},]
    },{tableName:"BrandPost"});
    console.log("BrandPost", readRes)
    return { stationPost: readRes }
    

}

export default LayoutFeedByStation