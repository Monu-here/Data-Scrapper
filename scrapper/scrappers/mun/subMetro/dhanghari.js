const cheerio = require("cheerio");
const axios = require("axios");
const Scrap = require('../../../basic/scrap');
const { inCache } = require("../../../cache");
class Dhangari extends Scrap {
    name = "";
    URL = "https://dhangadhimun.gov.np";
  async fetchInnerPage(url) {
    try {
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);
      const ele = $("div.field-items a").attr("href");
      return ele;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async loadData() {
    try {
      const html = await this.getData(); 
      let dhangari_data = [];
      const $ = cheerio.load(html);
      const elements = $(".region-sidebar-third .views-field-title .field-content a");
      for (let index = 0; index < elements.length; index++) {
        try {
          const element = elements[index];
          const url = this.URL+element.attribs.href;
          // console.log(url);
          if (!inCache(url)) {
            const title = $(element).text().trim();
            const image = await this.fetchInnerPage(url);
            if (image) {
              dhangari_data.push({
                title,
                url,
                image,
                file: null,
                topic: "dhanghari_not",
                category: "notice",
              });
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
      this.save(dhangari_data, "dhanghari");
    } catch (err) {
      console.error(err);
    }
  }
}

const dhangari = new Dhangari();
dhangari.loadData();

module.exports=Dhangari;