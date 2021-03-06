import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams,} from 'ionic-angular';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../providers";
import {USERTYPE_DRIVER, UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
import {HttpClient} from "@angular/common/http";
import {GooglePlus} from "@ionic-native/google-plus";
import {FCM} from "@ionic-native/fcm";
import {Events, Platform} from "ionic-angular/index";


@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  signUpForm: FormGroup;
  error_messages: any = {};
  firebaseToken: any = '';
  userType: any = '';
  isDriver: boolean = false;
  role: any = '2';
  constructor(public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public util:UtilProvider,
              public events:Events,
              public user : User,
              public storage : Storage,
              public fb: Facebook,
              public platform : Platform,
              public fcm: FCM,
              public httpClient: HttpClient,
              private googlePlus: GooglePlus,
              public navParams: NavParams) {
    platform.ready().then(() => {
      if (platform.is('cordova')) {
        this.getFirebaseToken();
      }
    });
    this.setupSignUpForm();
    this.storage.get('userType').then(userType=>{
      if (userType == USERTYPE_DRIVER){
        this.userType = userType;
        this.isDriver = true;
        this.role = '3';
      }
    });
  }

  signUp() {
    let data = {
      username : this.signUpForm.value.username,
      email : this.signUpForm.value.email,
      mobile : this.signUpForm.value.mobileNumber,
      password : this.signUpForm.value.password,
      firebaseToken:this.firebaseToken
    }
    if (this.isDriver){
      this.navCtrl.push('VehicleDetailsPage',{requestData:JSON.stringify(data),isSocialLogin:false});
    }else {
      this.navCtrl.push('PersonalDetailPage',{requestData:JSON.stringify(data)});
    }
  }

  setupSignUpForm() {
    this.error_messages = {
      username: [
        { type: "required", message: 'Username is required' },
      ],
      mobileNumber: [
        { type: "required", message: 'Mobile number is required' },
        { type: "pattern", message: '*Invalid number' },
        { type: "minlength", message: '*Minimum length should be 10' },
        { type: "maxlength", message: '*Maximum length should be 12' }
      ],
      email: [
        { type: "required", message: 'Email is required' },
        { type: "pattern", message: '*Enter valid email' },
      ],
      password: [
        { type: "required", message: 'Password is required' },
        { type: "minlength", message: '*Minimum length should be 8' },
        { type: "maxlength", message: '*Maximum length should be 12' }
      ]
    };
    /*var mobileNumberRegex = /^(?:(?:00)?44|0)7(?:[45789]\d{2}|624)\d{6}$/;
    if (phoneNumber.replace(/\D/g, '').test(mobileNumberRegex)) alert('Phone number is valid!');*/
    this.signUpForm = this.formBuilder.group(
      {
        username: new FormControl(
          "",
          Validators.compose([
            Validators.required,
          ])
        ),
        email: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
          ])
        ),
        mobileNumber: new FormControl(
          "", Validators.compose([Validators.required,
            Validators.pattern('^([0|\\+[0-9]{1,5})?([7-9][0-9]{9})$'),
            Validators.minLength(10),
            Validators.maxLength(12)
          ])
        ),
        password: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(12)
          ])
        )
      },
    );
  }

  ionViewDidLoad() {
  }

  back() {
    this.navCtrl.pop();
  }

  start() {
    this.navCtrl.push('PersonalDetailPage');
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
        console.log("SignUpPage Received in foreground",data);
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
