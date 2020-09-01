import $ from 'jquery';
import React from 'react';
import Router from 'next/router';
import { parseCookies, setCookie, destroyCookie } from 'nookies'

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

async function getUser(emailLogin, passwordLogin) {
    try {
        const readUser = await airtableUSER.read({
            filterByFormula: `AND(email = "${emailLogin}", password= "${passwordLogin}")`,
            maxRecords: 1
        },{tableName:"User"})
        console.log("readUser: ", readUser)
        return readUser
    } catch(e) {
        console.log(e)
    }
}

function checkValidForm(formID) {
    var isValid = true
    $(`${formID} .required`).each(function(index){
        console.log(index, " - ", this)
        if ($(this).val().length === 0) isValid = false
    })
    return isValid
}

function showPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

export default class Signin extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            account:[]
        }
    }

    componentDidMount() {
        $("#tryToLoggin").click(function(){
            if (!checkValidForm(".sign-in-form")) {
                $("#notice").show()
                return;
            }
            btnQueryEffectStart($(this))
            getUser($("#username").val(), $("#password").val())
            .then(res => {
                if (res && res.length > 0) {
                    $("#notice").hide()
                    setCookie(null, 'isLoggedIn', true, {maxAge: 30 * 24 * 60 * 60,path: '/',})
                    setCookie(null, 'userID', res[0].fields.ID, {maxAge: 30 * 24 * 60 * 60,path: '/',})
                } else {
                    $("#notice").show()
                }
                btnQueryEffectDone($(this))
            })
        })
    }

    render() {
        return(
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-5 col-xl-4 my-5">
                        <h1 className="display-4 text-center mb-3">Đăng nhập</h1>
                        <p className="text-muted text-center mb-5">Hệ thống quản lý điểm kinh doanh được phát triển bởi CabinFood.</p>
                        
                        <div className="sign-in-form">
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-control required" id="username"/>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col"><label>Mật khẩu</label></div>
                                    <div className="col-auto"> 
                                        <a href="#" className="form-text small text-muted">Quên mật khẩu?</a>
                                    </div>
                                </div>

                                <div className="input-group input-group-merge">
                                    <input type="password" className="form-control form-control-appended required" placeholder="Nhập mật khẩu" id='password'/>
                                    <div className="input-group-append"> 
                                        <span className="input-group-text" onClick={() => showPassword()}><i className="fe fe-eye"></i></span>
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-lg btn-block btn-primary" type="button" id="tryToLoggin">Đăng nhập</button>
                                                        
                            <div className="alert alert-danger alert-dismissible hide mt-3" id='notice'>Thông tin không chính xác, xin nhập lại !</div>

                            <div className="text-center"> 
                                <small className="text-muted text-center">Chưa có tài khoản? <a href="#"> Đăng ký ngay</a>.</small>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <style jsx>{`
                    .show {display: block}
                    .hide {display: none}
                    .fe-eye :hover{
                        cursor: pointer
                    }
                `}</style>
            </div>
        )
    }
}