import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {USERTYPE_DRIVER, USERTYPE_RIDER} from "../../providers/util/util";

/**
 * Generated class for the SelectTypePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-type',
  templateUrl: 'select-type.html',
})
export class SelectTypePage {

  isDriver:boolean=false;
  isRider:boolean=true;
  constructor(public navCtrl: NavController,
              public storage : Storage,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  next() {
    if (this.isDriver){
      this.storage.set('userType',USERTYPE_DRIVER).then(()=>{
        this.navCtrl.push('LoginPage');
      });
    }else {
      this.storage.set('userType',USERTYPE_RIDER).then(()=>{
        this.navCtrl.push('LoginPage');
      });
    }
  }

  selectDriver() {
    this.isDriver=true;
    this.isRider=false;
  }
  selectRider() {
    this.isRider=true;
    this.isDriver=false;
  }
}
