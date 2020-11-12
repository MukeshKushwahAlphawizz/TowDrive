import {Component, ViewChild} from '@angular/core';
import {Events, IonicPage, Nav,NavParams, NavController, Platform} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import { SocialSharing } from '@ionic-native/social-sharing';
import {USERTYPE_DRIVER, UtilProvider} from "../../providers/util/util";


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
              public platform:Platform,
              private socialSharing: SocialSharing,
              public navParams: NavParams) {
    this.storage.get('userType').then(userType=>{
      if (userType == USERTYPE_DRIVER){
        this.rootPage = 'DriverHomePage';
        this.isDriver = true;
      }else {
        this.rootPage = 'HomePage';
        this.isDriver = false;
      }
    });
  }

  ionViewDidEnter() {
    this.storage.get('userData').then(userdata=>{
      this.userData = JSON.parse(userdata);
      console.log('userdata is ===',this.userData);
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
      this.platform.exitApp();
    }).catch(err=>{})
  }
}
