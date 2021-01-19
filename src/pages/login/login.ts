import { Component } from '@angular/core';
import { IonicPage, NavController,Platform } from 'ionic-angular';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";
import {USERTYPE_DRIVER, UtilProvider} from "../../providers/util/util";
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
import {GooglePlus} from "@ionic-native/google-plus";
import {HttpClient} from "@angular/common/http";
import {FCM} from "@ionic-native/fcm";
import {Events} from "ionic-angular/index";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginForm: FormGroup;
  error_messages : any = {};
  firebaseToken: any = '';
  userType: any = '';
  isDriver: boolean = false;
  role: any = '2';
  constructor(public navCtrl: NavController,
              public user : User,
              public platform : Platform,
              public util : UtilProvider,
              public storage : Storage,
              public fb: Facebook,
              public fcm: FCM,
              public events: Events,
              public httpClient: HttpClient,
              private googlePlus: GooglePlus,
              public formBuilder: FormBuilder) {
    platform.ready().then(() => {
      if (platform.is('cordova')) {
        this.getFirebaseToken();
      }
    });
    this.setupLoginFormData();
    this.storage.get('userType').then(userType=>{
      if (userType == USERTYPE_DRIVER){
        this.userType = userType;
        this.isDriver = true;
        this.role = '3';
      }
    });
  }

  setupLoginFormData() {
    this.error_messages = {
      email: [
        { type: "required", message: 'Username/Mobile No. is required' },
      ],

      password: [
        { type: "required", message: 'Password is required' }
      ],
    };
    this.loginForm = this.formBuilder.group(
      {
        email: new FormControl(
          "",
          Validators.compose([
            Validators.required,
          ])
        ),
        password: new FormControl(
          "",
          Validators.compose([
            Validators.required,
          ])
        ),
      },
    );
  }
  signIn() {
    this.util.presentLoader('');
    let data = {
      'mobile':this.loginForm.value.email,
      'password':this.loginForm.value.password,
      'Firebase_token':this.firebaseToken,
    }
    this.user.login(data,this.role).subscribe(res=>{
      let response : any = res;
      if (response.status){
        this.storage.set('token',response.data.Authorization);
        this.storage.set('userData',JSON.stringify(response.data));
        setTimeout(()=>{
          this.util.dismissLoader();
          this.navCtrl.setRoot('MenuPage');
        },500)
      }else {
        this.util.dismissLoader();
        this.util.presentToast(response.message);
      }
    },error => {
      console.error(error);
      this.util.dismissLoader();
      this.util.presentToast(error.error.message);
    })
  }


  create() {
    this.navCtrl.push('SignUpPage');
  }

  openForgotPass() {
    this.navCtrl.push('ForgotPasswordPage');
  }

  googleLogin(){
    this.googlePlus.login({})
      .then(res => {
        console.log('response ====>', res);
        let googleData : any = res;
        this.callSocialRegisterApi(googleData.givenName,googleData.email,googleData.imageUrl?googleData.imageUrl:'',2);
      })
      .catch(err => console.error('google error >>>>',JSON.stringify(err)));
  }

  fbLogin() {
    this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        let authResponse = res.authResponse;
        if (authResponse.accessToken) {
          this.httpClient.get(`https://graph.facebook.com/me?fields=name,email,picture.width(400).height(400)&access_token=${authResponse.accessToken}`).subscribe(
            data=> {
              let fbResponse:any = data;
              console.log(fbResponse);
              this.callSocialRegisterApi(fbResponse.name,fbResponse.email,fbResponse.picture.data.url?fbResponse.picture.data.url:'',1);
            },error => {
              console.log(error);
            }
          );
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  callSocialRegisterApi(name: any, email: any, profile: any, type: number) {
    this.util.presentLoader('');
    let data = {
      username:name,
      email:email,
      Firebase_token:this.firebaseToken,
      social_login:type
    }
    if (this.isDriver){
      let req = {
        email:email,
        username:name
      }
      this.user.socialCheck(req,this.role).subscribe(res=> {
        let resp: any = res;
        setTimeout(() => {
          this.util.dismissLoader();
        }, 500)
        if (resp.status) {
          //user already registered
          let userData : any = resp.data;
          this.storage.set('token',userData.Authorization);
          this.storage.set('isSocialLogin',true);
          this.storage.set('userData',JSON.stringify(userData)).then(()=>{
            this.navCtrl.setRoot('MenuPage');
          });
        }else {
          //user not registered, need to sign up
          this.navCtrl.push('VehicleDetailsPage',{requestData:JSON.stringify(data),isSocialLogin:true});
        }
      },error => {
        this.util.dismissLoader();
      })
    }else {
      this.user.socialLogin(data,this.role).subscribe(res=>{
        let resp : any = res;
        setTimeout(()=>{
          this.util.dismissLoader();
        },500)
        if (resp.status){
          let userData : any = resp.data;
          this.storage.set('token',userData.Authorization);
          this.storage.set('isSocialLogin',true);
          this.storage.set('userData',JSON.stringify(userData)).then(()=>{
            this.navCtrl.setRoot('MenuPage');
          });
        }else {
          this.util.presentToast(resp.message);
        }

      },error => {
        this.util.dismissLoader();
      })
    }
  }

  getFirebaseToken() {
    this.fcm.subscribeToTopic('marketing');
    this.fcm.getToken().then(token => {
      this.firebaseToken = token;
      console.log('token >>>',this.firebaseToken);
    });

    this.fcm.onNotification().subscribe(data => {
      if(data.wasTapped){
        console.log("Received in background",data);
      } else {
        console.log("Login page Received in foreground",data);
      }
      if (data.types === '1'){
        //vehicle service request
        this.util.presentAlert('Notification',data.body);
        this.events.publish('bookingRequest',data);
      }else if (data.types === '2'){
        //booking request accepted
        this.util.presentAlert('Notification',data.body);
        this.events.publish('bookingAccepted',data);
      }else if (data.types === '3'){
        //booking request declined
        this.util.presentAlert('Notification',data.body);
        this.events.publish('bookingRejected',true);
      }else if (data.types === '4'){
        //Trip Started
        this.util.presentAlert('Notification',data.body);
        this.events.publish('tripStarted',data);
      }else if (data.types === '5'){
        //Trip End
        this.util.presentAlert('Notification',data.body);
        this.events.publish('tripEnded',true);
      }
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      // console.log('onTokenRefresh called !!!',token);
    });
    this.fcm.unsubscribeFromTopic('marketing');
  }
}
