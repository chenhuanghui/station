import React, { useState, useEffect, useRef } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies'

export default class CommentShow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }
    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
                
    }

    render() {
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
                                <p className="comment-text">{this.props.content}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </>  
        );
    }
}