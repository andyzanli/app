import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  Keyboard,
  Animated,
} from 'react-native';

import Search from '../search';

export default class Navigation extends Component {
  constructor() {
    super();
    this.state = {
      titleOpacity: new Animated.Value(0),
      search: false,
    };
  }

  render() {
    return (

      <View style={styles.container}>
      {

        this.state.search ?

        <Search
          navigation={this.props.navigation}
          closeSearch={this.closeSearch.bind(this)}
          defaultSearch={this.props.search}
          handleVINSearch={this.props.handleVINSearch ? this.props.handleVINSearch : null} /> :

        <View style={styles.headerContainer} >
          <TouchableHighlight
            onPress={ () => {
              Animated.timing(
                this.state.titleOpacity,
                { toValue: 0,
                  duration: 500, },
              ).start();
              this.props.toggleSearching ? this.props.toggleSearching() : null;
              this.setState({
                search: !this.state.search,
                titleOpacity: new Animated.Value(0),
              });
            }}
            underlayColor={'#4286f4'}
            style={styles.searchIcon} >
            <Image source={require('../../../../shared/images/search-icon.png')} />
          </TouchableHighlight>
          <Animated.Text style={{
            opacity: this.state.titleOpacity,
            flex: .70,
            height: 60,
            fontSize: 32,
            color: 'white',
            textAlignVertical: 'center',
          }}>{ this.props.title ? this.props.title : 'Enforce' }</Animated.Text>
          <TouchableHighlight
            underlayColor='#4286f4'
            onPress={ () => {
              Keyboard.dismiss();
              this.props.navigation.navigate('DrawerOpen');
            }}
            style={styles.headerNavigation} >
            <Image source={require('../../../../shared/images/menu-icon.jpg')} />
          </TouchableHighlight>
        </View>
      }
      </View>
    );
  }

  componentWillMount() {
    this.props.search && this.setState({ search: true });
  }

  componentDidMount() {
    Animated.timing(
      this.state.titleOpacity,
      { toValue: 1,
        duration: 500, },
    ).start();
    setTimeout(() => this.setState({ titleOpacity: new Animated.Value(1) }), 550);
  }

  closeSearch() {
    this.setState({ search: !this.state.search });
    Animated.timing(
      this.state.titleOpacity,
      { toValue: 1,
        duration: 500, },
    ).start();
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    alignSelf: 'stretch',
    backgroundColor: '#4286f4',
  },
  headerContainer: {
    flexDirection: 'row',
    //backgroundColor: '#4286f4',
  },
  searchIcon: {
    marginTop: 5,
    marginRight: 5,
    flex: .15,
    height: 60,
    width: 60,
  },
  headerNavigation: {
    flex: .15,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
