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
async function retrieveData(formular,tbName) {
    try {
      const readRes = await airtable.read(formular,{tableName:tbName});
      return readRes
    } catch(e) {
      console.error(e);
    }
}

async function createCommentDatabase(userID, postid, content, imagesURL) {
    try {
        const createComment = await airtable.create({
            Account: [`${userID}`],
            comment: content,
            attachments: [{url:imagesURL}]
        },{tableName:"Comment"});
        console.log('create Comment:', createComment)
        
        const createPostComment = await airtable.create({
            Post: [`${postid}`],
            Comment: [`${createComment.id}`],
        },{tableName:"PostComment"});
        console.log("PostComment: ", createPostComment)

        return createComment
    }
    catch(e) {
        console.error(e);
        return 0
    }
}

function CreateCommentRequest(postID) {

    if ($(`#${postID}`).find(".comment").val() === '') {
        alert('Vui lòng nhập nội dung')
        return;
    }

    $(`#${postID}`).find(".btn-action-comment").append(`<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>`)
    var imageURL = ""
    var comment = $(`#${postID}`).find(".comment").val()

    if ($(`#${postID}`).find('.file-upload-show').attr("data") !== "") {
        imageURL = $(`#${postID}`).find('.file-upload-show').attr("data")
        console.log("imageURL: ", imageURL)
    }

    console.log(postID, "-",comment,"-",imageURL )
    createCommentDatabase(cookies.userID, postID, comment, imageURL)
    .then(res => {
        console.log("res :", res)
        if (res === 1) {
            $(`#${postID}`).find(".comment").val('')
            $(`#${postID}`).find(`.file-upload-show`).html('')
            $(`.spinner-grow`).remove()
        }
    })
}


export default class CommentShow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            avatar : null
        }
    }
    componentDidMount() {
        let currentComponent = this
        console.log("_______ comment post id:",this.props.children.props.post)
        console.log("avatar: ", cookies.avatar)
        currentComponent.setState({avatar: cookies.avatar})
        
    }

    componentDidUpdate(prevProps, prevState) {
                
    }

    render() {        
        const curPID = this.props.children.props.post
        const {avatar} = this.state
        return (
            <div id={curPID}>
                {this.props.children}       
                <div className="row">
                    <div className="col-auto">
                        <div className="avatar avatar-sm">
                            <img src={avatar} alt="..." className="avatar-img rounded-circle"/>
                        </div>
                    </div>
                    <div className="col ml-n2">
                        <div className="mt-1">
                            <label className="sr-only">Leave a comment...</label>
                            <textarea id={`post-comment-${curPID}`} className="form-control form-control-flush comment" data-toggle="autosize" rows="1" placeholder="Leave a comment" style={{"overflow": "hidden", "overflowWrap": "break-word", "height": "40px"}}></textarea>
                        </div>
                    </div>
                    <div className="col-auto align-self-end">
                        <div className="text-muted mb-2">
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
                                    $(`#${curPID}`).find(`.file-upload-show`).html(htmlAppend);
                                    $(`#${curPID}`).find(`.file-upload-show`).attr("data",res.filesUploaded[0].url)                                        
                                }}
                            />
                            
                            <button type="button" className="btn btn-primary btn-sm mr-3 btn-action-comment" onClick={()=> CreateCommentRequest(curPID)}>Post</button>
                        </div>
                    </div>
                </div>
                <div className="file-upload-show" data=""></div>
            </div>  
        );
    }
}