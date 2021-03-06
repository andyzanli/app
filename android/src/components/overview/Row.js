import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationActions } from'react-navigation';
import PropTypes from 'prop-types';

import {
  largeFontSize,
  mediumFontSize,
  primaryBlue,
  timerRowHeight,
  timerRowDescWidth,
  timerRowDistanceWidth,
  timerRowWidth,
  smallFontSize,
} from '../../styles/common';

/* global require */
export default class Row extends Component {
  constructor() {
    super();
    this.state = {
      distance: null
    };
  }

  render() {
    if (this.props.data.list.length <= 1 && (!Object.keys(this.props.data.list).length || this.props.data.list[0].createdAt === 0)) return (<View style={{flex: 1, flexDirection: 'row'}}></View>);
    return (
          <ScrollView
            directionalLockEnabled={true}
            horizontal={true}
            showsHorizontalScrollIndicator={false} 
            style={styles.innerScroll}
          >
            <View style={styles.innerContainer}>
              <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(primaryBlue, true)}
                onPress={() => this._openTimerListPage(this.props.data.list[0].index)}
              >

                <View style={styles.timerRowDesc}>
                  <Text style={styles.timerRowLength}>
                    { this.props.data.list.length }
                  </Text>
                  <View style={styles.separator} />
                  <Text style={styles.timerRowTime}>
                    { this._getTimeLeft(this.props.data.list[0]) }
                  </Text>
                </View>

              </TouchableNativeFeedback>

              <View style={styles.distanceContainer}>
                <TouchableOpacity
                  activeOpacity={.8}
                  onPress={() => this._openMapPage(this.props.data.list[0].index)} 
                  style={styles.button}
                >
                  <View>
                    <Text style={styles.buttonText}>Show Map</Text>
                  </View>
                </TouchableOpacity>
                <Text style={styles.distance}>
                  { 
                    (this.props.updatedLocation === true) ? 
                    this.state.distance ? this.state.distance : this._getDistance() : 
                    this.state.distance
                  }
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={.8}
                onPress={() => {this.props.deleteRow(this.props.data.list)}} 
                style={styles.delete}
              >
                <Image source={require('../../../../shared/images/bin.jpg')}/>
              </TouchableOpacity>
            </View>
          </ScrollView>
    );
  }

  componentWillMount() {
    var timerLengthPaddingLeft;
    if (this.props.data.list.length < 10) {
      timerLengthPaddingLeft = '10%';
    } else if (this.props.data.list.length < 100) {
      timerLengthPaddingLeft = '6%';
    } else {
      timerLengthPaddingLeft = '3%';
    }
    styles.timerRowLength = {
      fontSize: largeFontSize,
      color: primaryBlue,
      paddingLeft: timerLengthPaddingLeft,
      fontWeight: 'bold',
      textAlign: 'center',
    };
    this._getDistance();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.distance !== nextState.distance) return true;
    if (this.props.updatedLocation !== nextProps.updatedLocation) return true;
    return false;
  }

  componentWillUpdate() {
    var timerLengthPaddingLeft;
    if (this.props.data.list.length < 10) {
      timerLengthPaddingLeft = '10%';
    } else if (this.props.data.list.length < 100) {
      timerLengthPaddingLeft = '6%';
    } else {
      timerLengthPaddingLeft = '3%';
    }
    styles.timerRowLength = {
      fontSize: largeFontSize,
      fontWeight: 'bold',
      paddingLeft: timerLengthPaddingLeft,
      textAlign: 'center',
      color: primaryBlue,
    };
  }

  _getTimeLeft(timer: object): object {
    if (!timer) return;
    let timeLength = timer.timeLength * 60 * 60 * 1000;
    let timeSince = new Date() - timer.createdAt;
    let timeLeft = (timeLength - timeSince) / 1000;
      if (timeLeft < 0) {
      return <Text style={styles.timeUp}>Time is up!</Text>;
    } else if (timeLeft < 60) {
      return<Text style={styles.timeUpVeryNear}>less than a minute {'\n'}remaining</Text>;
    } else if (timeLeft < 3600) {
      if (timeLeft < 3600 / 4) return <Text style={styles.timeUpVeryNear}> {Math.floor(timeLeft / 60) === 1 ? '1 minute remaining' : Math.floor(timeLeft / 60) + ' minutes remaining'}</Text>;
      return <Text style={styles.timeUpNear}> {Math.floor(timeLeft / 60) === 1 ? '1 minute remaining' : Math.floor(timeLeft / 60) + ' minutes remaining'}</Text>;
    } else if (timeLeft > 3600) {
      return <Text style={styles.timeUpFar}>{Math.floor(timeLeft / 60 / 60)} hour {Math.floor((timeLeft % 3600) / 60)} minutes remaining</Text>;
    } else {
      return '';
    }
  }

  _getDistance(): string {
    let i = 0;
    var distLat;
    var distLong;
    while (i < this.props.data.list.length) {
      if (this.props.data.list[i].latitude !== 0) {
         distLat = this.props.data.list[i].latitude;
         distLong = this.props.data.list[i].longitude;
       }
      i++;
    }
    this._getDistanceFromLatLon(this.props.latitude, this.props.longitude, distLat, distLong);
  }

  _getDistanceFromLatLon(lat1: number, lon1: number, lat2: number, lon2: number): string {

    if (lat1 && lon1 && lat2 && lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = this._deg2rad(lat2-lat1);
      var dLon = this._deg2rad(lon2-lon1);
      var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this._deg2rad(lat1)) * Math.cos(this._deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c * 0.621371; // Distance in miles
      if (d < 0.1) {
        d = '< .1 mile';
      } else if (d < 0.5) {
        d = '< .5 mile';
      } else if (d < 1) {
        d = '< 1 mile';
      } else {
        d = d.toFixed(1) + ' miles';
      }
      this.setState({distance: d});
    }
  }

  _deg2rad(deg: number): number {
    return deg * (Math.PI/180)
  }

  _openMapPage(timersIndex: number): undefined {
    const navigateAction = NavigationActions.navigate({
      routeName: 'Map',
      params: {timersIndex, navigation: this.props.navigation},
    });
    this.props.navigation.dispatch(navigateAction);
  }

  _openTimerListPage(timerList: number): undefined {
    const navigateAction = NavigationActions.navigate({
      routeName: 'Timers',
      params: {timers: timerList},
    });
    this.props.navigation.dispatch(navigateAction);
  }

}

