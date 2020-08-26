import React, { useState, useEffect, useRef } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import loadable from '@loadable/component';
// ====================================
// INIT GLOBAL VARIABLES
const AirtablePlus = require('airtable-plus');  
const airtable = new AirtablePlus({
    baseID: process.env.AIR_TABLE_BASE_ID_STATION,
    apiKey: process.env.AIR_TABLE_API_KEY_STATION,
});
const cookies = parseCookies();
const ReactFilestack = loadable(() => import('filestack-react'), { ssr: false });

// FUNCTIONS GLOBAL

async function createComment(content, imagesURL) {
    try {
        
    }
    catch(e) {
        console.error(e);
    }
}

export default class CommentShow extends React.Component {
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
                {this.props.children}       
                <div className="comment mb-3">
                    <div className="row">
                        <div className="col-auto">
                            <a className="avatar avatar-sm" href="#">
                                <img src="/assets/img/avatars/profiles/avatar-3.jpg" alt="..." className="avatar-img rounded-circle"/>
                            </a>
                        </div>
                        <div className="col ml-n2">
                            <div className="comment-body">
                                <div className="row">
                                    <div className="col"><h5 className="comment-title">Adolfo Hess</h5></div>
                                    <div className="col-auto">
                                        <time className="comment-time">11:12</time>
                                    </div>
                                </div>
                                <p className="comment-text">Any chance you're going to link the grid up to a public gallery of sites built with Launchday?</p>
                            </div>
                        </div>
                    </div>
                </div>
            </>  
        );
    }
}