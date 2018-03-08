const cheerio = require('cheerio');
const Request = require('../common/school.request');
const SchoolContent = require('../common/school.content');

class SchoolShenZhen {
  constructor () {
    this.rootSiteUrl = '';
    this.maxPageIndex = 17;
    this.group = 'ShenZhen';
    this.indexJsonData = {
      totalCount: 0,
      files: {}
    };
  }

  loadHtml (index) {
    return new Promise((resolve, reject) => {
      Request.httpGet(`${this.rootSiteUrl}${index && `pn${index + 1}.html` || ''}`, 'gbk').then(res => {
        let _fileName = `p-${index}.json`;
        let _data = this.analyzeHtmlData(res);
        this.indexJsonData.totalCount += _data.length;
        this.indexJsonData.files[_fileName] = _data.length;

        Request.saveJsonToFile(_data, _fileName, this.group);
        resolve();
      }).catch(err => reject(err));
    });
  }

  async loadAllData () {
    for (let i = 0; i < this.maxPageIndex; i++) {
      try {
        await this.loadHtml(i);
      } catch (err) {
        console.log(err);
      }
    }

    let _fileName = `index.json`;
    Request.saveJsonToFile(this.indexJsonData, _fileName, this.group);
  }

  analyzeHtmlData (res) {
    // 解析数据
    let $ = cheerio.load(res.text);
    let data = [];
    $('div.container-content div.list-xx dl > dd').each((index, elem) => {
      let _this = $(elem);
      let _header = _this.find('p > a');
      let _content = _this.find('ul > li');
      let _infos = _content.toArray().map((e, i) => {
        return [$(e).find('i').text(), $(e).find('span').text()];
      });
      console.log(_infos);
      data.push(new SchoolContent(_header.attr('title'), '', _header.attr('href'), '',
        new Map(_infos)));
    });
    return data;
  }

  start () {
    this.loadAllData();
  }
}

module.exports = new SchoolShenZhen();

