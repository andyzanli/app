import React, { Component } from 'react';
import {
  Animated,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { mediumFontSize, navBarContainerHeight, primaryBlue } from '../../styles/common';

export default class LocationView extends Component {
  constructor() {
    super();
    this.state = {
      description: '',
    };
    this.displayErrorAutoOnce = 0;
    this.timeout = null;
    this.top = new Animated.Value(-navBarContainerHeight);
  }

  render() {
    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: this.top,
          left: 0,
          right: 0,
          zIndex: 9,
        }}
      >
        <TouchableWithoutFeedback style={styles.touchable} onPress={() => this._hideAnimatedView()}>
          <View style={styles.textContainer}>
            <Text style={styles.description}> { this.state.description } </Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => this._hideAnimatedView()}>
          <View style={styles.circle}></View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.description && nextProps.fadeDescription) {
      this.setState({description: nextProps.description, fadeDescription: nextProps.fadeDescription});
      this._displayAnimatedView();
      if (nextProps.fadeDescription) setTimeout(() => this._hideAnimatedView(), 8000);
    } else if (nextProps.description === 'No location reminder found.' && !nextProps.fadeDescription && this.displayErrorAutoOnce === 0) {
      if (this.state.description !== 'No location reminder found.') this.setState({description: nextProps.description});
      this._displayAnimatedView();
      this.timeout = setTimeout(() => this._hideAnimatedView(), 7800);
      this.displayErrorAutoOnce++;
    } else if (nextProps.description) {
      this.setState({description: nextProps.description});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.description !== nextState.description) return true;
    if (this.props.fadeDescription !== nextProps.fadeDescription) return true;
    return false;
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  _displayAnimatedView() {
    Animated.timing(
      this.top,
      { toValue: navBarContainerHeight,
        duration: 1000 },
    ).start();
  }

  _hideAnimatedView() {
    Animated.timing(
      this.top,
      { toValue: -navBarContainerHeight,
        duration: 1000 },
    ).start();
  }
}

LocationView.propTypes = {
  description: PropTypes.string.isRequired,
  fadeDescription: PropTypes.bool,
}

const styles = StyleSheet.create({
  textContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderColor: primaryBlue,
    height: navBarContainerHeight,
    justifyContent: 'center',
    paddingLeft: '3%',
    paddingRight: '3%',
    zIndex: 9,
  },
  description: {
    color: primaryBlue,
    fontSize: mediumFontSize,
    textAlign: 'center',
  },
  touchable: {
    height: navBarContainerHeight + 10,
    width: '100%',
  },
  circle: {
    alignSelf: 'center',
    backgroundColor: primaryBlue,
    borderRadius: 15,
    height: 30,
    marginTop: -20,
    transform: [
      {scaleX: 2}
    ],
    width: 30,
    zIndex: 8,
  }
});
