// src/scraper.js
const cheerio = require("cheerio");
const axios = require("axios");

const url =
  "https://www.yeshiva.org.il/tags/%D7%A4%D7%A8%D7%A9%D7%AA-%D7%94%D7%A9%D7%91%D7%95%D7%A2";

const CITIES = {
  Jerusalem: "156",
  TelAviv: "204",
  Haifa: "151",
  BeerSheba: "136",
};

const getTimes = async () => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const script = $(
      'script[type="text/javascript"]:contains("TagTimesObject")',
    ).html();

    const parasha = $('div.yeshiva-banner img[itemprop="image"]').attr('alt') ?? "Parasha not found";

    const regex = /var\s+TagTimesObject\s+=\s+{([\s\S]*?)\s+};/;

    const match = script.match(regex);

    if (match) {
      const tagTimesObjectScript = `${match[0]}\n\rmodule.export = { TagTimesObject };`;

      //eval IS UNSAFE!!! NEVER USE IT IN REAL JS PROJECTS!
      const tagTimes = eval(tagTimesObjectScript).TagTimesObject.TagsTimes;

      return `${tagTimes[CITIES.Jerusalem][0]}\n\r${
        tagTimes[CITIES.TelAviv][0]
      }\n\r${tagTimes[CITIES.Haifa][0]}\n\r${
        tagTimes[CITIES.BeerSheba][0]
      }\n\r\n\r${tagTimes[CITIES.Jerusalem][1]}\n\r${
        tagTimes[CITIES.TelAviv][1]
      }\n\r${tagTimes[CITIES.Haifa][1]}\n\r${tagTimes[CITIES.BeerSheba][1]}\n\r${parasha}`;
    } else {
      console.error("TagTimesObject not found in the script.");
      return "";
    }
  } catch (e) {
    console.error(e);
    return "";
  }
};

module.exports = { getTimes };
