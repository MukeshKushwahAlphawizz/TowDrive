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

  token:any = '';
  constructor(public navCtrl: NavController,
              private geolocation: Geolocation,
              public storage:Storage,
              public util:UtilProvider,
              public user:User,
              public navParams: NavParams) {
    this.storage.get('token').then(token=>{
      this.token = token;
    })
  }

  ionViewDidLoad() {
    this.getUserLocation();
  }

  openNotif() {
    this.navCtrl.push('NotificationPage');
  }

  accept() {
    this.navCtrl.push('TrackLocationPage');
  }

  getUserLocation() {
    console.log('getUserLocation called !!!!!!!!');
    this.geolocation.getCurrentPosition().then((data) => {
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
     this.user.updateDriverLatLng(data,this.token).subscribe(res=>{
     },error => {
       console.log(error);
     })
  }
}
