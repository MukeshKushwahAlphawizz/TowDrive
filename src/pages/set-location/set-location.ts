import {Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";

declare var google;

@IonicPage()
@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})
export class SetLocationPage {
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  geocoder = new google.maps.Geocoder;
  map: any = '';
  category: any = '';
  isRequestSent:boolean=false;
  constructor(public navCtrl: NavController,
              private geolocation: Geolocation,
              public navParams: NavParams) {
    this.isRequestSent = navParams.data.isRequestSent;
    this.category = navParams.data.category;
  }

  ionViewDidLoad() {
    this.initMap();
  }
  createMap(latLng) {
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapNativeElement.nativeElement, mapOptions);
    let marker = new google.maps.Marker(
      {
        map: this.map,
        draggable: false,
        animation: google.maps.Animation.DROP,
        //icon: 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png',
        position: this.map.getCenter()
      });
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

  initMap() {
    this.geolocation.getCurrentPosition().then((data) => {
      console.log('lat >>',data.coords.latitude,' lng :',data.coords.longitude);
      let latLng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      this.createMap(latLng);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    /*let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      console.log('watch position >>',data.coords);
    });*/
  }

  //geocoder method to fetch address from coordinates passed as arguments
  getLatLngFromAddress(latlng) {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ 'latLng': latlng }, function(results, status) {
        if (status === 'OK') {
          resolve(results[0].geometry.location);
        }else {
          reject();
        }
      });
    });
  }
}
