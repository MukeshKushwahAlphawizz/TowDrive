import {Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Geolocation } from "@ionic-native/geolocation";
import { UtilProvider } from '../../providers/util/util';
import { User } from '../../providers';
import {FirebaseProvider} from "../../providers/firebase/firebase";



declare var google;
@IonicPage()
@Component({
  selector: 'page-track-location',
  templateUrl: 'track-location.html',
})
export class TrackLocationPage {
  @ViewChild('map') mapElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  lat1:any='';
  long1:any='';
  lat2:any='';
  long2:any='';
  tripData:any={};
  userData:any={};
  map: any='';
  interval:any;
  customerlat: any='';
  customerlong: any='';
  customerlocation: any = '';
  driverlocation: any;
  booking_id: any = '';
  customerData: any = {};
  constructor(public navCtrl: NavController,
              public storage:Storage,
              public util:UtilProvider,
              public user:User,
              public firedb:FirebaseProvider,
              public geolocation:Geolocation,
              public navParams: NavParams) {
    this.customerData = JSON.parse(localStorage.getItem("customerData"));
    // console.log('this.customerData',this.customerData);
    this.customerlocation = localStorage.getItem("userlocation");
    this.customerlat = localStorage.getItem("userlat");
    this.customerlong = localStorage.getItem("userlang");
  }

  ionViewDidLoad() {
    this.initMap();
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
      if (this.interval){
        clearInterval(this.interval);
      }
      this.getDriverLocation();
      this.interval = setInterval(()=>{
        this.getDriverLocation();
      },5000)
    })
  }
  getDriverLocation() {
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((data) => {
      this.updateDriverLocation(data.coords.latitude, data.coords.longitude)
      let latLng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      this.util.getAddressFromLatLng(latLng).then(address=>{
        this.driverlocation = address;
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  updateDriverLocation(lat, lng) {
    let data = {
      latitude: lat,
      longitude: lng
    }
    this.user.updateDriverLatLng(data, this.userData.Authorization).subscribe(res => {
      let to = new google.maps.LatLng(this.customerlat, this.customerlong);
      let from = new google.maps.LatLng(lat, lng);
      this.tripData.lat = lat;
      this.tripData.lng = lng;
      this.calculateAndDisplayRoute(from,to,this.tripData,this.customerlat,this.customerlong);
    }, error => {
      console.log(error);
    })
  }
  calculateAndDisplayRoute(from, to, allData:any, userlat, userlong) {
    const that = this;
    this.directionsService.route({
      origin:from,
      destination:to,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        that.lat2=userlat;
        that.long2=userlong;
        that.lat1=allData.lat;
        that.long1=allData.lng;
        that.directionsDisplay.setDirections(response);
        that.loadMap();
      }
    });
  }
  loadMap(){
    let startMarker = new google.maps.Marker({ position: {
        lat:parseFloat(this.lat1),
        lng:parseFloat(this.long1)
      }, map: this.map, icon: 'assets/img/truck-map.png' });

    startMarker = new google.maps.Marker({position: {
        lat:parseFloat(this.lat2),
        lng:parseFloat(this.long2)
      }, map: this.map, icon: 'assets/img/green-dot.png' });

    this.directionsDisplay.setMap(this.map,startMarker);
    this.directionsDisplay.setOptions({
      polylineOptions: {
        strokeColor: '#f27120'
      },
      suppressMarkers: true
    });
  }

  initMap(){
    let latLng = new google.maps.LatLng(this.lat1,this.long1);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  openNotif() {
    this.navCtrl.push('NotificationPage');
  }

  openChat() {
    let customer = {
      date_of_join:new Date().getTime(),
      id:this.customerData.user_id+'_C',
      image:this.customerData.image,
      isDriver:false,
      name:this.customerData.first_name+' '+this.customerData.last_name
    }
    this.firedb.addUser(customer,this.userData.id+'_D');
    let chatRef = this.customerData.user_id+'_C'+'-'+this.userData.id+'_D';
    this.navCtrl.push('ChatPage',{chatRef:chatRef,customer:customer,driver:this.userData});
  }
  startEnd(status){
    this.booking_id = localStorage.getItem("booking_id");
    this.util.presentConfirm('Trip End','Are you sure want to end the trip?').then(()=>{
      this.util.presentLoader();
      let data = {
        "booking_request_id":this.booking_id,
        "trip_status":status,
      }
      this.user.tripStartEnd(data,this.userData.Authorization).subscribe(res=>{
        let resp : any = res;
        if (resp.status){
          localStorage.setItem('userlat',null);
          this.navCtrl.setRoot("MenuPage");
        }else {
          this.util.presentToast(resp.message);
        }
        setTimeout(()=>{
          this.util.dismissLoader();
        },500)
      },error => {
        console.error(error);
        this.util.dismissLoader();
      })
    }).catch(()=>{})
  }
  ngOnDestroy(){
    if (this.interval){
      clearInterval(this.interval);
    }
  }
}
