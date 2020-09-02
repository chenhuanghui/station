import $ from 'jquery';
import React from 'react';
import Router from 'next/router';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Link from 'next/link'

const AirtablePlus = require('airtable-plus');  
const airtableFEED = new AirtablePlus({
    baseID: process.env.AIR_TABLE_BASE_ID_FEED,
    apiKey: process.env.AIR_TABLE_API_KEY,
});
const airtableUSER = new AirtablePlus({
    baseID: process.env.AIR_TABLE_BASE_ID_USER,
    apiKey: process.env.AIR_TABLE_API_KEY,
});
const airtableSOPERATION = new AirtablePlus({
    baseID: process.env.AIR_TABLE_BASE_ID_SOPERATION,
    apiKey: process.env.AIR_TABLE_API_KEY,
});



export default class NavBarNew extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            account:[]
        }
    }

    componentDidMount() {        
    }

    render() {
        return(
            <>
                <nav className="navbar navbar-vertical fixed-left navbar-expand-md navbar-light" id="sidebar">
                    <div className="container-fluid">
                    {/* toggle button */}
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#sidebarCollapse" aria-controls="sidebarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* logo */}
                    <div className="navbar-brand">
                        { this.props.brand && this.props.brand.logo
                        ? <img src={this.props.brand.logo[0].url} className="navbar-brand-img mx-auto" />
                        : <img src="/assets/img/logo.png" className="navbar-brand-img mx-auto" />
                        }
                    </div>
                    
                    {/* menu user xs */}
                    <div className="navbar-user d-md-none">
                        <div className="dropdown">
                        <a href="#" id="sidebarIcon" className="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <div className="avatar avatar-sm avatar-online">
                                <img src={this.props.avatar} className="avatar-img rounded-circle" alt="..."/>
                            </div>
                        </a>

                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="sidebarIcon">                 
                            <hr className="dropdown-divider" />
                            <span className="dropdown-item logout">Logout</span>
                        </div>
                        </div>
                    </div>

                    <div className="collapse navbar-collapse" id="sidebarCollapse">
                        {/* menu group block */}
                        <ul className="navbar-nav">
                            <li className="nav-item">                                
                                <Link href="/feeds/[id]" as = {`/feeds/${this.props.brand_id}`}>
                                    <a className="nav-link active"><i className="fe fe-wind"></i> New Feed</a>
                                </Link>
                                
                                <Link href="#">
                                    <a className="nav-link"><i className="fe fe-home"></i> Ticket</a>
                                </Link>

                                <Link href="#">
                                    <a className="nav-link"><i className="fe fe-monitor"></i> Report</a>
                                </Link>
                            </li>

                        </ul>

                        <hr className="navbar-divider my-3" />
                        <div className="mt-auto"></div>

                        <div className="navbar-user d-none d-md-flex" id="sidebarUser">
                            <a href="#sidebarModalActivity" className="navbar-user-link" data-toggle="modal">
                                <span className="icon"><i className="fe fe-bell"></i></span>
                            </a>

                            {/* <DropUpWithImage /> */}
                            <div className="dropup">
                                <a href="#" id="sidebarIconCopy" className="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <div className="avatar avatar-sm avatar-online">
                                        <img src={this.props.avatar} className="avatar-img rounded-circle" alt="..."/>
                                    </div>
                                </a>
                                {/* Menu */}
                                
                                <div className="dropdown-menu" aria-labelledby="sidebarIconCopy">
                                    {/* <hr className="dropdown-divider" />                   */}
                                    <span className="dropdown-item logout">Logout</span>
                                </div>
                            </div>

                            {/* Icon */}
                            <a href="#sidebarModalSearch" className="navbar-user-link" data-toggle="modal">
                                <span className="icon">
                                <i className="fe fe-search"></i>
                                </span>
                            </a>
                        </div>
                    </div>
                    {/* end .navbar-collapse */}
                    </div>
                </nav>
            </>
        )
    }
}