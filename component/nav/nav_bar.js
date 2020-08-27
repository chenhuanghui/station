import $ from 'jquery'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'
import Router from 'next/router';
import { useRouter } from 'next/router'
import { parseCookies, setCookie, destroyCookie } from 'nookies'

const AirtablePlus = require('airtable-plus');  
const airtable = new AirtablePlus({
  baseID: process.env.AIR_TABLE_BASE_ID_STATION,
  apiKey: process.env.AIR_TABLE_API_KEY_STATION,
});

async function retrieveData(formular,tbName) {
  try {
    const readRes = await airtable.read(formular,{tableName:tbName});
    return readRes
  } catch(e) {
    console.error(e);
  }
}

function NavBar () {
  const router = useRouter();
  const cookies = parseCookies();
  const [data, setData] = useState(null);
  const [brand, setBrand] = useState(null);
  const [sID, setSID] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if(!cookies.isLoggedIn) {
      Router.push('/signin')
    }

    setSID(router.query.id)
    console.log('router 1: ',router)

    if (router.query.id === sID) {
      console.log('router 2___: ',sID)
      console.log('cookie router 2___: ',cookies.userID)

      setCookie(null,'brandID', sID, {maxAge: 30 * 24 * 60 * 60,path:'/'})


      retrieveData({
        filterByFormula:`ID="${cookies.userID}"`,
        maxRecords: 1
      },'Account')      
      .then (result => {
        console.log("account nav_bar:", result)
        if (result.length > 0) {
          setData(result[0].fields)
          result[0].fields.avatar ? setAvatar(result[0].fields.avatar[0].url) : setAvatar("/assets/img/avatars/profiles/avatar-1.jpg")
        }
      })
      
      retrieveData({
        filterByFormula:`ID="${cookies.brandID}"`,
        maxRecords: 1
      },'Brand')
      .then(res => {
        if (res.length > 0) setBrand(res[0].fields)
      })                
      
      // ==========================================
      // javascript action
      // ==========================================

      //toggle main menu xs
      $('.navbar-toggler').click(function(){
        if (!$('.navbar-collapse').hasClass('show')) {
          $('.navbar-collapse').addClass('show')
        } else {
          $('.navbar-collapse').removeClass('show')
        }
      })
      //toggle account menu xs
      $('.navbar-user').click(function(){
        if (!$('.dropdown').hasClass('show')) {
          $('.dropdown').addClass('show')
          $('.dropdown-menu-right').addClass('show')
        } else {
          $('.dropdown').removeClass('show')
          $('.dropdown-menu-right').removeClass('show')
        }
      })
      
      // logout
      $('.logout').click(function(){
        destroyCookie(null, 'isLoggedIn', {path:'/'})
        destroyCookie(null, 'userID', {path:'/'})
        destroyCookie(null, 'brandID', {path:'/'})
        Router.push(`/signin`)
      })
    }
  },[sID])

  return(
    <>
      <nav className="navbar navbar-vertical fixed-left navbar-expand-md navbar-light" id="sidebar">
        <div className="container-fluid">
          {/* toggle button */}
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#sidebarCollapse" aria-controls="sidebarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* logo */}
          <div className="navbar-brand">
          { brand && brand.logo
          ? <img src={brand.logo[0].url} className="navbar-brand-img mx-auto" />
          : <img src="/assets/img/logo.png" className="navbar-brand-img mx-auto" />
          }
          </div>
          
          {/* menu user xs */}
          <div className="navbar-user d-md-none">
            <div className="dropdown">
              <a href="#" id="sidebarIcon" className="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <div className="avatar avatar-sm avatar-online">
                  <img src={avatar} className="avatar-img rounded-circle" alt="..."/>
                </div>
              </a>

              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="sidebarIcon">                 
                <hr className="dropdown-divider" />
                <span className="dropdown-item logout">Logout</span>
              </div>
            </div>
          </div>

          <div className="collapse navbar-collapse" id="sidebarCollapse">
            {/* menu group block */}
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link href="/feed/[id]" as = {`/feed/${cookies.brandID}`}>
                  <a className="nav-link active"><i className="fe fe-wind"></i> New Feed</a>
                </Link>
                <Link href="#">
                  <a className="nav-link"><i className="fe fe-home"></i> Ticket</a>
                </Link>
              </li>
            </ul>

            <hr className="navbar-divider my-3" />
            <div className="mt-auto"></div>

            <div className="navbar-user d-none d-md-flex" id="sidebarUser">

              <a href="#sidebarModalActivity" className="navbar-user-link" data-toggle="modal">
                <span className="icon"><i className="fe fe-bell"></i></span>
              </a>

              {/* <DropUpWithImage /> */}
              <div className="dropup">
                <a href="#" id="sidebarIconCopy" className="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <div className="avatar avatar-sm avatar-online">
                      <img src={avatar} className="avatar-img rounded-circle" alt="..."/>
                    </div>
                </a>
                {/* Menu */}
                <div className="dropdown-menu" aria-labelledby="sidebarIconCopy">
                  <hr className="dropdown-divider" />                  
                  <span className="dropdown-item logout">Logout</span>
                </div>
            </div>

              {/* Icon */}
              <a href="#sidebarModalSearch" className="navbar-user-link" data-toggle="modal">
                <span className="icon">
                  <i className="fe fe-search"></i>
                </span>
              </a>

            </div>
          </div>
          {/* end .navbar-collapse */}
        </div>
    <style jsx>{`
    .logout{
      cursor: pointer;
    }
    @media (min-width: 768px) {
      .navbar-vertical.navbar-expand-md .navbar-brand-img {
        max-height: 4rem;
      }
    }

    `}</style>
      </nav>
    </>
  )
}

export default NavBar