Row.propTypes = {
  navigation: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  updatedLocation: PropTypes.bool.isRequired,
  deleteRow: PropTypes.func.isRequired,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
};


const styles = StyleSheet.create({
  innerContainer: {
    alignItems: 'center',
    borderTopWidth: .5,
    flexDirection: 'row',
    width: timerRowWidth,
  },
  innerScroll: {
    flex: 1,
    flexDirection: 'row',
    height: timerRowHeight,
  },
  timerRowDesc: {
    alignItems: 'center',
    flexDirection: 'row',
    width: timerRowDescWidth,
  },
  separator: {
    borderWidth: .5,
    height: '35%',
    marginLeft: '2%',
  },
  timeUp: {
    color:'green',
    fontSize: largeFontSize,
    fontWeight: 'bold',
  },
  timeUpVeryNear: {
    color:'green',
    fontSize: mediumFontSize,
    fontWeight: 'bold',
  },
  timeUpFar: {
    fontSize: smallFontSize,
    fontWeight: 'bold',
  },
  timeUpNear: {
    color: primaryBlue,
    fontSize: mediumFontSize,
    fontWeight: 'bold',
  },
  timerRowTime: {
    paddingLeft: '5%',
  },
  distanceContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    width: timerRowDistanceWidth,
  },
  button: {
    alignItems: 'center',
    backgroundColor: primaryBlue,
    borderWidth: 1,
    borderRadius: 5,
    elevation: 4,
    justifyContent: 'center',
    padding: '3%',
  },
  buttonText: {
    color: 'white',
  },
  distance: {
    marginTop: '10%',
  },
  delete: {
    position: 'absolute',
    right: 0,
  },
});
