const request = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

require('superagent-charset')(request);

const Request = {
  httpGet: (url, charset) => {
    return new Promise((resolve, reject) => {
      !url && reject({ statu: -1, text: 'Url is empty' });
      request.get(url)
        .charset(charset || 'utf-8')
        .end((err, res) => {
          // 抛错拦截
          if (err) {
            reject(err);
          }
          resolve(res);
        });
    });
  },

  httpGetCharset: res => {
    let $ = cheerio.load(res.text);
    let reg_meta = /charset="?(.+)"/gi;
    let metas = $('head > meta').html().exec(reg_meta);
    return metas[0] || 'gbk';
  },

  saveJsonToFile: (data, fileName = '', group = '', extendObj) => {
    fileName = fileName || new Date().getTime();
    let filePath = path.resolve(__dirname, '../data');

    !fs.existsSync(filePath) && fs.mkdirSync(filePath);

    if (group) {
      filePath = path.resolve(filePath, group);
    }
    !fs.existsSync(filePath) && fs.mkdirSync(filePath);
    filePath = path.resolve(filePath, fileName);

    // 写入数据, 文件不存在会自动创建
    fs.writeFile(filePath, JSON.stringify({
      status: 0,
      count: data.length,
      ext: extendObj,
      data: data
    }), function (err) {
      if (err) throw err;
      console.log('写入完成');
    });
  }
};

module.exports = Request;