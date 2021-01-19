import {Component, ViewChild} from '@angular/core';
import {Events, IonicPage, Nav,NavParams, NavController, Platform} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import { SocialSharing } from '@ionic-native/social-sharing';
import {USERTYPE_DRIVER, UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";


@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = '';
  appLanguage: string = '';
  userData : any = {};
  token: any = '';
  isDriver : boolean = false;
  constructor(public navCtrl: NavController,
              public storage:Storage,
              public util:UtilProvider,
              public user:User,
              public event:Events,
              public platform:Platform,
              private socialSharing: SocialSharing,
              public navParams: NavParams) {
    this.storage.get('userType').then(userType=>{
      if (userType == USERTYPE_DRIVER){
        let driverTripStartData = localStorage.getItem('userlat')
        console.log('check driver trip start data >>>>',driverTripStartData);
        if (driverTripStartData && driverTripStartData!=='null'){
          this.rootPage = 'TrackLocationPage';
        }else {
          this.rootPage = 'DriverHomePage';
        }
        this.isDriver = true;
      }else {
        storage.get('tripStartCustomerData').then(routeDetail=>{
          // console.log('routeDetail >>>',routeDetail);
          if (routeDetail){
            this.storage.set('isRequestSent',true).then(()=>{
              this.rootPage='SetLocationPage'
            });
          } else {
            this.rootPage = 'HomePage';
          }
        })

        this.isDriver = false;
      }
    });
  }

  ionViewDidEnter() {
    this.storage.get('userData').then(userdata=>{
      this.userData = JSON.parse(userdata);
    });
  }

  openPage(page) {
    this.nav.setRoot(page);
  }

  openEditProfile() {
    this.navCtrl.push('EditProfilePage');
  }

  menuOpen() {
    this.storage.get('userData').then(userdata=>{
      this.userData = JSON.parse(userdata);
    })
  }

  shareApp() {
    this.socialSharing.share('','','','').then(()=>{
    }).catch(err=>{
    })
  }

  exit() {
    this.util.presentConfirm('Confirm Exit','Are you Sure, you want to Exit?').then(res=>{
      this.util.presentLoader();
      this.user.logoutUser(this.userData.Authorization).subscribe(res=>{
        let resp : any = res;
        if (resp.status){
          this.event.publish('logout','');
          this.storage.set('userData',null);
          this.navCtrl.setRoot('SelectTypePage');
        }else {
          this.util.presentAlert('',resp.message);
        }
        setTimeout(()=>{
          this.util.dismissLoader();
        },300);
      },error => {
        console.error(error);
        this.util.dismissLoader();
      })
    }).catch(err=>{})
  }
}
