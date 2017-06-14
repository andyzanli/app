import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { NavigationActions } from'react-navigation';

import MapModal from './MapModal';

export default class Row extends Component {
  constructor() {
    super();
    this.state = {
      getImageText: `Get${'\n'}Photo`,
      image: [],
      animating: false,
      modalVisible: false,
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          {
            (this.props.selected === "Today's Tickets" || this.props.selected === "Today's Expired") ?
            <TouchableOpacity activeOpacity={.4} onPress={() => this.props.maximizeImage(this.props.data.mediaUri)}>
              <Image style={styles.image} source={{uri: this.props.data.mediaUri}} />
            </TouchableOpacity>
            :
            <TouchableOpacity activeOpacity={.4} style={styles.getImageButton} onPress={() => this._getImageFromDatabase() }>
              { this.state.image.length === 0 ? <Text style={styles.getImageText}>{this.state.getImageText}</Text> : this.state.image[0] }
            </TouchableOpacity>
          }

          <ActivityIndicator style={styles.activity} animating={this.state.animating} size='small' />
          <View>
            {
              this.props.data.license && this.props.data.VIN ?
              <Text><Text style={styles.label}>License:</Text> {this.props.data.license + '         '}
              <Text style={styles.label}>VIN:</Text> {this.props.data.VIN}</Text> :

              this.props.data.license ?

              <Text><Text style={styles.label}>License:</Text> {this.props.data.license}</Text> : null
            }
            <Text><Text style={styles.label}>Photo taken:</Text> {this._getPrettyTimeFormat(this.props.data.createdAt)}</Text>

            { this.props.data.ticketedAt !== 0 ? <Text><Text style={styles.label}>Ticketed:</Text> {this._getPrettyTimeFormat(this.props.data.ticketedAt)}</Text> : null }

            <Text><Text style={styles.label}>Time limit:</Text> {this._getTimeLimitDesc(this.props.data.timeLength)}</Text>
          </View>

          { this.props.data.latitude ?
            <TouchableOpacity
              style={styles.button}
              activeOpacity={.9}
              onPress={() => this.setState({modalVisible: true}) } >
              <View>
                <Text style={styles.buttonText}>Show Map</Text>
              </View>
            </TouchableOpacity>
            : null }
            
        </View>

        { this.state.modalVisible ? <MapModal
                                      data={this.props.data}
                                      navigation={this.props.navigation}
                                      visibility={this.state.modalVisible}
                                      latitude={this.props.data.latitude}
                                      longitude={this.props.data.longitude}
                                      description={this.props.data.description}
                                      closeModal={this.closeModal.bind(this)} /> : null }

      </View>
    );
  }

  componentWillUpdate() {
    if (this.props.dateTransition) {
      this.setState({image: []});
    }
  }

  _getTimeLimitDesc = (timeLimit) => {
    if (timeLimit < 1) {
      return `${timeLimit * 60} minutes`;
    } else {
      return `${timeLimit} ${timeLimit === 1 ? 'hour' : 'hours'}`;
    }
  }

  _getPrettyTimeFormat = (createdAt) => {
    let date = new Date(createdAt);
    let hour = date.getHours();
    let minutes = date.getMinutes() + '';
    minutes = minutes.length === 1 ? '0' + minutes : minutes;
    let period = (hour < 12) ? 'AM' : 'PM';
    hour = (hour <= 12) ? hour : hour - 12;
    let str = date + '';
    str = str.slice(0, 10);
    return `${hour}:${minutes} ${period} ${str}`;
  }

  // _openMapPage = (timer) => {
  //   const navigateAction = this.props.NavigationActions.navigate({
  //     routeName: 'Map',
  //     params: {timers: timer, historyView: true, navigation: this.props.navigation},
  //   });
  //   this.props.navigation.dispatch(navigateAction);
  // }

  _getImageFromDatabase() {
    this.setState({animating: true});
    let date = new Date(this.props.data.createdAt);
    let datePath=`${date.getMonth() + 1}-${date.getDate()}`;
    let refPath = `${this.props.userSettings.county}/${this.props.userId}/${datePath}`;
    let time = this.props.data.createdAt + '';
    this.props.getTicketImage(refPath, time, (url) => {
      if (url === null) {
        this.setState({
          image: [<View style={styles.getImageButton}><Text style={styles.getImageText}>Photo {'\n'}not{'\n'}available</Text></View>],
          animating: false,
        });
      } else {
        this.setState({
          image: [<TouchableOpacity
                    style={styles.maximizeImage}
                    activeOpacity={.8}
                    onPress={() => this.props.maximizeImage(url)}>
                      <Image style={{alignSelf: 'center', height: 400, width: 300}} source={{ uri: url }} />
                    </TouchableOpacity>],
          animating: false,
        });
      }
    });
  }

  closeModal() {
    this.setState({modalVisible: false});
  }

}

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  rowContainer: {
    flexDirection: 'row',
  },
  image: {
    height: 100,
    width: 100,
    marginRight: 15,
  },
  maximizeImage: {
    height: 100,
    width: 100,
    marginRight: 15,
  },
  label: {
    fontWeight: 'bold',
  },
  activity: {
    position: 'absolute',
    alignSelf: 'center',
    left: 40,
  },
  button: {
    backgroundColor: '#4286f4',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    height: 35,
  },
  buttonText: {
    color: 'white',
  },
  getImageButton: {
    backgroundColor: 'grey',
    height: 100,
    width: 100,
    marginRight: 15,
    borderWidth: 1,
    justifyContent: 'center',
  },
  getImageText: {
    color: 'white',
    textAlign: 'center',
  }
});
