import React, { useState, useEffect, useRef } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies'

// docs here: https://www.npmjs.com/package/javascript-time-ago
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'


// COMPONENT
import CommentInput from '../../component/comments/comment-input'
import CommentShow from '../../component/comments/comment-show'

// ====================================
// INIT GLOBAL VARIABLES
const AirtablePlus = require('airtable-plus');  
const airtable = new AirtablePlus({
    baseID: process.env.AIR_TABLE_BASE_ID_STATION,
    apiKey: process.env.AIR_TABLE_API_KEY_STATION,
});
const cookies = parseCookies();
TimeAgo.addLocale(en)

// FUNCTIONS GLOBAL
async function retrievePostByID(pID) {
    try {
        const postRetrieve = await airtable.read({
            filterByFormula: `ID = "${pID}"`,
            maxRecords:1
        },{tableName:"Post"});
        return postRetrieve[0]

      } catch(e) {
        console.error(e);
      }
}

async function retrieveCommentByPostID(pID) {
    try {
        const commentPostRetrieve = await airtable.read({
            filterByFormula: `Post = "${pID}"`,
            sort: [ {field: 'createdAt', direction: 'asc'},]
        },{tableName:"PostComment"});
        return commentPostRetrieve

      } catch(e) {
        console.error(e);
      }
}

export default class PostShow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            postID : null,
            postContent : null,
            comments : []
        }
    }
    componentDidMount() {
        
    }

    componentDidUpdate(prevProps, prevState) {
        let currentComponent = this
        let curPostID = this.props.children.props.postID
        let prevPostID = currentComponent.state.postID
        console.log("curpost: ", curPostID)
        console.log("prevPostID: ", prevPostID)

        if(curPostID !== prevPostID) {
            console.log('___UPDATED')
            currentComponent.setState({postID:curPostID})
            
            retrievePostByID(curPostID)
            .then (res => {
                console.log("post: ", res)
                currentComponent.setState({postContent:res})
            })

            retrieveCommentByPostID(curPostID)
            .then (res => {
                console.log("comment: ", res)
                currentComponent.setState({comments:res})
            })
        }
    }

    render() {        
        const curPID = this.props.children.props.postID
        const {postContent, comments} = this.state
        const timeAgo = new TimeAgo('en-US')
        // {timeAgo.format(Date.now() - 60 * 1000,'twitter')}
        return (
            <>
                {this.props.children}
                <div className="card">
                    <div className="card-body">
                        <div className="mb-3">
                            <div className="row align-items-center">
                                <div className="col-auto">
                                    <a href="#!" className="avatar">
                                        {postContent && postContent.fields.postByAvatar
                                        ?    <img src={postContent.fields.postByAvatar[0].url} alt={postContent && postContent.fields.postByName} className="avatar-img rounded-circle"/>
                                        :    <img src="/assets/img/avatars/profiles/avatar-1.jpg" alt={postContent && postContent.fields.postByName} className="avatar-img rounded-circle"/>
                                        }
                                        
                                    </a>
                                </div>
                                <div className="col ml-n2">
                                    <h4 className="mb-1">{postContent && postContent.fields.postByName}</h4>
                                    <p className="card-text small text-muted"> 
                                        <span className="fe fe-clock mr-2"></span> 
                                        <time dateTime="2018-05-24">{postContent && postContent.fields.createdAt ? `${new Date(postContent.fields.createdAt).toLocaleTimeString()}, ${new Date(postContent.fields.createdAt).toLocaleDateString()}`:null}</time>
                                        
                                    </p>
                                </div>
                            </div>

                        </div>

                        <p className="mb-3" dangerouslySetInnerHTML={{__html:postContent && postContent.fields.content}}></p>

                        <p className="text-center mb-3">
                            { postContent && postContent.fields.photos
                            ? 
                            <img src={postContent.fields.photos[0].url} alt="..." className="img-fluid rounded"/>
                            : null
                            }
                        </p>
                        <div className="mb-3">
                            <div className="row">
                                <div className="col">
                                    <span className="btn btn-sm btn-white mr-2">
                                        👍 {postContent && postContent.fields.like}
                                    </span>
                                    <a href="#!" className="btn btn-sm btn-white">
                                        😬 {postContent && postContent.fields.dislike}
                                    </a>
                                    
                                </div>
                                <div className="col-auto"></div>
                            </div>
                        </div>

                        <hr/>
                        
                        {comments && comments.map((item, index) => (
                            <CommentShow photo={item.fields.commentAttachments} author={item.fields.commentByName} avatar={item.fields.commentByAvatar} comment={item.fields.commentDesc} time={item.fields.createdAt} key={index}>
                                <span className="hide"></span>
                            </CommentShow>
                        ))}
                        
                        
                        <hr/>
                        <CommentInput>
                            <span className="hide" post={curPID}></span>
                        </CommentInput>
                    </div>
                </div>  
            </>     
        );
    }
}