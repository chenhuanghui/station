import React, { useState, useEffect, useRef } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies'

// docs here: https://www.npmjs.com/package/javascript-time-ago
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { Player } from 'video-react';
import { Slide } from 'react-slideshow-image';
import { Zoom } from 'react-slideshow-image';

const AirtablePlus = require('airtable-plus');  
const airtableFEED = new AirtablePlus({
    baseID: process.env.AIR_TABLE_BASE_ID_FEED,
    apiKey: process.env.AIR_TABLE_API_KEY,
});

async function getPostByID (pID) {
    try {
        console.log("post ID: ", pID )
        const post = await airtableFEED.read({
            filterByFormula: `ID = "${pID.toString()}"`,
            maxRecords: 1
        },{tableName: "Post"})
        console.log("queries post: ", post)
        if (post.length > 0) return post[0]
        else return []
    }catch(e) {
        console.log(e)
    }
    
}

export default class PostShow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            post_id: null,
            postData: []
        }
    }
    componentDidMount() {
        let currentComponent = this
    }

    componentDidUpdate(prevProps, prevState) {
        var curPostId = this.props.post_id
        var prevPostId = prevState.post_id

        if (curPostId !== prevPostId) {
            console.log("post_id UPDATE___: ", prevPostId, '-->', curPostId)
            getPostByID(curPostId)
            .then (post => {
                console.log(post)
                this.setState({post_id: curPostId})
                this.setState({postData: post.fields})
            }) 
        }
    }

    render() {        
        const {postData} = this.state
        const slideProperties = {
            arrows: false,
            infinite: false,
            autoplay:false,
            indicators: true
          }
        return (
            <>
                {this.props.children}
                <div className="card post-show">
                    <div className="card-body">
                        <div className="mb-3">
                            <div className="row align-items-center">
                                <div className="col-auto">
                                    <a href="#!" className="avatar">
                                        {postData && postData.userAvatar
                                        ?    <img src={postData.userAvatar} alt={postData.userName} className="avatar-img rounded-circle"/>
                                        :    <img src="/assets/img/avatars/profiles/avatar-1.jpg" alt={postData.userName} className="avatar-img rounded-circle"/>
                                        }
                                        
                                    </a>
                                </div>
                                <div className="col ml-n2">
                                    <h4 className="mb-1">{postData.userName}</h4>
                                    <p className="card-text small text-muted"> 
                                        <span className="fe fe-clock mr-2"></span> 
                                        <time dateTime="2018-05-24">{postData.createdAt ? `${new Date(postData.createdAt).toLocaleTimeString()}, ${new Date(postData.createdAt).toLocaleDateString()}`:null}</time>
                                        
                                    </p>
                                </div>
                            </div>

                        </div>

                        <p className="mb-3" dangerouslySetInnerHTML={{__html:postData && postData.content}}></p>
                        
                        { postData && postData.attachments
                        ?    <div className="text-center mb-3">
                                <Slide {...slideProperties}>
                                    {postData.attachments.map((each, index) => (
                                    <div key={index} style={{width: "100%"}}>
                                        {each.type === "image/jpeg"
                                        ? <img className="single_slider" style={{maxHeight:"640px"}} src={each.url} className="img-fluid rounded"/>
                                        : 
                                            <video width="320" height="640" controls>
                                                <source src={each.url} type="video/mp4"/>
                                            </video>
                                        }
                                    </div>
                                    ))}
                                </Slide>
                            </div>
                        : null
                        }
                        <div className="mb-3">
                            <div className="row">
                                <div className="col">
                                    <span className="btn btn-sm btn-white mr-2">
                                        👍 {postData && postData.like ? postData.like : 0}
                                    </span>
                                    <a href="#!" className="btn btn-sm btn-white">
                                        😬 {postData && postData.dislike ? postData.dislike : 0}
                                    </a>
                                    
                                </div>
                                <div className="col-auto"></div>
                            </div>
                        </div>

                        <hr className='dropdown-divider'/>
{/*                        <div id={`comment-block-${curPID}`}>
                            {comments && comments.map((item, index) => (
                                <CommentShow photo={item.fields.commentAttachments} author={item.fields.commentByName} avatar={item.fields.commentByAvatar} comment={item.fields.commentDesc} time={item.fields.createdAt} key={index}>
                                    <span className="hide"></span>
                                </CommentShow>
                            ))}
                        </div>
                        
                        
                        
                        <hr/>
                        <CommentInput>
                            <span className="hide" post={curPID}></span>
                        </CommentInput> */}
                    </div>
                </div>  
            </>     
        );
    }
}