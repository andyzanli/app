import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';

const height = Dimensions.get('window').height;

export default class MapModal extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Modal animationType={"slide"}
        transparent={true}
        onRequestClose={() => {}}
        visible={this.props.visibility} >
        <TouchableOpacity
          style={styles.closeContainer}
          onPress={() => this.props.closeModal()}>

        </TouchableOpacity>
        <View style={styles.mapContainer}>
          <MapView.Animated
            ref={ref => { this.animatedMap = ref; }}
            style={styles.map}
            mapType="hybrid"
            showsUserLocation={true}
            initialRegion={{
              latitude: this.props.latitude !== 0 ? this.props.latitude : 37.78926,
              longitude: this.props.longitude !== 0 ? this.props.longitude : -122.43159,
              latitudeDelta: 0.0108,
              longitudeDelta: 0.0060,
            }} >

            <Marker
              coordinate={{
                latitude: this.props.latitude,
                longitude: this.props.longitude}}
              title={this.props.description} >
              <Image
                source={require('../../../../shared/images/blue-pin.png')}
                style={{ width: 40, height: 40 }}
              />
            </Marker>

          </MapView.Animated>
        </View>
      </Modal>
    );
  }

  componentWillMount() {
    styles.closeContainer = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: height - 250,
    }
  }

}


const styles = StyleSheet.create({
  mapContainer: {
    position: 'absolute',
    top: 250,
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
});
