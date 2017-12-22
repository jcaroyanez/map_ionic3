import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GoogleMaps,GoogleMap,
        GoogleMapOptions, CameraPosition,
        LatLng, GoogleMapsEvent,
        Marker, MarkerOptions } from '@ionic-native/google-maps'
import { Geolocation,Geoposition } from '@ionic-native/geolocation'
import { Diagnostic } from '@ionic-native/diagnostic';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map_canvas') mapElement: ElementRef;
  map: GoogleMap;

  constructor(public navCtrl: NavController, private _googleMaps: GoogleMaps,
    public _geolocation: Geolocation, private _diagnostic: Diagnostic) {

  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    
    let loc: LatLng;
    
    ////crear el mapa//////////
    this.map = this._googleMaps.create('map_canvas');

    //////si el mapa esta listo////////
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {

      /////////verificar si el gps esta encendido///////
      this._diagnostic.isGpsLocationEnabled().then((rest) => {

        if (rest) {
          //////agregar el evento click al mapa //////// 
          this.map.addEventListener(GoogleMapsEvent.MAP_CLICK).subscribe((coord) => {

            let coorj = JSON.parse(coord);
            let latlng = new LatLng(coorj.lat,coorj.lng);

            ////agregando marcadores
            this.createMarker(latlng,'markes '+coorj.lat+"/"+coorj.lng).then((marker:Marker) => {
              ////agregando el evento click al mapa
              marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe((rest:any) =>{
                 
              })
            });
          });
          this.getLocation().then((rest: Geoposition) => {

          loc = new LatLng(rest.coords.latitude,rest.coords.longitude);
          this.moveCamera(loc);
          ////agregando marcadores
          this.createMarker(loc,'Marcador add').then((marker:Marker) => {
            marker.showInfoWindow();
            /////agregando el evento click al mapa
            marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe((rest) => {
              
            })
          }).catch(err => {
            alert('addMarker'+JSON.stringify(err));
          })

          }).catch((err) => {
            alert(err);
          });

        } else {

          alert('Por favor encender su gps');
          this._diagnostic.switchToLocationSettings();
        }
      }).catch((err) => {
        alert('Por favor encender su gps');
      })
    });


  }

  /////inicializar del mapa en una posición/////
  moveCamera(loc:LatLng){
    
    let mapOptions: GoogleMapOptions = {
      camera: {
        target:loc,
        zoom: 18,
        tilt: 30
      }
    };

    this.map.setOptions(mapOptions);
  }

  //////////devuelve la posición actual obtenida del gps////////
  getLocation() {
    return this._geolocation.getCurrentPosition();
  }
 
  ///////crear marcador////////
  createMarker(loc:LatLng,title:string){
   let markerOptions:MarkerOptions = {
     position:loc,
     title:title
   }
   return this.map.addMarker(markerOptions);
  }


}
