import {Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";

declare var google;

@IonicPage()
@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})
export class SetLocationPage {
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  service = new google.maps.places.AutocompleteService();
  autocompleteItemsSearch: any = [];
  map: any = '';
  myLocation: any = '';
  isRequestSent:boolean=false;
  marker:any='';
  lat: any = '';
  lng: any = '';
  address: any = '';
  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public util: UtilProvider,
              public storage: Storage,
              public zone: NgZone,
              public navParams: NavParams) {
    this.isRequestSent = navParams.data.isRequestSent;
    storage.get('myLocationObject').then(myLocationObject=>{
      this.myLocation = myLocationObject.location;
      this.lat = myLocationObject.lat;
      this.lng = myLocationObject.lng;
      this.address = myLocationObject.address;
      this.addNewMarker(new google.maps.LatLng(myLocationObject.lat,myLocationObject.lng));
    })
  }

  ionViewDidLoad() {
    this.initMap();
  }

  back() {
    this.navCtrl.pop();
  }


  change() {
    this.myLocation = '';
  }

  set() {
    this.storage.set('myLocationObject',{location:this.myLocation,lat:this.lat,lng:this.lng,address:this.address}).then(()=>{
      this.navCtrl.pop();
    });
  }

  initMap(){
    let latLng = new google.maps.LatLng(this.lat,this.lng);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapNativeElement.nativeElement, mapOptions);
    /*this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((resp) => {
      console.log('lat >>',resp.coords.latitude,'lng >>',resp.coords.longitude);
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.addNewMarker(latLng);
    }).catch(err=>{
      console.log('google map error :',err);
    });*/
    /*let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      console.log('watch position >>',data.coords);
    });*/
  }
  onChangeLocation(event) {
    if (event == '') {
      this.autocompleteItemsSearch = [];
      return;
    }
    const me = this;
    this.service.getPlacePredictions({ input: event }, function (predictions, status) {
      me.autocompleteItemsSearch = [];
      me.zone.run(function () {
        if (predictions) {
          predictions.forEach(function (prediction) {
            me.autocompleteItemsSearch.push(prediction);
          });
        }
      });
    });
  }
  chooseItemSource(sourceData: any) {
    this.myLocation = sourceData.description;
    this.autocompleteItemsSearch = [];
    let geocoder = new google.maps.Geocoder;
    this.util.geocodeAddress(geocoder,this.myLocation).then(result=>{
      this.lat = result['lat'];
      this.lng = result['lng'];
      this.addNewMarker(new google.maps.LatLng(result['lat'], result['lng']));
    }).catch(err=>{
    });
  }
  addNewMarker(location) {
    if (this.marker){
      this.marker.setMap(null);
    }
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      animation: google.maps.Animation.DROP,
    });
    this.map.setCenter(location);
  }
}
