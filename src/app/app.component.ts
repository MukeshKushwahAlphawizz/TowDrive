import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import {Config} from "ionic-angular/index";
import {Storage} from "@ionic/storage";
import {FCM} from "@ionic-native/fcm";

@Component({
  template: `
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = '';

  firebaseToken: any = '';
  constructor(private translate: TranslateService, platform: Platform,
              private statusBar: StatusBar,
              private config: Config,
              public fcm: FCM,
              private storage: Storage,
              private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
        if (platform.is('cordova')) {
          this.getFirebaseToken();
        }
      this.statusBar.styleLightContent();
      this.splashScreen.hide();

      this.storage.get('userData').then(userData=>{
        if (userData){
          this.rootPage = 'MenuPage';
        }else {
          this.rootPage = 'SelectTypePage';
        }
      })
    });
    this.initTranslate();
  }

  initTranslate() {
    this.translate.setDefaultLang('en');
    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  getFirebaseToken() {
    this.fcm.subscribeToTopic('marketing');
    this.fcm.getToken().then(token => {
      this.firebaseToken = token;
      console.log('token >>>',this.firebaseToken);
    });

    this.fcm.onNotification().subscribe(data => {
      if(data.wasTapped){
        console.log("Received in background",data);
      } else {
        console.log("Received in foreground",data);
      }
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      // console.log('onTokenRefresh called !!!',token);
    });
    this.fcm.unsubscribeFromTopic('marketing');
  }
}
