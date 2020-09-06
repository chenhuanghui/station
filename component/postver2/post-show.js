import React, { useState, useEffect, useRef } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import CommentShow from '../../component/commentsver2/comment-show'
import CommentInput from '../../component/commentsver2/comment-input'
import { Slide } from 'react-slideshow-image';
import { post } from 'jquery';
import ImageGallery from 'react-image-gallery';

const AirtablePlus = require('airtable-plus');  
const airtableFEED = new AirtablePlus({
    baseID: process.env.AIR_TABLE_BASE_ID_FEED,
    apiKey: process.env.AIR_TABLE_API_KEY,
});
const cookies = parseCookies();

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

async function getCommentByPostID (pID) {
    try {
        console.log("post ID: ", pID )
        const comment = await airtableFEED.read({
            filterByFormula: `postID = "${pID.toString()}"`,
            sort: [ {field: 'createdAt', direction: 'asc'},]
        },{tableName: "Comment"})
        
        console.log("queries Comment: ", comment)
        return comment
    }catch(e) {
        console.log(e)
    }    
}

async function updatePostContentByRecPostID (recPost, newContent) {
    try {
        const updatePost = await airtableFEED.update(recPost,{
            content: newContent
        },{tableName: "Post"})
        
        console.log("update Post: ", updatePost)
        return updatePost
    }catch(e) {
        console.log(e)
    }
}

async function updateReaction(recPostID, userID, type) {
    try {
        const readPost = await airtableFEED.find(recPostID,{tableName:"Post"})
        
        var reactionList
        if (type === 0) {
            if (readPost.fields.like) {
                reactionList = JSON.parse("[" + readPost.fields.like + "]")
            } else {reactionList = JSON.parse("[]")}
        } else {
            if (readPost.fields.dislike) {
                reactionList = JSON.parse("[" + readPost.fields.dislike + "]")
            } else {reactionList = JSON.parse("[]")}
        }
            
        var index = $.inArray(userID, reactionList)
        if (index === -1) {
            reactionList.push(userID)
            if (type === 0) {
                const reactionPost = await airtableFEED.update(recPostID,{
                    like: reactionList.toString()
                },{tableName: "Post"})
                return true
            } else {
                const reactionPost = await airtableFEED.update(recPostID,{
                    dislike: reactionList.toString()
                },{tableName: "Post"})
                return true
            }            
        } else return false
        
    } catch (e) {
        console.log(e)
    }
}

function countReaction(postObj) {
    if (!postObj) return 0

    var reactionList = []
    reactionList = JSON.parse("[" + postObj + "]")
    return reactionList.length
}

