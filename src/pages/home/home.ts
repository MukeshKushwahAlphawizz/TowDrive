import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";
import {User} from "../../providers";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  myLocation: any = '';
  address:any=''
  recomService: any = [];
  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public util:UtilProvider,
              public user:User,
              public storage:Storage,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.getRecomServices();
  }
  ionViewDidEnter() {
    this.storage.get('myLocationObject').then(data=>{
      if (data && data.location){
        this.myLocation = data.location;
        this.address = data.address;
      }else {
        this.getCurrentLocation();
      }
    })
  }

  openLocationPage(category) {
    this.storage.set('isRequestSent',false).then(()=>{
      this.storage.set('selectedService',category).then(()=> {
        this.navCtrl.push('SetLocationPage');
      });
    });
    // this.navCtrl.push('SetVehiclePage',{category:category});
  }

  openNotif() {
    this.navCtrl.push('NotificationPage');
  }

  getCurrentLocation() {
    this.geolocation.getCurrentPosition({enableHighAccuracy:true}).then((data) => {
      this.util.getAddressFromLatLng({lat:data.coords.latitude,lng:data.coords.longitude}).then(address=>{
        this.myLocation = address;
        this.storage.set('myLocationObject',{location:this.myLocation,lat:data.coords.latitude,lng:data.coords.longitude,address:this.address})
      })
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  editLocation() {
    this.storage.set('isRequestSent',false).then(()=>{
      this.navCtrl.push('SetLocationPage');
    });
  }

  getRecomServices() {
    this.storage.get('userData').then(userData=>{
      this.util.presentLoader();
      let user : any = JSON.parse(userData);
      this.user.getRecommendedService(user.Authorization).subscribe(res=>{
        let resp : any = res;
        if (resp.status){
          this.recomService = resp.data;
        }
        this.util.dismissLoader();
      },error => {
        this.util.dismissLoader();
      })
    })
  }
}
