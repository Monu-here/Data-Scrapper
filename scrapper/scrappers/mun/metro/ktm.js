const cheerio = require("cheerio");
const axios = require("axios");
const Scrap = require("../../../basic/scrap");
const { inCache } = require("../../../cache");

class Ktm extends Scrap {
  name = "";
  URL = "https://kathmandu.gov.np";

  async fetchInnerPage(url) {
    try {
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);
      const innerPageLink = $("div.elementor-widget-container  a").attr('href');
      return innerPageLink;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async loadData() {
    try {
      const html = await this.getData();
      const $ = cheerio.load(html);
      const datas = [];

      const elements = $(".tab-content.current ul li");
      for (let i = 0; i < elements.length; i++) {
        try {
          const element = elements[i];
          const info = $(element).find('a')[0];
          const url =info.attribs.href;
          // console.log(url);
          if (!inCache(url)) {
            const title = $(element).find('a').text();
            const image = await this.fetchInnerPage(url);

            if (image) {
              datas.push({
                title,
                url,
                image,
                file: null,
                topic: 'ktm_not',
                category: 'notice'
              });
            }
          }
        } catch (error) {
          console.log(error);
          return null;
        }
      }

      this.save(datas, 'ktm');
    } catch (err) {
      console.log(err);
    }
  }
}

const ktm = new Ktm();
ktm.loadData();

module.exports=Ktm;