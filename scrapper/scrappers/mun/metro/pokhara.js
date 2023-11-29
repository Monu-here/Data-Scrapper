const cheerio = require("cheerio");
const axios = require("axios");
const Scrap = require("../../../basic/scrap");
const { inCache } = require("../../../cache");

class Pokhara extends Scrap {
  name = "";
  URL = "https://pokharamun.gov.np";

  async fetchInnerPage(url) {
    try {
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);
      const elea = $("div.field-name-field-image a").attr("href");
      return elea;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async loadData() {
    try {
      const html = await this.getData();
      const $ = cheerio.load(html);
      let pokhara_data = [];

      const elements = $(".region-sidebar-third .views-field-title .field-content");
      for (let index = 0; index < elements.length; index++) {
        try {
          const element = elements[index];
          const info = $(element).find("a")[0];
          const url =this.URL+ info.attribs.href;
          // console.log(url);

          if (!inCache(url)) {
            const title = $(element).find("a").text();
            const image = await this.fetchInnerPage(url);
            if (image) {
              pokhara_data.push({
                title,
                url,
                image,
                file: null,
                topic: "pokhara_not",
                category: "notice",
              });
            }
          }
        } catch (error) {
          console.log(error);
          return null;
        }
      }
      this.save(pokhara_data, "pokhara");
    } catch (err) {
      console.log(err);
    }
  }
}

const pokhara = new Pokhara();
pokhara.loadData();


module.exports=Pokhara;