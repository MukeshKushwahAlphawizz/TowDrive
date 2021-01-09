import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  myLocation: any = '';
  address:any=''
  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public util:UtilProvider,
              public storage:Storage,
              public navParams: NavParams) {
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
    this.navCtrl.push('SetVehiclePage',{category:category});
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
}
