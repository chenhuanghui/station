import React, { useState, useEffect, useRef } from 'react';
import DatePicker from "react-datepicker";

import { parseCookies, setCookie, destroyCookie } from 'nookies'
// ====================================
// INIT GLOBAL VARIABLES
const AirtablePlus = require('airtable-plus');  
const airtable = new AirtablePlus({
    baseID: process.env.AIR_TABLE_BASE_ID_STATION,
    apiKey: process.env.AIR_TABLE_API_KEY_STATION,
});
const cookies = parseCookies();

// FUNCTIONS GLOBAL

async function createPost(content) {
    try {
        const createPost = await airtable.create({
            content: content,
            // photos: [{url:image}],
            like: 0,
            dislike:0
        },{tableName:"Post"});
        console.log('create result:', createPost)
        
        const createStationPost = await airtable.create({
            Station: [`${cookies.stationID}`],
            Post: [`${createPost.id}`]            
        },{tableName:"StationPost"});
        console.log("StationPost: ", createStationPost)

        const createPostAccount = await airtable.create({
            Account: [`${cookies.userID}`],
            Post: [`${createPost.id}`]            
        },{tableName:"PostAccount"});
        console.log("PostAccount: ", createPostAccount)
    }
    catch(e) {
        console.error(e);
    }
}

export default class DateTimeCustom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }
    componentDidMount() {
        $(document).on('click','.btn-action-post', function(){
            $(this).append(`<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>`)
            
            if ($("#post-content").val() === '') {
                alert('Vui lòng nhập nội dung')
                return;
            }
            createPost($("#post-content").val())
            .then(res => console.log(res))
            

        })
    }

    componentDidUpdate(prevProps, prevState) {
                
    }

    render() {        
        return (
            <>
            {this.props.children}

            <div className="card">
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <textarea className="form-control form-control-flush form-control-auto" id="post-content" data-toggle="autosize" rows="3" placeholder="Start a post..." style={{"overflow": "hidden", "overflow-wrap": "break-word", "height": "68px"}}></textarea>
                        </div>
                    </form>
                    <div className="row align-items-center">
                        <div className="col">
                            <small className="text-muted">0/500</small>
                        </div>
                        <div className="col-auto">
                            <div className="text-muted">
                                <a className="text-reset mr-3" href="#!" data-toggle="tooltip" title="" data-original-title="Add photo"> <i className="fe fe-camera"></i></a>
                                <button type="button" className="btn btn-primary btn-sm mr-3 btn-action-post">Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>       
            </>     
        );
    }
}