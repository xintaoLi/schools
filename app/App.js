import React, { Component } from 'react';
import { View } from 'react-native';
import { SchoolIndex } from './src/scripts/index.rn';

export default class App extends Component {
  constructor () {
    super(...arguments);
  }
  render () {
    return (
      <View>
        <SchoolIndex />
      </View>
    );
  }
}
