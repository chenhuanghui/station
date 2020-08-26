// REACT LIBRARIES
import React, { useState, useEffect, useRef } from 'react';

// COMPONENT LIBRARIES
import NavBar from '../component/nav/nav_bar'
import PostInput from '../component/posts/post-input'
// COMPONENT LIBRARIES

export default class LayoutFeed extends React.Component {
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
            <NavBar />
            <div className="main-content">
                <div className="container-fluid">
                    <div className="row mt-4 mt-md-5 justify-content-center">
                        <div className="col-12 col-lg-10 col-xl-8">
                            <PostInput />
                        </div>
                    </div>
                </div>
            </div>
            
            </>
            
        );
    }
}