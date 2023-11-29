const cheerio = require("cheerio");
const axios = require("axios");
const Scrap = require("../../../basic/scrap");
const { inCache } = require("../../../cache");
class Tulsipur extends Scrap {
  name = "";
  URL = "https://tulsipurmun.gov.np";
  async fetchInnerPage(url) {
    try {
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);
      const ele = $("div.field-items a").attr('href');
      return ele;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async loadData() {
    try {
      const html = await this.getData();
      const tulsipur_data = [];
      const $ = cheerio.load(html);
      const elements = $(".region-sidebar-third .views-field-title .field-content ");
      for (let index = 0; index < elements.length; index++) {
        try {
          const element = elements[index];
          const info = $(element).find("a")[0];
          const url = this.URL + info.attribs.href;
          if (!inCache(url)) {
            const title = $(element).text().trim();
            const image = await this.fetchInnerPage(url);
            if (image) {
                tulsipur_data.push({
                title,
                url,
                image,
                file: null,
                topic: "tulsipur_not",
                category: "notice",
              });
            }
          }
        } catch (error) {
          console.log(error);
       
        }
      }
      this.save(tulsipur_data, "tulsipur");
    } catch (err) {
      console.log(err);
    }
  }
}
const tulsipur = new Tulsipur();
tulsipur.loadData();
module.exports = Tulsipur;
