import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import {HttpHeaders} from "@angular/common/http";

@Injectable()
export class User {

  register : string = 'Authentication/register';
  loginUrl : string = 'Authentication/login';
  profile_updateUrl : string = 'Authentication/profile_update';
  changepasswordUrl : string = 'Authentication/changepassword';
  delete_accountUrl : string = 'Authentication/delete_account';
  socialLoginUrl : string = 'SocialLogin/Login';
  forgot_password : string = 'Authentication/forgot_password';
  //driver
  driver_register : string = 'Authentication/driver_register';
  getcontent : string = 'Authentication/getcontent';
  update_user_lat_lang : string = 'Users//update_user_lat_lang';

  constructor(public api: Api) { }

  login(accountInfo: any,role:any) {
    let header = new HttpHeaders({'Role':role});
    let seq = this.api.post(this.loginUrl, accountInfo,{headers:header}).share();
    return seq;
  }

  signup(accountInfo: any) {
    let seq = this.api.post(this.register, accountInfo).share();
    return seq;
  }

  socialLogin(data: any,role:any) {
    let header = new HttpHeaders({'Role':role});
    let seq = this.api.post(this.socialLoginUrl, data,{headers:header}).share();
    return seq;
  }
  updateProfile(data: any,token:any,role:any) {
    let header = new HttpHeaders({'Authorization':token,'Role':role});
    let seq = this.api.post(this.profile_updateUrl, data,{headers:header}).share();
    return seq;
  }
  changePassword(data: any,token:any,role:any) {
    let header = new HttpHeaders({'Authorization':token,'Role':role});
    let seq = this.api.post(this.changepasswordUrl, data,{headers:header}).share();
    return seq;
  }
  deleteAccount(data: any,token:any,role:any) {
    let header = new HttpHeaders({'Authorization':token,'Role':role});
    let seq = this.api.post(this.delete_accountUrl, data,{headers:header}).share();
    return seq;
  }
  signupDriver(data: any) {
    let seq = this.api.post(this.driver_register, data).share();
    return seq;
  }

  forgotPasswordApi(data: any,role:any) {
    let header = new HttpHeaders({'Role':role});
    let seq = this.api.post(this.forgot_password, data,{headers:header}).share();
    return seq;
  }

  updateDriverLatLng(data: any,token:any) {
    let header = new HttpHeaders({'Authorization':token});
    let seq = this.api.post(this.update_user_lat_lang, data,{headers:header}).share();
    return seq;
  }

  getContent(data: any) {
    let seq = this.api.post(this.getcontent, data).share();
    return seq;
  }
}
