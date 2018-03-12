import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
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
    this.state = { SectionShools: [] };
    this.DataRoot = '../data/';
    this.RootConf = require('../data/index.json');
    this.City = "ShenZhen";
    this.SectionInfos = {};
    this.SchoolInfos = {};
    this.SectionMap = null;
    this.getSectionInfo();
  }

  getSectionInfo () {
    this.SectionInfos = require('../data/ShenZhen-Gov/index.json');
    this.SchoolInfos = require('../data/ShenZhen-Gov/School-Pri-Infos.json');
    this.SectionMap = new Map(this.SectionInfos.ext);
  }

  getSectionsSchools () {
    let data = this.SectionInfos.data.map((item, index) => {
      let _data = [];
      if (item.HasChild) {
        let _SectionSchools = this.SchoolInfos.data.filter(el => el.SId === item.Uid)[0];
        _data = item.ChildNodes.map(_item => {
          return {
            title: _item.Group,
            sType: 'G',
            data: _SectionSchools.Infos.filter(__item => __item.GId === _item.Uid)[0].Info
          }
        });
      }
      else {
        _data = [{
          title: item.Section,
          sType: 'S',
          data: this.SchoolInfos.data.filter(el => el.SId === item.Uid)[0].Infos
        }]
      }
      return { title: item.Section, hasChild: item.HasChild, data: _data };
    });
    return data;
  }

  renderSubNodes (node) {
    return (
      // <Text style={styles.sectionHeader}>{typeof(node)}</Text>
      <SectionList
        sections={[node]}
        renderItem={({ item }) => <Text style={styles.item}>{item.Name}</Text>}
        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  renderSections () {
    return (<SectionList
      sections={this.getSectionsSchools()}
      renderItem={({ item }) => this.renderSubNodes(item)}
      renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
      keyExtractor={(item, index) => index.toString()}
    />);
  }

  render () {
    return <View style={styles.container}>
      {this.renderSections()}
    </View>
  }
}

export { SchoolIndex };



