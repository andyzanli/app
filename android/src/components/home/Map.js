import React, { Component } from 'react';
import MapView from 'react-native-maps';
import {
  View,
  StyleSheet,
  Button,
  Image,
  ActivityIndicator,
} from 'react-native';
import Realm from 'realm';
import Navigation from './Header';

export default class Map extends Component {
  constructor() {
    super();
    this.state = {
      animating: true,
      markers: [],
    };
    this.animatedMap = undefined;
    this.latitude = undefined;
    this.longitude = undefined;
    this.realm = new Realm();
  }
  // static navigationOptions = {
  //   drawerLabel: 'Map',
  //   drawerIcon: ({ tintColor }) => (
  //     <Image
  //       source={require('../parked_logo_72x72.png')}
  //       style={[styles.icon, {tintColor: tintColor}]}
  //     />
  //   )
  // };

  componentWillMount() {
    let arr = this.props.navigation.state.params.timers;
    let res = [];
    arr.forEach(timer => {
       res.push(<MapView.Marker
       coordinate={{latitude: timer.latitude, longitude: timer.longitude}} />
    );});
    this.setState({markers: res});
    console.log('TIMERS LIST OF MARKERS', arr);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        let latitude = parseFloat(position.coords.latitude);
        let longitude = parseFloat(position.coords.longitude);
        this._animateToCoord(latitude, longitude);
      }, error => {
        console.log('Error loading geolocation:', error); //this.retryGeolocation();
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  render() {
    return (
      <View style={styles.container} >
        <Navigation navigation={this.props.navigation} />

        <ActivityIndicator
          animating={this.state.animating}
          style={styles.activity}
          size='large' />

        <MapView.Animated
          ref={ref => { this.animatedMap = ref; }}
          style={styles.map}
          mapType="hybrid"
          showsUserLocation={true}
          initialRegion={{
            latitude: 37.78926,
            longitude: -122.43159,
            latitudeDelta: 0.0048,
            longitudeDelta: 0.0020,
          }} >
            { this.state.markers }
        </MapView.Animated>
      </View>
    );
  }

  _animateToCoord(lat, long) {
      this.animatedMap._component.animateToCoordinate({
        latitude: lat,
        longitude: long,
      }, 1500);
      this.setState({animating: false});
    }

  setMarkers() {
    this.animatedMap._component.fitToSuppliedMarkers(this.state.markers);
  }
}
const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  activity: {
    flex: 1,
    zIndex: 10,
  }
});
