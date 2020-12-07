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
  vehicleService: any = '';
  lat: any = '';
  lng: any = '';
  address: any = '';

  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public user:User,
              public storage:Storage,
              public navParams: NavParams) {
    // this.requestData = {"username":"mukesh","email":"mk@gmail.com","mobile":"78945612345","password":"123456789","firebaseToken":""};
    this.requestData = JSON.parse(navParams.data.requestData);
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

  save() {
    if (this.vehicleService == ''){
      this.util.presentToast('Please select any vehicle service');
      return;
    }
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

  back() {
    this.navCtrl.pop();
  }

}
