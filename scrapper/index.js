const files = [
//   "gorkhapatra",
//   "/mun/metro/birgunj.js",
//   "/mun/metro/brt.js",
//   "/mun/metro/ktm.js",
//   "/mun/metro/lalitpur.js",
//   "/mun/metro/pokhara.js.",

//   "/mun/subMetro/dhangadhimun.js",
//   "/mun/subMetro/hetaudamun.js",
//   "/mun/subMetro/ithari.js",
//   "/mun/subMetro/nepalgunj.js",
//   "/mun/subMetro/tulsipur.js",
];

let iterations = 0;
let index = 0;
const max = files.length;

function doFetch() {
  console.log(`iterations ${iterations++}`);
  file = files[index];
  try {
    const data = require("./scrappers/" + file);
    const inst = new data();
    inst.loadData();
  } catch (error) {
    console.log(error);
  }
  index += 1;

  if (index >= max) {
    index = 0;
  }

  setTimeout(() => {
    doFetch();
  }, 10000);
}

doFetch();
