import React, { Component } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Image,
  Modal,
  TouchableNativeFeedback,
} from 'react-native';
import PropTypes from 'prop-types';

/* global require */
export default class ImageModal extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Modal animationType={"fade"}
        transparent={false}
        onRequestClose={() => this.props.maximizeImage()}
        visible={this.props.visibility} >
        <View>
          <Image style={styles.image} source={{uri: this.props.uri}} />

          <View style={styles.buttonContainer}>
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple('white')}
              onPress={() => this.props.maximizeImage()} >
              <View style={styles.arrowContainer}>
                <Image style={styles.backArrow} source={require('../../../../shared/images/backarrow.jpg')} />
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </Modal>
    );
  }

  componentWillMount() {
    const { height } = Dimensions.get('window');
    styles.image = {
      alignSelf: 'stretch',
      height: height - 85,
    };
  }
}

ImageModal.propTypes = {
  maximizeImage: PropTypes.func.isRequired,
  visibility: PropTypes.bool.isRequired,
  uri: PropTypes.string.isRequired,
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#4286f4',
    alignSelf: 'stretch',
  },
  arrowContainer: {
    justifyContent: 'center',
    width: '100%',
    height: 60,
  },
  backArrow: {
    marginLeft: 25,
    // width: 45,
    // height: 38,
  },
});