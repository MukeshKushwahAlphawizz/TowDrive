import {Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";
import {Events} from "ionic-angular/index";
import {User} from "../../providers";
import {FirebaseProvider} from "../../providers/firebase/firebase";

declare var google;

@IonicPage()
@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})
export class SetLocationPage {
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  service = new google.maps.places.AutocompleteService();
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  autocompleteItemsSearch: any = [];
  autocompleteItemsSearchDestination: any = [];
  map: any = '';
  myLocation: any = '';
  isRequestSent:boolean=false;
  lat: any = '';
  lng: any = '';
  address: any = '';

  lat1:any='';
  long1:any='';
  lat2:any='';
  long2:any='';
  userData:any='';
  interval: any;
  routeDetail:any={}
  driver_id: any = '';
  booking_id: any = '';
  currentRoute: any = '';
  driverLocation: any = '';
  dropLocation: any = '';
  selectedService: any = '';
  droplat: any = '';
  droplng: any = '';
  sourceMarker = new google.maps.Marker;
  destinaitonMarker = new google.maps.Marker;
  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public util: UtilProvider,
              public user: User,
              public storage: Storage,
              public events: Events,
              public firedb: FirebaseProvider,
              public zone: NgZone,
              public navParams: NavParams) {
    storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
    })

    this.events.subscribe('tripEnded',data=>{
      if (this.interval){
        clearInterval(this.interval);
      }
      this.storage.set('tripStartCustomerData',null);
      this.navCtrl.setRoot('FeedbackPage',{routeDetail:this.routeDetail});
    });
  }

  ionViewDidEnter() {
    this.storage.get('isRequestSent').then(isRequestSent=>{
      this.isRequestSent = isRequestSent;
      if (this.isRequestSent){
        this.storage.get('tripStartCustomerData').then(routeDetail=>{
          // console.log('SetLocationPage routeDetail >>>',routeDetail);
          this.initMapAccept();
          if (routeDetail){
            this.routeDetail = routeDetail;
            this.currentRoute = routeDetail;
            this.currentRoute.location = this.routeDetail.current_location;
            this.driver_id = this.routeDetail.driver_id;
            if (this.interval){
              clearInterval(this.interval);
            }
            this.getDriverLatLng();
            this.interval = setInterval(()=>{
              this.getDriverLatLng();
            },5000);
          }else {
            this.storage.get('currentRoute').then(currentRoute=>{
              console.log('currentRoute>>>>>',currentRoute);
              this.currentRoute = currentRoute;
              if (currentRoute){
                this.booking_id = currentRoute.booking_id;
                this.driver_id = currentRoute.driver_id;
                this.getRouteDetail(this.booking_id);
              }
            })
          }
        })

      }else {

        this.storage.get('selectedService').then(selectedService=>{
          this.selectedService = selectedService;
          console.log('this.selectedService',this.selectedService);
          this.storage.get('myLocationObject').then(myLocationObject=>{
            this.myLocation = myLocationObject.location;
            this.lat = myLocationObject.lat;
            this.lng = myLocationObject.lng;
            this.address = myLocationObject.address;
            this.addSourceMarker(new google.maps.LatLng(myLocationObject.lat,myLocationObject.lng));
          })
        })

        this.initMap();
      }
    })
  }
  ngOnDestroy(){
    // console.log('ngOnDestroy called in SetLocation page !!!!');
    this.storage.set('selectedService','');
  }

  getDriverLatLng() {
    let data = {
      driver_id:this.driver_id
    }
    this.user.getDriverStatus(data,this.userData.Authorization).subscribe(res=>{
      let driverResp : any = res;
      if (driverResp.status){
        this.routeDetail.drop_latitude = driverResp.data.latitude;
        this.routeDetail.drop_longitude = driverResp.data.longitude;
        let to = new google.maps.LatLng(this.routeDetail.latitude, this.routeDetail.longitude);
        let from = new google.maps.LatLng(this.routeDetail.drop_latitude, this.routeDetail.drop_longitude);
        this.calculateAndDisplayRoute(from,to,this.routeDetail);
        if (this.driverLocation&&this.driverLocation!==''){
          //do nothing
        }else {
          this.util.getAddressFromLatLng({lat:parseFloat(driverResp.data.latitude),lng:parseFloat(driverResp.data.longitude)}).then(address=>{
            this.driverLocation = address;
          })
        }
      }
    },error => {})
  }

  getRouteDetail(id) {
    this.util.presentLoader();
    let data = {
      booking_id:id
    }
    this.user.getRouteDetail(data,this.userData.Authorization).subscribe(res=>{
      let resp :any = res;
      if (resp.status){
        this.routeDetail = resp.data[0];
        this.storage.set('tripStartCustomerData',this.routeDetail);
          this.driver_id = this.currentRoute.driver_id;
          if (this.interval){
            clearInterval(this.interval);
          }
          this.getDriverLatLng();
          this.interval = setInterval(()=>{
            this.getDriverLatLng();
          },5000);
        //this.calculateAndDisplayRoute(resp.data.current_location,resp.data.drop_location,this.routeDetail);
      }
      setTimeout(()=>{
        this.util.dismissLoader();
      },500);
    },error => {
      console.error(error);
      this.util.dismissLoader();
    })
  }

  back() {
    this.navCtrl.pop();
  }


  change(isDrop) {
    isDrop?this.dropLocation = '':this.myLocation = '';
  }

  set() {
    if (this.isRequestSent){
      this.storage.set('tripStartCustomerData',null);
      if (this.interval){
        clearInterval(this.interval);
      }
      this.navCtrl.setRoot('MenuPage');
    }else {
      if (this.selectedService && this.selectedService !==''){
        if (this.dropLocation ===''){
          this.util.presentToast('Please select the drop location');
          return;
        }
        this.util.presentLoader();
        let data = {
          service_id:this.selectedService,
          pick_location:this.myLocation,
          pick_latitude:this.lat,
          pick_longitude:this.lng,
          drop_location:this.dropLocation,
          drop_latitude:this.droplat,
          drop_longitude:this.droplng,
        }
        this.user.getDistancePrice(data).subscribe(res=>{
          this.util.dismissLoader();
          let resp : any = res;
          if (resp.status){
            let dropData = {
              drop_location:this.dropLocation,
              drop_latitude:this.droplat,
              drop_longitude:this.droplng,
            }
            this.navCtrl.push('SetVehiclePage',{category:this.selectedService, priceData:resp.data,dropData:dropData});
          }else {
            this.util.presentAlert('',resp.message);
          }
        },err=>{
          console.log(err);
          this.util.dismissLoader();
        })

      }else {
        /*this.storage.set('myLocationObject',{location:this.myLocation,lat:this.lat,lng:this.lng,address:this.address}).then(()=>{
          this.navCtrl.pop();
        });*/
        this.navCtrl.pop();
      }
    }
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
  }
  initMapAccept(){
    let mapOptions = {
      zoom: 7,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapNativeElement.nativeElement, mapOptions);
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
      this.storage.set('myLocationObject',{location:this.myLocation,lat:this.lat,lng:this.lng,address:this.address})
      this.addSourceMarker(new google.maps.LatLng(result['lat'], result['lng']));
      if (this.droplat !=='' && this.droplng !== ''){
        let to = new google.maps.LatLng(this.droplat, this.droplng);
        let from = new google.maps.LatLng(this.lat, this.lng);
        this.drawLine(from,to);
      }
    }).catch(err=>{
    });
  }

  onChangeDropLocation(event) {
    if (event == '') {
      this.autocompleteItemsSearchDestination = [];
      return;
    }
    const me = this;
    this.service.getPlacePredictions({ input: event }, function (predictions, status) {
      me.autocompleteItemsSearchDestination = [];
      me.zone.run(function () {
        if (predictions) {
          predictions.forEach(function (prediction) {
            me.autocompleteItemsSearchDestination.push(prediction);
          });
        }
      });
    });
  }
  chooseItemDestination(sourceData: any) {
    this.dropLocation = sourceData.description;
    this.autocompleteItemsSearchDestination = [];
    let geocoder = new google.maps.Geocoder;
    this.util.geocodeAddress(geocoder,this.dropLocation).then(result=>{
      this.droplat = result['lat'];
      this.droplng = result['lng'];
      this.addDestinationMarker(new google.maps.LatLng(result['lat'], result['lng']));
      let to = new google.maps.LatLng(this.droplat, this.droplng);
      let from = new google.maps.LatLng(this.lat, this.lng);
      this.drawLine(from,to);
    }).catch(err=>{
    });
  }

  addSourceMarker(location) {
    if (this.sourceMarker){
      this.sourceMarker.setMap(null);
    }
    this.sourceMarker = new google.maps.Marker({
      position: location,
      map: this.map,
      animation: google.maps.Animation.DROP,
    });
    this.map.setCenter(location);
  }

  addDestinationMarker(location) {
    if (this.destinaitonMarker){
      this.destinaitonMarker.setMap(null);
    }
    this.destinaitonMarker = new google.maps.Marker({
      position: location,
      map: this.map,
      animation: google.maps.Animation.DROP,
    });
    this.map.setCenter(location);
  }

  calculateAndDisplayRoute(from, to, allData:any) {
    const that = this;
    this.directionsService.route({
      origin:from,
      destination:to,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.lat1=allData.latitude;
        this.long1=allData.longitude;
        this.lat2=allData.drop_latitude;
        this.long2=allData.drop_longitude;
        that.directionsDisplay.setDirections(response);
        this.loadRouteMap();
      }
    });
  }

  loadRouteMap() {

    let startMarker = new google.maps.Marker({ position: {
        lat:parseFloat(this.lat2),
        lng:parseFloat(this.long2)
      }, map: this.map, icon: 'assets/img/truck-map.png' });

    startMarker = new google.maps.Marker({position: {
        lat:parseFloat(this.lat1),
        lng:parseFloat(this.long1)
      }, map: this.map, icon: 'assets/img/green-dot.png' });

    this.directionsDisplay.setMap(this.map,startMarker);
    this.directionsDisplay.setOptions({
      polylineOptions: {
        strokeColor: '#f27120'
      },
      suppressMarkers: true
    });
  }
  drawLine(from,to){
    const that = this;
    this.directionsService.route({
      origin:from,
      destination:to,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        that.directionsDisplay.setDirections(response);
        this.directionsDisplay.setMap(this.map);
        this.directionsDisplay.setOptions({
          polylineOptions: {
            strokeColor: '#f27120'
          },
          suppressMarkers: true
        });
      }
    });
  }

  openChat() {
    let driverData = {
      date_of_join:new Date().getTime(),
      id:this.routeDetail.driver_id+'_D',
      image:this.routeDetail.driver_image,
      isDriver:true,
      name:this.routeDetail.driver_name,
    }
    this.firedb.addUser(driverData,this.userData.id+'_C');
    let chatRef = this.userData.id+'_C'+'-'+driverData.id;
    this.navCtrl.push("ChatPage",{chatRef:chatRef,driver:driverData,customer:this.userData});
  }
}
