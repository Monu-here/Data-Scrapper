const cheerio = require("cheerio");
const Scrap = require("../../../basic/scrap");
const { inCache } = require("../../../cache");
const axios = require('axios');
class Brt extends Scrap {
  name = "";
  URL = "https://biratnagarmun.gov.np/";


  async loadData() {
    try {
      const html = await this.getData();
      const $ = cheerio.load(html);
      let brt_data = [];

     const elements =  $(".col-md-5 ul .views-row");
     for (let index = 0; index < elements.length; index++) {
       const element = elements[index];
       try {
          const info = $(element).find("a")[0];
          const url = info.attribs.href;

          if (!inCache(url)) {
            const title = $(element).find("a").text();
            const image = $(element).find("img").attr("src");
          
            
             brt_data.push({
               title,
               url: "https://biratnagarmun.gov.np/" + url,
               image,
               file: null,
               topic: "mahanagarpalai",
               category: "mahanagar_palika",
             });
           
          }
        } catch (error) {
          console.log(error);
        }
      }
    
      this.save(brt_data, "Brt");
    } catch (err) {
      console.log(err);
    }
  }
}

const brt = new Brt();
brt.loadData();
module.exports=Brt;