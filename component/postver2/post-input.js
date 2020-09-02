import React, { useState, useEffect, useRef } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import loadable from '@loadable/component';

import ImageAttachment from '../attachment/image-attachment'
// ====================================
// INIT GLOBAL VARIABLES
const cookies = parseCookies();
const AirtablePlus = require('airtable-plus');  
const ReactFilestack = loadable(() => import('filestack-react'), { ssr: false });

const airtableFEED = new AirtablePlus({
    baseID: process.env.AIR_TABLE_BASE_ID_FEED,
    apiKey: process.env.AIR_TABLE_API_KEY,
});

// FUNCTIONS GLOBAL
async function createPost(postContent, postAttachment, postToBrand, byUser) {
    try {
        let queryAttachment = []

        console.log("By User: ", byUser)
        if (postAttachment.length > 0) {
            postAttachment.map((urlItem, index)=> {
                queryAttachment.push({url: urlItem})
            })            
            console.log("queryAttachment: ", queryAttachment)
        }

        const createPost = await airtableFEED.create({
            content: postContent,
            attachments: queryAttachment,
            userID: byUser.ID.toString(),
            userName: byUser.name,
            userAvatar: byUser.avatar ? byUser.avatar[0].url : '',
            brandID: postToBrand.ID.toString()
        },{tableName:"Post"})

        // const createPostToBrand = await airtableFEED.create({
        //     brandID: postToBrand.ID.toString(),
        //     postID: createPost.fields.ID.toString(),
        //     createdAt: createPost.fields.createdAt
        // },{tableName:"Brand_Post"})

        // console.log("posttobrand: ", createPostToBrand)
        
        return createPost

    } catch(e) {
        console.log(e)
    }
}

function getAttachmentList(){
    var dataList = []
    $(".image-post").each(function(){
        dataList.push($(this).attr("data"))
    })
    return dataList
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

export default class PostInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            brand: null,
            postAttachment: [],
            isPosting: false
        }
    }
    componentDidMount() {
        let currentComponent = this
        
        $(".btn-action-post").click(function(){
            if (currentComponent.state.isPosting) return;
            btnQueryEffectStart($(this))
            var postContent = $("#post-content").val()
            var postAttachment = getAttachmentList()
            console.log("attachment: ", postAttachment)
            
            createPost(postContent, postAttachment, currentComponent.state.brand, currentComponent.state.user)
            .then(res => {
                console.log("post result: ", res)
                if (res) alert("Có lỗi xảy ra, vui lòng thực hiện lại")
                $("#post-content").val('')
                $(".image-post").remove()
                btnQueryEffectDone($(this))
            })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        let prevUser = prevState.user
        let curUser = this.props.user
        let prevBrand = prevState.brand
        let curBrand = this.props.brand

        if (prevUser !== curUser) {
            console.log("user UPDATED____", prevUser,'-->', curUser)
            this.setState({user:curUser})
        }

        if (prevBrand !== curBrand) {
            console.log("brand UPDATED____", prevBrand,'-->', curBrand)
            this.setState({brand:curBrand})
        }
    }

    addAttachment = (file) => {
        let curPostAttachment = this.state.postAttachment;
        curPostAttachment.push(file)
        this.setState({postAttachment:curPostAttachment})
    }

    render() {      
        const {postAttachment} = this.state
        return (
            <>
            {this.props.children}
            <div className="card post-input">
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <textarea className="form-control form-control-flush form-control-auto" id="post-content" data-toggle="autosize" rows="3" placeholder="Start a post..." style={{"overflow": "hidden", "overflowWrap": "break-word", "height": "68px"}}></textarea>
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
                                        this.addAttachment(res.filesUploaded[0])
                                    }}
                                />
                                
                                <button type="button" className="btn btn-primary btn-sm mr-3 btn-action-post">Post</button>
                            </div>
                        </div>
                    </div>

                    <hr className='dropdown-divider'/>
                    <div className="">
                        <span className="text-muted small">Đăng lên dòng thời gian của: </span>
                        <span className="font-weight-bold text-focus">{this.props.brand.name}</span>
                    </div>

                    <div className="file-upload-show" data="">
                        {
                            postAttachment.map((item, index) => (
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
            </div>       
            </>     
        );
    }
}