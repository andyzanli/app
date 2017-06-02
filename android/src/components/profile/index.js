import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  AsyncStorage,
} from 'react-native';
import Firebase from '../../../../includes/firebase/firebase';
import Database from '../../../../includes/firebase/database';

import Header from '../home/Header';
import Warning from './Warning';
import Wait from './Wait';

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      county: '',
      emailColor: 'black',
      passwordColor: 'black',
      countyColor: 'black',
      emailWarning: false,
      passwordWarning: false,
      wait: false,
    };
    this.profile = {};
    this.profileId = '';
    this.createdNewUser = false;
    this.replacedOldUser = false;
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        <Text style={styles.title}>Profile Settings</Text>
        <View style={styles.row} >
          <Text style={styles.designator}>Email</Text>
          <TextInput
            style={{ borderColor: this.state.emailColor, borderWidth: 1, width: 220, paddingLeft: 15, position: 'absolute', right: 0 }}
            autoCorrect={false}
            autoCapitalize={'words'}
            fontSize={18}
            underlineColorAndroid={'transparent'}
            onFocus={() => this._onEmailFocus()}
            onBlur={() => this._onEmailBlur()}
            onChangeText={(text) => { this.setState({ email: text })}}
            value={this.state.email} />
        </View>

        { this.state.emailWarning ? <Warning warning={'Enter valid email address'} /> : null }

        <View style={styles.row} >
          <Text style={styles.designator}>Password</Text>
          <TextInput
            style={{ borderColor: this.state.passwordColor, borderWidth: 1, width: 220, paddingLeft: 15, position: 'absolute', right: 0 }}
            autoCorrect={false}
            secureTextEntry={true}
            fontSize={18}
            underlineColorAndroid={'transparent'}
            onFocus={() => this._onPasswordFocus()}
            onBlur={() => this._onPasswordBlur()}
            onChangeText={(text) => { this.setState({ password: text })}}
            value={this.state.password} />
        </View>

        { this.state.passwordWarning ? <Warning warning={'Must be at least 6 characters'} /> : null }

        <View style={styles.row} >
          <Text style={styles.designator}>County</Text>
          <TextInput
            style={{ borderColor: this.state.countyColor, borderWidth: 1, width: 220, paddingLeft: 15, position: 'absolute', right: 0 }}
            autoCorrect={false}
            autoCapitalize={'words'}
            fontSize={18}
            underlineColorAndroid={'transparent'}
            onFocus={() => this._onCountyFocus()}
            onBlur={() => this._onCountyBlur()}
            onChangeText={(text) => { this.setState({ county: text })}}
            value={this.state.county} />
        </View>
        <TouchableHighlight
          style={styles.button}
          underlayColor='green'
          onPress={() => this._setNewProfile() }>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableHighlight>
        { this.state.wait ? <Wait /> : null }
      </View>
    );
  }

  componentWillMount() {
    this._getProfileFromAsyncStorage();
  }

  componentWillUnmount() {
    if (this.createdNewUser) {
      Firebase.signInUser(this.state.email, this.state.password);
      setTimeout(() => {
        let id = Firebase.getCurrentUser();
        AsyncStorage.setItem('@Enforce:profileId', id);
      }, 1500);
      return;
    }
    if (this.replacedOldUser) {
      console.log('unmount data state', this.data);
      Firebase.signInUser(this.state.email, this.state.password);
      setTimeout(() => {
        let newId = Firebase.getCurrentUser();
        AsyncStorage.setItem('@Enforce:profileId', newId);
        Database.transferUserData(this.state.county, newId, this.data);
      }, 1500);
    }
  }

  async _getProfileFromAsyncStorage() {
    try {
      this.profile = await AsyncStorage.getItem('@Enforce:profileSettings');
      console.log('parse', JSON.parse(this.profile))
      this.profile = JSON.parse(this.profile);
      this.setState({
        email: this.profile.email ? this.profile.email : '',
        password: this.profile.password ? this.profile.password : '',
        county: this.profile.county ? this.profile.county : '',
      });
      this.profileId = await AsyncStorage.getItem('@Enforce:profileId');
      Firebase.signInUser(this.profile.email, this.profile.password);
      console.log('get profile id', this.profileId)
      // Potentially sign in after component mounts for change updates to password
      //
      // TODO Delete old database -- not account, but the db
      // this.profileId = '';
    } catch (err) {
      console.warn('Error fetching Profile Settings from AsyncStorage', err);
    }
  }

  async _setNewProfile() {
    if (this.state.emailWarning || this.state.passwordWarning) return;
    let settings = {
      email: this.state.email,
      password: this.state.password,
      county: this.state.county,
    };
    settings = JSON.stringify(settings);
    if (!this.profileId) { console.log('no profile id')
      AsyncStorage.setItem('@Enforce:profileSettings', settings);
      Firebase.createNewUser(this.state.email, this.state.password);
      this.createdNewUser = true;
      return;
    }
    try {
      console.log('try setting new user')
      if (this.profile.email !== this.state.email || this.profile.password !== this.state.password || this.profile.state !== this.state.state) {

        Database.getUserTickets(this.profile.county, this.profileId, (data) => this.data = data);
        console.log('get data from db', this.data)

        Firebase.deleteUser();

        AsyncStorage.setItem('@Enforce:profileSettings', settings);
        console.log('try set item to asyncStore')
        // create new user, port old data, and delete old db user
        Firebase.createNewUser(this.state.email, this.state.password);
        console.log('try created new user')
        this.replacedOldUser = true;
      }
    } catch (err) {
      console.warn('Error updating profile setting', err);
    }
  }

  _onEmailFocus() {
    this.setState({nameColor: '#4286f4'});
  }

  _onEmailBlur() {
    let email = this.state.email;
    let regexForCom = /.(?=com$)/g;
    let regexForAt = /@{1}/g;
    let com = regexForCom.test(email);
    let at = regexForAt.test(email);
    if (!com || !at) {
      this.setState({emailColor: 'red', emailWarning: true});
      return;
    }
    this.setState({emailColor: 'black', emailWarning: false});
  }

  _onPasswordFocus() {
    this.setState({passwordColor: '#4286f4'});
  }

  _onPasswordBlur() {
    if (this.state.password.length < 6) {
      this.setState({passwordColor: 'red', passwordWarning: true});
      return;
    }
    this.setState({passwordColor: 'black', passwordWarning: false});
  }

  _onCountyFocus() {
    this.setState({countyColor: '#4286f4'});
  }

  _onCountyBlur() {
    this.setState({countyColor: 'black'});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    color: '#4286f4',
    marginTop: 30,
    marginBottom: 30,
    fontSize: 34,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    margin: 25,

  },
  designator: {
    fontSize: 20,
    marginLeft: 25,
    marginTop: 15,
    fontWeight: 'bold',
  },
  button: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 60,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#4286f4',
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
  },
});