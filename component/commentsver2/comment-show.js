import React, { useState, useEffect, useRef } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
const cookies = parseCookies();

const AirtablePlus = require('airtable-plus');  
const airtableFEED = new AirtablePlus({
    baseID: process.env.AIR_TABLE_BASE_ID_FEED,
    apiKey: process.env.AIR_TABLE_API_KEY,
});

async function updateCommentContentByRecCommentID(recCommentID, newContent) {
    try {
        const updateComment = await airtableFEED.update(recCommentID,{
            content: newContent
        },{tableName: "Comment"})
        return updateComment
    }catch(e) {
        console.log(e)
    }
}

export default class CommentShow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            comment_id : null,
            author_id : null
        }
    }
    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        var curCommentID = this.props.comment_id
        var prevCommentID = prevState.comment_id

        if (curCommentID !== prevCommentID) {
            console.log("comment_id UPDATE___: ", prevCommentID, '-->', curCommentID)
            this.setState({comment_id: curCommentID})
            this.setState({author_id: this.props.author_id})
        }                
    }

    updateCommentContent = (commentID, recCommentID) => {
        console.log("onblur: ", commentID, "-", recCommentID, '*' , $(`#${recCommentID}`).text())
        
        var newContent = $(`#${recCommentID}`).text()
        updateCommentContentByRecCommentID(recCommentID, newContent)
        .then(res=> {console.log("update comment content: ", res)})
    }

    render() {
        const {author_id, comment_id} = this.state
        return (
            <>
                {this.props.children}       
                <div className="comment mb-3 comment-show">
                    <div className="row">
                        <div className="col-auto">
                            <a className="avatar avatar-sm" href="#">
                                <img src={this.props.avatar} alt={this.props.author} className="avatar-img rounded-circle"/>
                            </a>
                        </div>
                        <div className="col ml-n2">
                            <div className="comment-body">
                                <div className="text-center mb-3">
                                    { this.props.attachments
                                    ? <img src={this.props.attachments[0].url} className="img-fluid rounded"/>
                                    : null
                                    }
                                </div>
                                <div className="row">
                                    <div className="col"><h5 className="comment-title">{this.props.author}</h5></div>
                                    <div className="col-auto">
                                        <time className="comment-time">{this.props.createdAt ? `${new Date(this.props.createdAt).toLocaleTimeString()}, ${new Date(this.props.createdAt).toLocaleDateString()}`:null}</time>
                                    </div>
                                </div>
                                {cookies.userID === author_id
                                ? <p 
                                    contentEditable="true"
                                    className="comment-text"
                                    id = {this.props.rec_comment_id}
                                    onBlur={()=> this.updateCommentContent(comment_id, this.props.rec_comment_id)} 
                                    >{this.props.content}</p>
                                : <p className="comment-text">{this.props.content}</p>
                                }  
                            </div>
                        </div>
                    </div>
                </div>
            </>  
        );
    }
}