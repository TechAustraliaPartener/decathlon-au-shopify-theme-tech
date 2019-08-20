// @ts-check

/**
 * @typedef Group
 * @property {string} color
 * @property {string[]} images
 */

export class ImageGroups {
  constructor(groupOn, productJSON) {
    this.groupOn_ = groupOn || 'Color';
    this.optionKey_ = null;
    /** @type {Group[]} */
    this.groups_ = [];
    this.currentImage_ = '';
    this.productJSON = productJSON || window.productJSON;
    this.findOptionNumber_();
    this.initGroups_();
    this.buildGroups_();
  }

  findOptionNumber_() {
    for (let i = 0; i < this.productJSON.options.length; i++)
      if (this.productJSON.options[i] === this.groupOn_)
        this.optionKey_ = `option${i + 1}`;
  }

  initGroups_() {
    for (let i = 0; i < this.productJSON.variants.length; i++) {
      const t = this.productJSON.variants[i];
      if (this.currentImage_ !== t.featured_image.src) {
        this.currentImage_ = t.featured_image.src;
        this.groups_.push({
          color: t[this.optionKey_],
          images: [this.currentImage_]
        });
      }
    }
  }

  buildGroups_() {
    let t = 0;
    for (let i = 0; i < this.productJSON.images.length; i++) {
      const n = this.productJSON.images[i];
      for (let j = 0; j < this.groups_.length; j++)
        if (n === this.groups_[j].images[0].replace(/^https:/, '')) t = j;
      if (n !== this.groups_[t].images[0].replace(/^https:/, ''))
        this.groups_[t].images.push(n);
    }
  }

  getGroups() {
    return this.groups_;
  }
}
