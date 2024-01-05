const scraper = require("./scraper.js");

scraper
  .getTimes()
  .then((parsedTimes) => {
    if (!!parsedTimes) {
      console.log(parsedTimes);
    } else {
      console.error("WTF? No string");
      process.exit(1);
    }
  })
  .catch((e) => {
    console.error(`WTF??? ${e}`);
    process.exit(1);
  });
