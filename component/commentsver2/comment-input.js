import React, { useState, useEffect, useRef } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import loadable from '@loadable/component';

import ImageAttachment from '../attachment/image-attachment'
// ====================================
// INIT GLOBAL VARIABLES
const AirtablePlus = require('airtable-plus');  
const airtableFEED = new AirtablePlus({
    baseID: process.env.AIR_TABLE_BASE_ID_FEED,
    apiKey: process.env.AIR_TABLE_API_KEY,
});

const cookies = parseCookies();
const ReactFilestack = loadable(() => import('filestack-react'), { ssr: false });

// FUNCTIONS GLOBAL
async function createComent(comment_content, comment_attachment, post_id, user_id, user_name, user_avatar) {
    console.log("By User: ", user_name)

    let queryAttachment = []
    if (comment_attachment.length > 0) {
        comment_attachment.map((urlItem, index)=> {
            queryAttachment.push({url: urlItem})
        })            
        console.log("queryAttachment: ", queryAttachment)
    }

    const createComment = await airtableFEED.create({
        content: comment_content,
        attachments: queryAttachment,    
        postID: post_id.toString(),
        userID: user_id.toString(),
        userName: user_name,
        userAvatar : user_avatar ? user_avatar[0].url : ''
    },{tableName: "Comment"})

    return createComment
}

function btnQueryEffectStart(button) {
    if (!button.hasClass("disabled")) 
        button.addClass("disabled").append(`<span class="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>`)
    else return;
}

function btnQueryEffectDone(button) {
    if (button.hasClass("disabled")) {
        button.removeClass("disabled")
        button.find(`.spinner-border`).remove()
    }
    else return;
}

function getCommentAttachment(pID){
    var uploadFileEle = $(`#${pID}`).find(".image-post")
    var dataList = []
    uploadFileEle.each(function(){
        dataList.push($(this).attr("data"))    
    })
    return dataList
}

export default class CommentInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            avatar : null,
            commentAttachment: [],
        }
    }
    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
                
    }

    addAttachment = (file) => {
        let curcommentAttachment = this.state.commentAttachment;
        curcommentAttachment.push(file)
        this.setState({commentAttachment:curcommentAttachment})
    }

    postComment = (pID) => {
        var commentContent = $(`#${pID}`).find(".comment").val()
        if (commentContent === "") {
            alert ("vui lòng nhập nội dung")
            return;
        }
        var btnAction = $(`#${pID}`).find(".btn-action-comment")
        btnQueryEffectStart(btnAction)

        var comentAttachmentList = getCommentAttachment(pID)
        console.log("commentAttachment: ",comentAttachmentList)

        createComent(commentContent, comentAttachmentList, pID, this.props.user.ID, this.props.user.name, this.props.user.avatar)
        .then(commentRes => {
            if (!commentRes) alert("Có lỗi xảy ra, vui lòng thực hiện lại")            
            console.log("comment Res: ", commentRes)
            $(`#${pID}`).find(".comment").val('')
            $(".image-post").remove()
            btnQueryEffectDone(btnAction)
        })
        
        
    }

    render() {        
        const {commentAttachment} = this.state
        return (
            <div id={this.props.post_id}>
                {this.props.children}       
                <div className="row comment-input">
                    <div className="col-auto">
                        <div className="avatar avatar-sm">
                            <img src={this.props.user.avatar ? this.props.user.avatar[0].url : ''} alt={this.props.user.name} className="avatar-img rounded-circle"/>
                        </div>
                    </div>
                    <div className="col ml-n2">
                        <div className="mt-1">
                            <label className="sr-only">Leave a comment...</label>
                            <textarea id={`post-comment-${this.props.post_id}`} className="form-control form-control-flush comment" data-toggle="autosize" rows="1" placeholder="Leave a comment" style={{"overflow": "hidden", "overflowWrap": "break-word"}}></textarea>
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
                                    this.addAttachment(res.filesUploaded[0])
                                }}
                            />
                            
                            <button type="button" className="btn btn-primary btn-sm mr-3 btn-action-comment" onClick={()=> this.postComment(this.props.post_id)}>Post</button>
                        </div>
                    </div>
                </div>
                <div className="file-upload-show" data="">
                {
                    commentAttachment.map((item, index) => (
                        <ImageAttachment key={index}
                            uploadId = {item.uploadId}
                            url={item.url} 
                            filename={item.filename} 
                            mimetype={item.mimetype}
                            size = {item.size}
                        />
                    ))
                }
                </div>
            </div>  
        );
    }
}