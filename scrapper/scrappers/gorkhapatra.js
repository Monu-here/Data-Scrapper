const cheerio = require("cheerio");
const Scrap = require("../basic/scrap");
const { saveCache, inCache } = require("../cache");

class GorkhaPatra extends Scrap {
    URL = "https://gorkhapatraonline.com/";
    name = "gorkhapatra";
    loadData() {
        this.getData()
            .then((html) => {
                const $ = cheerio.load(html);
                // const scanners = [1, 2, 3, 4, 5].map(d => `.blog-box-layout${d}`).join(', ');

                // console.log(scanners);
                const datas = [];

                $('.blog-box-layout1, .blog-box-layout2, .blog-box-layout3, .blog-box-layout4, .blog-box-layout5').each((index, box) => {

                    try {
                        
                        const info = $(box).find('.item-title a')[0];
                        const url = info.attribs.href;
                        if (!inCache(url)) {
    
                            const image = $(box).find('.item-img img')[0].attribs.src;
                            const title = info.children[0].data;
    
                            datas.push({
                                title,
                                url,
                                image,
                                file:null,
                                topic: "gorkhapatra",
                                category: "news"
                            });
                        }
                    } catch (error) {
                        
                    }

                });

                this.save(datas);
            }).catch((err) => {
                console.log(err);
            });
    }
}
module.exports = GorkhaPatra;