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
                                {this.props.avatar
                                ? <img src={this.props.avatar[0].url} alt={this.props.author} className="avatar-img rounded-circle"/>
                                : <img src="/assets/img/avatars/profiles/avatar-3.jpg" alt="..." className="avatar-img rounded-circle"/>
                                }
                            </a>
                        </div>
                        <div className="col ml-n2">
                            <div className="comment-body">
                                <p className="text-center mb-3">
                                    { this.props.photo
                                    ? 
                                    <img src={this.props.photo[0].url} alt="..." className="img-fluid rounded"/>
                                    : null
                                    }
                                </p>
                                <div className="row">
                                    <div className="col"><h5 className="comment-title">{this.props.author}</h5></div>
                                    <div className="col-auto">
                                        <time className="comment-time">{new Date(this.props.time).toLocaleTimeString()}, {new Date(this.props.time).toLocaleDateString()}</time>
                                    </div>
                                </div>
                                <p className="comment-text">{this.props.comment}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </>  
        );
    }
}