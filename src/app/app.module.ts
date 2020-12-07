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

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


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
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UtilProvider
  ]
})
export class AppModule { }
