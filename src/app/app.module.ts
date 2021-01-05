import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { User, Api } from '../providers';
import { MyApp } from './app.component';
import { UtilProvider } from '../providers/util/util';
import { GooglePlus } from '@ionic-native/google-plus';
import {Facebook} from "@ionic-native/facebook";
import { SocialSharing } from '@ionic-native/social-sharing';
import {FCM} from "@ionic-native/fcm";
import { Geolocation } from '@ionic-native/geolocation';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import {PayPal} from "@ionic-native/paypal";
import { FirebaseProvider } from '../providers/firebase/firebase';
import {AngularFireModule} from "angularfire2";
import {AngularFireDatabaseModule} from "angularfire2/database";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
/*mukesh account*/
export const firebaseConfig = {
  apiKey: "AIzaSyCJJjBYl5IbFf0ek9swTpDTPOzp05ZdnvI",
  authDomain: "towride.firebaseapp.com",
  databaseURL: "https://towride.firebaseio.com",
  projectId: "towride",
  storageBucket: "towride.appspot.com",
  messagingSenderId: "371839818852",
  appId: "1:371839818852:web:87618d9fa7fe33b11d5371",
  measurementId: "G-EJY5SLV85L"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Api,
    User,
    Camera,
    SplashScreen,
    StatusBar,
    Facebook,
    GooglePlus,
    SocialSharing,
    FCM,
    Geolocation,
    OpenNativeSettings,
    PayPal,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UtilProvider,
    FirebaseProvider
  ]
})
export class AppModule { }
