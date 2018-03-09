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
    this.DefaultPrefix = 'ssxx';
  }

  loadIndexPage () {
    return Promise.resolve(Request.httpGet(this.SiteUrl + this.DefaultPrefix, this.CharSet).then(res => {
      let $ = cheerio.load(res.text);
      let Navis = $('#sliderNav > li');
      let Uid = new Date().getTime();
      Navis.each((i, elem) => {
        let _this = $(elem);
        let _ChildNodes = _this.find('> ul >li');
        let _SiteUrl = _this.find('>a').attr('href');
        if (_SiteUrl === './') {
          _SiteUrl = '../ssxx/'
        }

        let _SiteReg = /^javascript:/ig;
        this.ListNavis.push({
          Uid: `${Uid}${i}`,
          Section: _this.find('> a >span:first-child').text(),
          SiteUrl: _SiteReg.test(_SiteUrl) ? '' : _SiteUrl,
          HasChild: _ChildNodes && _ChildNodes.length > 0,
          ChildNodes: _ChildNodes && _ChildNodes.toArray().map((item, index) => {
            let _node = $(item).find('a');
            return {
              Uid: index + 1,
              Group: _node.text(),
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

  loadSchoolInfoFromHtml (res) {
    let $ = cheerio.load(res.text);
    let Uid = new Date().getTime();
    let _content = $('body div.zm_ml_xsdw_right > div.zx_ml_list > div.xq_ml_con > ul > li');
    let _data = _content.toArray().map((elem, i) => {
      let _this = $(elem);

      let _childNodes = _this.find('> div.xx_con > p > a').toArray();
      let _childItems = _childNodes.map((el) => {
        let _self = $(el);
        return { [_self.text()]: _self.attr('href') };
      });

      return {
        Name: _this.find('> span > a').text(),
        Uid: `${Uid}${i}`,
        Infos: _childItems
      };
    });
    return _data;
  }

  async loadAllSchoolsFromHtml () {
    let _Schools = [];
    let _this = this;
    _Schools = await Promise.all(_this.ListNavis.map(async item => {
      if (item.HasChild) {
        let _SchoolInfo = await Promise.all(item.ChildNodes.map(async element => {
          let _info = await this.loadSectionInfoFromHtml(element.SiteUrl);
          return { GId: element.Uid, Info: _info };
        }));
        return { SId: item.Uid, Infos: _SchoolInfo };
      } else {
        let _infos = await this.loadSectionInfoFromHtml(item.SiteUrl);
        return { SId: item.Uid, Infos: _infos };
      }
    }));

    Request.saveJsonToFile(_Schools, 'School-Pri-Infos.json', this.Group);
  }

  loadSectionInfoFromHtml (url) {
    let _this = this;
    return Promise.resolve(Request.httpGet(`${_this.SiteUrl}${url.replace('../', '')}`, _this.CharSet).then(res => { return _this.loadSchoolInfoFromHtml(res); }));
  }

  initFunc () {
    this.loadIndexPage().then(async () => {
      await this.loadAllSchoolsFromHtml();
    }).catch(e => {
      console.log(e);
    });

  }
}

module.exports = new ShenZhenPriSchool();