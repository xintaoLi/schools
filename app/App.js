/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  constructor () {
    super(...arguments);
    this.renderListItems = this.renderListItems.bind(this);
    this.items = require('./src/data/school-primary-0.json')
  }
  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          深圳小学信息
        </Text>
        <FlatList data={this.items.data.map((d, index) => {
          d.key = index.toString();
          return d;
        })} renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}></FlatList>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }

  renderListItems (item) {

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
