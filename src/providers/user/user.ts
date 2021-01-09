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
  get_vehicle_service : string = 'Users/get_vehicle_service';
  service_booking : string = 'Users//service_booking';
  get_notification_list : string = 'Users/get_notification_list';
  clear_notification : string = 'Users/clear_notification';
  driver_current_status : string = 'Users//driver_current_status';
  customer_history_list : string = 'Users/my_history_list';
  get_route_details : string = 'Users/get_route_details';
  //driver
  driver_register : string = 'Authentication/driver_register';
  getcontent : string = 'Authentication/getcontent';
  update_user_lat_lang : string = 'Users//update_user_lat_lang';
  get_service_booking_request : string = 'Drivers/get_service_booking_request';
  accept_booking_request : string = 'Drivers/accept_booking_request';
  trip_start_end : string = 'Drivers/trip_start_end';
  driver_history_list : string = 'Drivers/my_history_list';

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
    let header = new HttpHeaders({'Authorizations':token,'Role':role});
    let seq = this.api.post(this.profile_updateUrl, data,{headers:header}).share();
    return seq;
  }
  changePassword(data: any,token:any,role:any) {
    let header = new HttpHeaders({'Authorizations':token,'Role':role});
    let seq = this.api.post(this.changepasswordUrl, data,{headers:header}).share();
    return seq;
  }
  deleteAccount(data: any,token:any,role:any) {
    let header = new HttpHeaders({'Authorizations':token,'Role':role});
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
    let header = new HttpHeaders({'Authorizations':token});
    let seq = this.api.post(this.update_user_lat_lang, data,{headers:header}).share();
    return seq;
  }

  getContent(data: any) {
    let seq = this.api.post(this.getcontent, data).share();
    return seq;
  }

  getAllNotifications(data: any,token:any) {
    let header = new HttpHeaders({'Authorizations':token});
    let seq = this.api.post(this.get_notification_list, data,{headers:header}).share();
    return seq;
  }
  clearNotifications(data: any,token:any) {
    let header = new HttpHeaders({'Authorizations':token});
    let seq = this.api.post(this.clear_notification, data,{headers:header}).share();
    return seq;
  }
  getDriverStatus(data: any,token:any) {
    let header = new HttpHeaders({'Authorizations':token});
    let seq = this.api.post(this.driver_current_status, data,{headers:header}).share();
    return seq;
  }
  getHistory(data: any,token:any,type) {
    let header = new HttpHeaders({'Authorizations':token});
    if (type){
      //customer history
      let seq = this.api.post(this.customer_history_list, data,{headers:header}).share();
      return seq;
    }else {
      //driver history
      let seq = this.api.post(this.driver_history_list, data,{headers:header}).share();
      return seq;
    }
  }

  serviceBooking(data: any,token:any) {
    let header = new HttpHeaders({'Authorizations':token});
    let seq = this.api.post(this.service_booking, data,{headers:header}).share();
    return seq;
  }
  getAllBookingRequest(token:any) {
    let header = new HttpHeaders({'Authorizations':token});
    let seq = this.api.get(this.get_service_booking_request, '',{headers:header}).share();
    return seq;
  }
  acceptBooking(data: any,token:any) {
    let header = new HttpHeaders({'Authorizations':token});
    let res = this.api.post(this.accept_booking_request, data,{headers:header}).share();
    return res;
  }
  tripStartEnd(data: any,token:any) {
    let header = new HttpHeaders({'Authorizations':token});
    let res = this.api.post(this.trip_start_end, data,{headers:header}).share();
    return res;
  }
  getRouteDetail(data: any,token:any) {
    let header = new HttpHeaders({'Authorizations':token});
    let res = this.api.post(this.get_route_details, data,{headers:header}).share();
    return res;
  }
}
