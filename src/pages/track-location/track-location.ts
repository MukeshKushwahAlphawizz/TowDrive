import {Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var google;
@IonicPage()
@Component({
  selector: 'page-track-location',
  templateUrl: 'track-location.html',
})
export class TrackLocationPage {
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  map: any = '';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.createMap();
  }
  createMap() {
    let latLng = new google.maps.LatLng(-34.9290, 138.6010);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapNativeElement.nativeElement, mapOptions);

  }

  openNotif() {
    this.navCtrl.push('NotificationPage');
  }

  openChat() {
    this.navCtrl.push('ChatPage');
  }
}
