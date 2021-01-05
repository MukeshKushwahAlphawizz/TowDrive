import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";


@IonicPage()
@Component({
  selector: 'page-driver-home',
  templateUrl: 'driver-home.html',
})
export class DriverHomePage {

  userData: any = {};
  allRequest: any = [];
  isListEmpty: boolean = false;
  interval: any;
  myallRequest: any;
  constructor(public navCtrl: NavController,
              private geolocation: Geolocation,
              public storage:Storage,
              public util:UtilProvider,
              public user:User,
              public navParams: NavParams) {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
      this.getAllRequest(true).then(data=>{
        this.allRequest = data;
        this.allRequest.length>0?this.isListEmpty=false:this.isListEmpty=true;
      }).catch(err=>{
        this.allRequest.length>0?this.isListEmpty=false:this.isListEmpty=true;
      });
    });
  }

  ionViewDidLoad() {
    this.getDriverLocation();
  }

  openNotif() {
    this.navCtrl.push('NotificationPage');
  }

  accept() {
    this.navCtrl.push('TrackLocationPage');
  }

  getDriverLocation() {
    console.log('getUserLocation called !!!!!!!!');
    this.geolocation.getCurrentPosition({enableHighAccuracy:true}).then((data) => {
      console.log('lat >>',data.coords.latitude,' lng :',data.coords.longitude);
      this.updateDriverLocation(data.coords.latitude,data.coords.longitude)
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      console.log('watch position >>',data.coords);
      this.updateDriverLocation(data.coords.latitude,data.coords.longitude)
    });
  }

   updateDriverLocation(lat,lng) {
     let data = {
       latitude:lat,
       longitude:lng
     }
     this.user.updateDriverLatLng(data,this.userData.Authorization).subscribe(res=>{
     },error => {
       console.log(error);
     })
  }

  getAllRequest(showLoader) {
    return new Promise((resolve, reject) => {
      if (showLoader)this.util.presentLoader();
      this.user.getAllBookingRequest(this.userData.Authorization).subscribe(res=>{
        let resp:any=res;
        if (resp.status){
          resolve(resp.data);
        }else {
          this.util.presentToast(resp.message);
          reject(resp.message);
        }
        if (showLoader){
          setTimeout(()=>{
            this.util.dismissLoader();
          },500);
        }
      },error => {
        console.error(error);
        if (showLoader)this.util.dismissLoader();
        reject(error);
      })
    })
  }

  doRefresh(refresher) {
    this.isListEmpty = false;
    this.getAllRequest(false).then(data=>{
      this.allRequest = data;
      this.allRequest.length>0?this.isListEmpty=false:this.isListEmpty=true;
      refresher.complete();
    }).catch(err=>{
      console.log(err);
      refresher.complete();
      this.allRequest.length>0?this.isListEmpty=false:this.isListEmpty=true;
    })
  }
}
