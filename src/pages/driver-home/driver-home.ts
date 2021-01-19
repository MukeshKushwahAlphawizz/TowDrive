import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from "@ionic-native/geolocation";
import { UtilProvider } from "../../providers/util/util";
import { User } from "../../providers";
import { Storage } from "@ionic/storage";
import {Events} from "ionic-angular/index";


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
    public storage: Storage,
    public util: UtilProvider,
    public events: Events,
    public user: User,
    public navParams: NavParams) {
    events.subscribe('logout',data=>{
      if (this.interval){
        clearInterval(this.interval)
      }
    })
    events.subscribe('bookingRequest',data=>{
      this.getAllRequest(true).then(data => {
      }).catch(err => {
      });
    })
  }

  ionViewDidLoad() {
    this.storage.get('userData').then(userData => {
      this.userData = JSON.parse(userData);
      this.getAllRequest(true).then(data => {
      }).catch(err => {
      });
      if (this.interval){
        clearInterval(this.interval);
      }
      this.getDriverLocation();
      this.interval = setInterval(() => {
        this.getDriverLocation();
      }, 8000);
    });
  }

  openNotif() {
    this.navCtrl.push('NotificationPage');
  }

  accept(detailData,isAccept) {
    console.log('detailData >>>>>>',detailData);
    localStorage.setItem("userlat", detailData.lat);
    localStorage.setItem("customerData", JSON.stringify(detailData));
    localStorage.setItem("userlang", detailData.lang);
    localStorage.setItem("userlocation", detailData.location);
    localStorage.setItem("booking_id", detailData.id);
    let data = {
      "request_id":detailData.id,
      "request_type":isAccept,
    }
    this.util.presentLoader();
    this.user.acceptBooking(data,this.userData.Authorization).subscribe(res=>{
      let resp : any = res;
      if (resp.status){
        this.util.presentAlert('',resp.message);
        if (isAccept){
          if (this.interval){
            clearInterval(this.interval);
          }
          this.navCtrl.push('TrackLocationPage');
        }else {
          this.getAllRequest(true).then(data => {
          }).catch(err => {
          });
        }
      }
      setTimeout(()=>{
        this.util.dismissLoader();
      },500)
    },error => {
      console.log(error);
      this.util.dismissLoader();
    });
  }
  getDriverLocation() {
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((data) => {
      this.updateDriverLocation(data.coords.latitude, data.coords.longitude)
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  updateDriverLocation(lat, lng) {
    let data = {
      latitude: lat,
      longitude: lng
    }
    this.user.updateDriverLatLng(data, this.userData.Authorization).subscribe(res => {
    }, error => {
      console.log(error);
    })
  }

  getAllRequest(showLoader) {
    return new Promise((resolve, reject) => {
      if (showLoader) this.util.presentLoader();
      this.user.getAllBookingRequest(this.userData.Authorization).subscribe(res => {
        let resp: any = res;
        if (resp.status){
          this.myallRequest = resp.data;
          this.allRequest = this.myallRequest;
          resolve(resp.data);
        }else {
          if (showLoader){
            this.allRequest = [];
          }
          reject(resp.message);
        }
        // console.log('this.allRequest >>',this.allRequest);
        this.allRequest.length && this.allRequest.length > 0?this.isListEmpty = false:this.isListEmpty = true;
        if (showLoader) {
          setTimeout(() => {
            this.util.dismissLoader();
          }, 500);
        }
      }, error => {
        console.error(error);
        if (showLoader) this.util.dismissLoader();
        this.allRequest.length && this.allRequest.length > 0?this.isListEmpty = false:this.isListEmpty = true;
        reject(error);
      })
    })
  }

  doRefresh(refresher) {
    this.isListEmpty = false;
    this.getAllRequest(false).then(data => {
      refresher.complete();
    }).catch(err => {
      console.log(err);
      refresher.complete();
    })
  }
}
