import {Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var google;

@IonicPage()
@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})
export class SetLocationPage {
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  map: any = '';
  isRequestSent:boolean=false;
  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.isRequestSent = navParams.data.isRequestSent;
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

  back() {
    this.navCtrl.pop();
  }


  change() {
    // this.isRequestSent=true;
  }

  set() {
    if (this.isRequestSent){
      // this.isRequestSent = false;
      this.navCtrl.setRoot('MenuPage');
    }else {
      this.navCtrl.push('SetVehiclePage');
    }
  }
}
