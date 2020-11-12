import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {
  private helpContent: any = '';

  constructor(public navCtrl: NavController,
              public util: UtilProvider,
              public user: User,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.getHelpContent();
  }

  openNotification() {
    this.navCtrl.push('NotificationPage');
  }

  getHelpContent() {
    let data = {
      "page_title":"help"
    }
    this.util.presentLoader('');
    this.user.getContent(data).subscribe((resp) => {
      let response :any= resp;
      if (response.status){
        this.helpContent = response.data[0].description;
      }
      setTimeout(()=>{
        this.util.dismissLoader();
      },500);
    }, (err) => {
      console.error('ERROR :', err);
      this.util.dismissLoader();
      this.util.presentToast(err.error.message);
    });
  }
}
