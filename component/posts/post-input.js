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

async function createPost(content, imagesURL) {
    try {
        const createPost = await airtable.create({
            content: content,
            photos: [{url:imagesURL}],
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

export default class PostInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }
    componentDidMount() {
        $(document).on('click','.btn-action-post', function(){
            $(this).append(`<div className="spinner-grow spinner-grow-sm" role="status"></div>`)
            
            if ($("#post-content").val() === '') {
                alert('Vui lòng nhập nội dung')
                return;
            }
            var imageURL = null;
            
            if ($('.file-upload-show').attr("data") !== "") {
                imageURL = $('.file-upload-show').attr("data")
                console.log("imageURL: ", imageURL)
            }
            createPost($("#post-content").val(), imageURL)
            .then(res => {
                console.log(res)
                $(".spinner-grow").remove()
                location.reload()
            })
            

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

                    <div className="row align-items-center post-control-upload">
                        <div className="col">
                            <small className="text-muted">0/500</small>
                        </div>                        
                        <div className="col-auto">
                            <div className="text-muted">
                                <ReactFilestack
                                    apikey={'A88NrCjOoTtq2X3RiYyvSz'}
                                    customRender={({ onPick }) => (
                                        <a className="text-reset mr-3" href="#!" data-toggle="tooltip" title="" data-original-title="Add photo"> 
                                            <i className="fe fe-camera" onClick={onPick}></i>
                                        </a>
                                    )}
                                    onSuccess={(res) => {
                                        console.log('filestack:',res)
                                        var htmlAppend = `<hr class='dropdown-divider'/> <div class='row align-items-center image-post'><div class='col-auto'><a href='#' class='avatar'><img src=${res.filesUploaded[0].url} alt='...' class='avatar-img rounded'/></a></div><div class='col ml-n2'><h4 class='mb-1' id='image-post-title'>${res.filesUploaded[0].filename}</h4><p class='card-text small'><span class='text-muted' id='image-post-filesize'>${res.filesUploaded[0].mimetype}</span></p></div></div>`
                                        $('.file-upload-show').html(htmlAppend);
                                        $('.file-upload-show').attr("data",res.filesUploaded[0].url)                                        
                                    }}
                                />
                                
                                <button type="button" className="btn btn-primary btn-sm mr-3 btn-action-post">Post</button>
                            </div>
                        </div>
                    </div>
                    <div className="file-upload-show" data=""></div>

                </div>
            </div>       
            </>     
        );
    }
}