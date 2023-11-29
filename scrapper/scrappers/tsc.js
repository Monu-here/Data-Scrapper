const cheerio = require("cheerio");
const { default: axios } = require("axios");
const Scrap = require("../basic/scrap");

class TSC extends Scrap {
  name = "tsc_natijaharu";
  URL = "https://tsc.gov.np/natijaharu";

  async fetchInnerPage(url) {
    try {
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);
      const ele = $(".project-dp-one a")[0];
      return ele.attribs.href;
    } catch (error) {
      return null;
    }
  }

  async saveData() {
    try {
      const html = await this.getData();

      let dataNotice = [];
      const $ = cheerio.load(html);
      const elements=$("#tab1 table tbody tr");
      for (let index = 0; index < elements.length; index++) {
        const el = elements[index];
        const ele = $(el).find("a");
        const title = ele.text().trim();
        const url =  ele.attr("href");

        if(!inCache(url)){
            const file = await this.fetchInnerPage(url);
            if(file){
              dataNotice.push({
                title,
                file,
                url:"https://tsc.gov.np",
                image: "",
                category: "tsc",
                topic: "tsc_notice",
              });
            }  
          }
        }

      this.save(dataNotice, "tcs_notice");
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports=TSC;