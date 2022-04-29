import { Marker } from './Marker';

import GoogleMapReact from 'google-map-react';


const GoogleMap = props => {
    const lat = props.lat;
    const lng = props.lng;
    const size = props.size;

    const markerProps = {
        userLetter: props.userLetter,
        markerColour: props.markerColour
    }

    /*let latta;
    let longa;

    const initGeocoder = ({ maps }) => {
        const Geocoder = new maps.Geocoder();
        Geocoder.geocode({ 'address': `Brisbane` }, function (results, status) {
            if (status === window.google.maps.GeocoderStatus.OK) {
          

                latta = results[0].geometry.location.lat();
                longa = results[0].geometry.location.lng();
                console.log('lat', latta);
                console.log('long', longa);
   
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    };*/
    
    return(
        <div style={{ height: size, width: size}}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY}}
          defaultCenter={{lat: lat, lng: lng}}
          fullscreenControl={false}
          defaultZoom={14}
        //  yesIWantToUseGoogleMapApiInternals
         //onGoogleApiLoaded={initGeocoder}
          options={{fullscreenControl: false}}
        >
            <Marker
                lat={lat}
                lng={lng}
                props={markerProps}
            />
        </GoogleMapReact>
      </div>
    );
}

export default GoogleMap;