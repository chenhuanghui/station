import React, { useState, useEffect, useRef } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies'

// docs here: https://www.npmjs.com/package/javascript-time-ago
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

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
async function retrivePostByID(pID) {
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
            retrivePostByID(curPostID)
            .then (res => {
                console.log("res: ", res)
                currentComponent.setState({postContent:res})
            })
        }
    }

    render() {        
        const curPID = this.props.children.props.postID
        const {postContent} = this.state
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
                                        <img src={postContent ? postContent.fields.postByAvatar[0].url : "/assets/img/avatars/profiles/avatar-1.jpg"} alt={postContent && postContent.fields.postByName} className="avatar-img rounded-circle"/>
                                    </a>
                                </div>
                                <div className="col ml-n2">
                                    <h4 className="mb-1">{postContent && postContent.fields.postByName}</h4>
                                    <p className="card-text small text-muted"> 
                                        <span className="fe fe-clock mr-2"></span> 
                                        <time dateTime="2018-05-24">{postContent && postContent.fields.createdAt}</time>
                                    </p>
                                </div>
                            </div>

                        </div>

                        <p className="mb-3" dangerouslySetInnerHTML={{__html:postContent && postContent.fields.content}}></p>

                        <p className="text-center mb-3">
                            { postContent && postContent.fields.photos
                            ? 
                            <>
                                <img src={postContent.fields.photos[0].url} alt="..." className="img-fluid rounded"/>
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
                                        {/* <div className="col-auto mr-n3">
                                            <div className="avatar-group d-none d-sm-flex">
                                                <a href="profile-posts.html" className="avatar avatar-xs" data-toggle="tooltip" title="" data-original-title="Ab Hadley">
                                                    <img src="/assets/img/avatars/profiles/avatar-2.jpg" alt="..." className="avatar-img rounded-circle"/>
                                                </a>
                                                <a href="profile-posts.html" className="avatar avatar-xs" data-toggle="tooltip" title="" data-original-title="Adolfo Hess">
                                                    <img src="/assets/img/avatars/profiles/avatar-3.jpg" alt="..." className="avatar-img rounded-circle"/>
                                                </a>
                                                <a href="profile-posts.html" className="avatar avatar-xs" data-toggle="tooltip" title="" data-original-title="Daniela Dewitt">
                                                    <img src="/assets/img/avatars/profiles/avatar-4.jpg" alt="..." className="avatar-img rounded-circle"/>
                                                </a>
                                                <a href="profile-posts.html" className="avatar avatar-xs" data-toggle="tooltip" title="" data-original-title="Miyah Myles">
                                                    <img src="/assets/img/avatars/profiles/avatar-5.jpg" alt="..." className="avatar-img rounded-circle"/>
                                                </a>
                                            </div>
                                        </div> */}
                                        {/* <div className="col-auto">
                                            <a href="#!" className="btn btn-sm btn-white">Share</a>
                                        </div> */}
                                    </div>
                                </div>
                            </>
                            : null
                            }
                        </p>

                        <hr/>
                        <div className="comment mb-3">
                            <div className="row">
                                <div className="col-auto">
                                    <a className="avatar avatar-sm" href="profile-posts.html">
                                        <img src="/assets/img/avatars/profiles/avatar-2.jpg" alt="..." className="avatar-img rounded-circle"/>
                                    </a>
                                </div>
                                <div className="col ml-n2">
                                    <div className="comment-body">
                                        <div className="row">
                                            <div className="col">
                                                <h5 className="comment-title">Ab Hadley</h5>
                                            </div>
                                            <div className="col-auto">
                                                <time className="comment-time">11:12</time>
                                            </div>
                                        </div>
                                        <p className="comment-text">Looking good Dianna! I like the image grid on the left, but it feels like a lot to process and doesn't really <em>show</em> me what the product does? I think using a short looping video or something similar demo'ing the product might be better?</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="comment mb-3">
                            <div className="row">
                                <div className="col-auto">
                                    <a className="avatar avatar-sm" href="profile-posts.html">
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

                        <hr/>

                        <div className="row">
                            <div className="col-auto">

                                <div className="avatar avatar-sm">
                                    <img src="/assets/img/avatars/profiles/avatar-1.jpg" alt="..." className="avatar-img rounded-circle"/>
                                </div>
                            </div>
                            <div className="col ml-n2">

                                <form className="mt-1">
                                    <label className="sr-only">Leave a comment...</label>
                                    <textarea className="form-control form-control-flush" data-toggle="autosize" rows="1" placeholder="Leave a comment" style={{"overflow": "hidden", "overflowWrap": "break-word", "height": "40px"}}></textarea>
                                </form>
                            </div>
                            <div className="col-auto align-self-end">

                                <div className="text-muted mb-2">
                                    <a className="text-reset mr-3" href="#!" data-toggle="tooltip" title="" data-original-title="Add photo"> <i className="fe fe-camera"></i>
                                    </a>
                                    <a className="text-reset mr-3" href="#!" data-toggle="tooltip" title="" data-original-title="Attach file"> <i className="fe fe-paperclip"></i>
                                    </a>
                                    <a className="text-reset" href="#!" data-toggle="tooltip" title="" data-original-title="Record audio"> <i className="fe fe-mic"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
            </>     
        );
    }
}