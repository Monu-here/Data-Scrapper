const cheerio = require("cheerio");
const axios = require("axios");
const Scrap = require("../../../basic/scrap");
const { inCache } = require("../../../cache");

class Birgunj extends Scrap {
  name = "";
  URL = "https://birgunjmun.gov.np";
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
      const $ = cheerio.load(html);
      let birgunj_data = [];

      const elements = $(".region-sidebar-third .views-field-title .field-content");
      for (let index = 0; index < elements.length; index++) {
        try {
          const element = elements[index];
          const info = $(element).find("a")[0];
          const url =this.URL+ info.attribs.href;
    
          if (!inCache(url)) {
            const title = $(element).text().trim();
            const image = await this.fetchInnerPage(url);
            if (image) {
              birgunj_data.push({
                title,
                url,
                image,
                file: null,
                topic: "birgunj_not",
                catogery: "notice",
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
      this.save(birgunj_data, "birgunj");
    } catch (err) {
      console.log(err);
    }
  }
}
const birgunj = new Birgunj();
birgunj.loadData();
module.exports=Birgunj;