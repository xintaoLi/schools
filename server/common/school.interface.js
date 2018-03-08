class SchoolBase {
  constructor (siteUrl = '', group = '', charset = 'gbk', startFunc) {

    if (!startFunc) {
      throw new Error('startFunc Cannot be null');
    }

    if (typeof (startFunc) !== 'function') {
      throw new Error('startFunc must be function');
    }
    /* 需要怕网地址 */
    this.SiteUrl = siteUrl;

    /* 数据保存时分组
    *  为空时不分组
    */
    this.Group = group;

    /*编码格式*/
    this.CharSet = charset;

    /* Index 数据格式*/
    this.indexJsonData = {
      totalCount: 0,
      files: {}
    };

    /*初始化启动程序*/
    this.StartFunc = startFunc;
  }

  /*开始*/
  start () {
    this.StartFunc && this.StartFunc();
  }
}

module.exports = SchoolBase;