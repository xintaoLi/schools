class SchoolContent {
  constructor (name = '', section = '', site = '', address = '', infos = new Map()) {
    this.SchoolName = name;
    this.Section = section;
    this.Address = address;
    this._infos = infos;
    this.Infos = this._infos.entries();
  }
}

module.exports = SchoolContent;