import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-vehicle-details',
  templateUrl: 'vehicle-details.html',
})
export class VehicleDetailsPage {
  requestData : any = {
    username:'',
    email:'',
    mobileNumber:'',
    password:'',
    firebaseToken:''
  };
  vehicleRegistraion: any = '';
  drivingLicence: any = '';
  insuranceDoc: any = '';
  backgroundCheck: any = '';
  bankStatement: any = '';
  vehicleService: any = '';
  lat: any = '';
  lng: any = '';
  address: any = '';

  bank_name:any='';
  account_number:any='';
  account_holder_name:any='';
  bank_code:any='';
  branch_sort_code:any='';
  bank_statement:any='';
  isSocialLogin:boolean = false;
  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public user:User,
              public storage:Storage,
              public navParams: NavParams) {
    // this.requestData = {"username":"mukesh","email":"mk@gmail.com","mobile":"78945612345","password":"123456789","firebaseToken":""};
    this.requestData = JSON.parse(navParams.data.requestData);
    this.isSocialLogin = navParams.data.isSocialLogin;
    console.log('requestData ===>>',this.requestData);
  }

  ionViewDidLoad() {

  }
  vehicleRegistraionEvent(event) {
    this.vehicleRegistraion = event.target.files[0];
  };
  insuranceDocEvent(event) {
    this.insuranceDoc = event.target.files[0];
  };
  drivingLicenceEvent(event) {
    this.drivingLicence = event.target.files[0];
  };
  backgroundCheckEvent(event) {
    this.backgroundCheck = event.target.files[0];
  };
  bankStatementEvent(event) {
    this.bankStatement = event.target.files[0];
  };

  save() {
    if (this.isSocialLogin){
      if (this.validate()){
        this.util.presentLoader('');
        let formData = new FormData();
        formData.append('username',this.requestData.username);
        formData.append('email',this.requestData.email);
        formData.append('Firebase_token',this.requestData.firebaseToken);
        formData.append('social_login',this.requestData.social_login);
        formData.append('vehicle_registration',this.vehicleRegistraion);
        formData.append('driving_licence',this.drivingLicence);
        formData.append('insurance_doc',this.insuranceDoc);
        formData.append('background_check',this.backgroundCheck);
        formData.append('address',this.address);
        formData.append('vehicle_service',this.vehicleService);

        formData.append('bank_name',this.bank_name);
        formData.append('account_number',this.account_number);
        formData.append('account_holder_name',this.account_holder_name);
        formData.append('bank_code',this.bank_code);
        formData.append('branch_sort_code',this.branch_sort_code);
        formData.append('bank_statement',this.bankStatement);

        this.user.socialLogin(formData,'3').subscribe(res=>{
          let resp :any = res;
          this.util.presentAlert('',resp.message);
          if (resp.status){
            let userData : any = resp.data;
            this.storage.set('token',userData.Authorization);
            this.storage.set('isSocialLogin',true);
            this.storage.set('userData',JSON.stringify(userData)).then(()=>{
              this.navCtrl.setRoot('MenuPage');
            });
          }
          setTimeout(()=>{
            this.util.dismissLoader();
          },500);
        },error => {
          console.error(error);
          this.util.dismissLoader();
        })
      }
    }else {
      if (this.validate()){
        this.util.presentLoader('');
        let formData = new FormData();
        formData.append('username',this.requestData.username);
        formData.append('email',this.requestData.email);
        formData.append('mobile',this.requestData.mobile);
        formData.append('password',this.requestData.password);
        formData.append('Firebase_token',this.requestData.firebaseToken);
        formData.append('vehicle_registration',this.vehicleRegistraion);
        formData.append('driving_licence',this.drivingLicence);
        formData.append('insurance_doc',this.insuranceDoc);
        formData.append('background_check',this.backgroundCheck);
        formData.append('address',this.address);
        formData.append('vehicle_service',this.vehicleService);

        formData.append('bank_name',this.bank_name);
        formData.append('account_number',this.account_number);
        formData.append('account_holder_name',this.account_holder_name);
        formData.append('bank_code',this.bank_code);
        formData.append('branch_sort_code',this.branch_sort_code);
        formData.append('bank_statement',this.bankStatement);

        this.user.signupDriver(formData).subscribe(res=>{
          let resp :any = res;
          this.util.presentAlert('',resp.message);
          if (resp.status){
            this.storage.set('token',resp.data.Authorization);
            this.storage.set('userData',JSON.stringify(resp.data)).then(()=>{
              this.navCtrl.setRoot('MenuPage');
            });
          }
          setTimeout(()=>{
            this.util.dismissLoader();
          },500);
        },error => {
          console.error(error);
          this.util.dismissLoader();
        })
      }
    }
  }

  back() {
    this.navCtrl.pop();
  }

  validate() {
    if (this.vehicleRegistraion == ''){
      this.util.presentToast('Please add your Vehicle Registration');
      return false;
    }
    if (this.drivingLicence == ''){
      this.util.presentToast('Please add your Driving License');
      return false;
    }
    if (this.insuranceDoc == ''){
      this.util.presentToast('Please add your Insurance Document');
      return false;
    }
    if (this.backgroundCheck == ''){
      this.util.presentToast('Please add your Background Checks');
      return false;
    }

    if (this.vehicleService == ''){
      this.util.presentToast('Please select any vehicle service');
      return false;
    }

    if (this.bank_name == ''){
      this.util.presentToast('Please enter your Bank Name');
      return false;
    }

    if (this.account_number == ''){
      this.util.presentToast('Please enter your Account Number');
      return false;
    }

    if (this.branch_sort_code == ''){
      this.util.presentToast('Please enter your branch sort code');
      return false;
    }
    if (this.bankStatement == ''){
      this.util.presentToast('Please add your Bank Statement');
      return false;
    }
    return true;
  }
}
