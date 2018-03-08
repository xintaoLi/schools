const SchoolBase = require('../common/school.interface');
const SchoolList = require('../common/school.gov');
const Request = require('../common/school.request');
const cheerio = require('cheerio');
const url = require('url');

class ShenZhenPriSchool extends SchoolBase {
  constructor () {
    super(SchoolList.ShenZhen, 'ShenZhen-Gov', 'gb2312', () => {
      this.initFunc();
    });
    this.ListNavis = [];
  }

  loadIndexPage () {
    return Promise.resolve(Request.httpGet(this.SiteUrl, this.CharSet).then(res => {
      let $ = cheerio.load(res.text);
      let Navis = $('#sliderNav > li');
      Navis.each((i, elem) => {
        let _this = $(elem);
        let _ChildNodes = _this.find('> ul >li');
        this.ListNavis.push({
          Section: _this.find('> a >span:first-child').text(),
          SiteUrl: _ChildNodes && _ChildNodes.length && _this.find('>a').attr('href') || '',
          ChildNodes: _ChildNodes && _ChildNodes.toArray().map((item) => {
            let _node = $(item).find('a');
            return {
              Section: _node.text(),
              SiteUrl: _node.attr('href')
            };
          })
        });
      });

      /*保存首页数据*/
      Request.saveJsonToFile(this.ListNavis, 'index.json', this.Group);
    }).catch(err => {
      console.error(err);
    }));
  }

  initFunc () {
    this.loadIndexPage();
  }
}

module.exports = new ShenZhenPriSchool();