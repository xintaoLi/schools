import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  SectionList
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

class SchoolIndex extends Component {
  constructor () {
    super(...arguments);
    this.DataRoot = '../data/';
    this.RootConf = require('../data/index.json');
    this.City = "ShenZhen";
    this.SectionInfos = {};
    this.SchoolInfos = {};
    this.SectionMap = null;
    this.getSectionInfo();
  }

  getSectionInfo () {
    // let sectionPath = this.this.DataRoot + this.RootConf[this.City] + '/index.json';
    // let schoolPath = this.this.DataRoot + this.RootConf[this.City] + '/School-Pri-Infos.json';
    this.SectionInfos = require('../data/ShenZhen-Gov/index.json');
    this.SchoolInfos = require('../data/ShenZhen-Gov/School-Pri-Infos.json');
    this.SectionMap = new Map(this.SectionInfos.ext);
  }

  getSectionsSchools () {
    return this.SectionInfos.data.map(item => {
      let _data = item.HasChild && item.ChildNodes || this.SchoolInfos.data.filter(el => el.SId === item.Uid).map(e => e.Infos);
      return { title: item.Section, hasChild: item.HasChild, data: _data };
    })
  }

  renderChildNodes (item) {
    if (item.hasChild) {
      return
      return <Text style={styles.item}>{item.Group}</Text>
    } else {
      return <Text style={styles.item}>{item.Name}</Text>
    }
  }

  render () {
    return <View style={styles.container}>
      <View>
        <SectionList
          sections={() => { this.getSectionsSchools() }}
          renderItem={({ item }) => this.renderChildNodes(item)}
          renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
        />
      </View>
    </View>
  }
}

export {SchoolIndex};

