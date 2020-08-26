import React from 'react';
import Router from 'next/router';
import { parseCookies, setCookie, destroyCookie } from 'nookies'

export default class LayoutIndex extends React.Component {
    componentDidMount() {
        const cookies = parseCookies()
        if(cookies.userID && cookies.isLoggedIn && cookies.stationID && cookies.role) {
            Router.push(`/feed/recKcGBTwDEvjGjj4`)
        } else Router.push('/signin')                
    }

    render () {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-5 col-xl-4 my-5">
                        <h1> WELCOME TO CABINFOOD FOR STATION </h1>
                    </div>                    
                </div>
                <style jsx>{`
                    h1 {text-align: center}
                `}</style>
            </div>
        )
    }
}