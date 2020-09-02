import React, { useState, useEffect, useRef } from 'react';
// ====================================
// INIT GLOBAL VARIABLES

export default class PostInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }
    componentDidMount() {
        $('.remove').click(function(){
            var uploadId = $(this).attr("data")
            console.log("remove ", uploadId)
            $(`#${uploadId}`).remove()
        })
    }

    componentDidUpdate(prevProps, prevState) {
        
    }

    render() {      
        return (
            <>
            {this.props.children}
            <div className='row align-items-center image-post' id={this.props.uploadId} data={this.props.url}>
                <div className='col-auto'>
                    <a href='#' className='avatar'>
                        <img src={this.props.url} alt='...' className='avatar-img rounded' />
                    </a>
                </div>
                <div className='col ml-n2'>
                    <h4 className='mb-1' id='image-post-title'>${this.props.filename}</h4>
                    <p className='card-text small'><span className='text-muted' id='image-post-filesize'>${this.props.mimetype}</span>
                    </p>
                </div>
                <div className="col-auto">
                    <span className="remove" data={this.props.uploadId}>x</span>
                </div>
            </div>
            </>     
        );
    }
}