export default class PostShow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            post_id: null,
            comments : [],
            like: 0,
            dislike: 0,
            author_id: null,
            attachments: []
        }
    }
    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        var curPostId = this.props.post_id
        var prevPostId = prevState.post_id

        if (curPostId !== prevPostId) {
            console.log("post_id UPDATE___: ", prevPostId, '-->', curPostId)
            this.setState({post_id: curPostId})
            this.setState({like: countReaction(this.props.like)}) 
            this.setState({dislike: countReaction(this.props.dislike)}) 
            this.setState({author_id: this.props.author_id})
            console.log("attachments: ",this.props.attachments)            
            
            if (this.props.attachments) {
                var temp = []
                this.props.attachments.forEach(item => {
                    var t = {
                        original : item.url,
                        thumbnail: item.thumbnails.small.url
                    }
                    temp.push(t)
                })
                console.log("list attachments: ", temp)
                this.setState({attachments: temp})
            }            

            getCommentByPostID(curPostId)
            .then (commentRes => {
                console.log("comment: ", commentRes)
                this.setState({comments: commentRes})
            })
        }
    }

    reactionAction = (recPostID, userID, type) => {
        updateReaction(recPostID, userID, type)
        .then(res => {
            if (res === true && type === 0 ) this.setState({like: this.state.like + 1})
            if (res === true && type === 1 ) this.setState({dislike: this.state.dislike + 1})
        })        
    }

    updatePostContent = (postID, recPostID) => {
        console.log("onblur: ", postID, "-", recPostID, '*' , $(`#post-show-content-${postID}`).text())
        updatePostContentByRecPostID(recPostID, $(`#post-show-content-${postID}`).text())
        .then(res=> {
            console.log("update post content: ", res)
        })
    }

    render() {        
        const {author_id, post_id, comments, like, dislike, attachments} = this.state
        const slideProperties = {
            arrows: false,
            infinite: false,
            autoplay:false,
            indicators: true
        }

        const imageGalleryConfig = {
            showIndex : true,
            showBullets: true,
            showPlayButton: false,
            showNav: false,
            showThumbnails: false
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
                                        <img src={this.props.author_avatar} alt={this.props.author_name} className="avatar-img rounded-circle"/>                                        
                                    </a>
                                </div>
                                <div className="col ml-n2">
                                    <h4 className="mb-1">{this.props.author_name}</h4>
                                    <p className="card-text small text-muted"> 
                                        <span className="fe fe-clock mr-2"></span> 
                                        <time dateTime="2018-05-24">{this.props.created_at ? `${new Date(this.props.created_at).toLocaleTimeString()}, ${new Date(this.props.created_at).toLocaleDateString()}`:null}</time>
                                    </p>
                                </div>
                            </div>

                        </div>

                        { cookies.userID === author_id
                        ? 
                            <p contentEditable="true" 
                                className="mb-3 post-content" id={`post-show-content-${post_id}`}
                                onBlur={()=> this.updatePostContent(post_id, this.props.post_rec_id)} 
                                dangerouslySetInnerHTML={{__html:this.props.content.replace(/\n/g, "<br />")}}></p>
                        : 
                            <p className="mb-3 post-content" 
                                id={`post-show-content-${post_id}`} 
                                dangerouslySetInnerHTML={{__html:this.props.content.replace(/\n/g, "<br />")}}></p>
                        }
                        {attachments.length > 0
                        ?
                            <div className="row">
                                <div className="col mb-3">
                                    <ImageGallery  {...imageGalleryConfig}
                                        className="img-fluid rounded"
                                        items={attachments}
                                    />
                                </div>                            
                            </div>
                        : null
                        }
                        
                        {/* { this.props.attachments
                        ?    <div className="text-center mb-3">
                                <Slide {...slideProperties}>
                                    {this.props.attachments.map((each, index) => (
                                    <div key={index} style={{width: "100%"}}>
                                        {each.type === "image/jpeg" || each.type === "image/gif"
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
                        } */}

                        <div className="mb-3">
                            <div className="row">
                                <div className="col">
                                    <span 
                                        className="btn btn-sm btn-white mr-2" 
                                        onClick={() => this.reactionAction(this.props.post_rec_id, this.props.user.ID,0)}>
                                        👍 {like}
                                    </span>
                                    <span 
                                        className="btn btn-sm btn-white" 
                                        onClick={() => this.reactionAction(this.props.post_rec_id, this.props.user.ID,1)}>
                                        😬 {dislike}
                                    </span>
                                    
                                </div>
                                <div className="col-auto"></div>
                            </div>
                        </div>

                        <hr className='dropdown-divider'/>
                        <div id={`comment-block-${post_id}`}>
                            {comments && comments.map((item, index) => (
                                <CommentShow key={index}
                                comment_id = {item.fields.ID}
                                avatar = {item.fields.userAvatar ? item.fields.userAvatar : "/assets/img/avatars/profiles/avatar-1.jpg"}
                                content = {item.fields.content}
                                author = {item.fields.userName}
                                author_id = {item.fields.userID}
                                createdAt = {item.fields.createdAt}
                                attachments = {item.fields.attachments}
                                rec_comment_id = {item.id}
                                />
                            ))}
                        </div>
                        
                        <hr className='dropdown-divider'/>
                        <CommentInput
                            post_id= {post_id}
                            user = {this.props.user}
                        />
                    </div>
                </div>  
                <style jsx>{`
                .post-content-edit:hover{cursor: pointer}
                `}</style>
            </>     
        );
    }
}