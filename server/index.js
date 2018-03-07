const request = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');
require('superagent-charset')(request);

const rootSiteUrl = 'http://shenzhen.xuexiaodaquan.com/xiaoxue/';
const maxPageIndex = 17;
const indexTag = 'pn17.html';

let indexJsonData = {
  totalCount: 0,
  files: {}
};

async function loadAllData () {
  for (let i = 0; i < maxPageIndex; i++) {
    try {
      await loadPageData(i);
    } catch (err) {
      console.log(err);
    }
  }

  let _fileName = `school-primary-index.json`;
  saveDataToFile(_fileName, indexJsonData);
}

function loadPageData (index) {
  return new Promise((resolve, reject) => {
    request.get(`${rootSiteUrl}${index && `pn${index + 1}.html` || ''}`)
      .charset('gbk')
      .end((err, res) => {
        // 抛错拦截
        if (err) {
          reject(err);
        }
        let _fileName = `school-primary-${index}.json`;
        let _data = analyzeHtmlData(res);
        indexJsonData.totalCount += _data.length;
        indexJsonData.files[_fileName] = _data.length;
        saveDataToFile(_fileName, _data);
        resolve();
      });
  });
}

/*
* 解析Html数据，组织输出格式数据
*/
function analyzeHtmlData (res) {
  // 解析数据
  let $ = cheerio.load(res.text);
  let data = [];
  $('div.container-content div.list-xx dl > dd').each((index, elem) => {
    let _this = $(elem);
    let _header = _this.find('p > a');
    let _content = _this.find('ul > li');

    data.push({
      name: _header.attr('title'),
      site: _header.attr('href'),
      infors: _content.toArray().map((e, i) => {
        return {
          key: $(e).find('i').text(),
          value: $(e).find('span').text()
        }
      })
    });
  });

  return data;
}

function saveDataToFile (fileName, data) {
  // 写入数据, 文件不存在会自动创建
  fs.writeFile(__dirname + `/data/${fileName}`, JSON.stringify({
    status: 0,
    count: data.length,
    data: data
  }), function (err) {
    if (err) throw err;
    console.log('写入完成');
  });
}

loadAllData();