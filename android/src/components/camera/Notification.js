import React, { Component } from 'react';
import {
  StyleSheet,
  Animated,
  Easing,
  Text,
  TouchableHighlight,
} from 'react-native';

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
      color: new Animated.Value(0),
    };
  }

  render() {
    return (
      <Animated.View style={
        { ...this.props.style,
          opacity: this.state.fadeAnim, } } >
        <Text style={styles.text} >New Timer</Text>
      </Animated.View>
    );
  }

  componentDidMount() {
    Animated.timing(  // Animate over time
      this.state.fadeAnim,  // The animated value to drive
      { toValue: 1 },  // Animate to opacity: 1, or fully opaque
    ).start();
  // this.state.color.interpolate({
  //   inputRange: [0, 140],
  //   outputRange: ['rgba(0, 0, 0, 1)', 'rgba(140, 140, 140, 1)'],
  // });
    setTimeout(() => {
      Animated.timing(
        this.state.fadeAnim,
        { toValue: 0,
          duration: 500, },
      ).start();
    }, 1000);
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'rgba(255, 255, 255, 1.0)',
    fontWeight: 'bold',
    fontSize: 28,
  },
});
