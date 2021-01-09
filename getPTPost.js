var axios = require("axios");
const { json } = require("express");
const fs = require("fs");
const { argsToArgsConfig } = require("graphql/type/definition");
const { exit } = require("process");
const config = require("config");
var striptags = require("striptags");

var data = JSON.stringify({
  username: "deploy",
  password: "",
});
const token = async (editLanguage) => {
  
  var configUrl = config.get(`.${editLanguage}.token`);

  var configA = {
    method: "post",
    url: configUrl,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  var dat;
  await axios(configA)
    .then(function (response) {
      //   console.log(JSON.stringify(response.data.token));
      dat = response.data.token;
    })
    .catch(function (error) {
      console.log(error);
    });
  //   console.log(dat);
  console.log(dat, "hehexdddddddddddddddddddddddddddddddddddddddddddddddddd");
  return (dat);
};
const getArticles = async (token,editLanguage) => {
  var axios = require("axios");
  var data = "";
  
  var configUrl = config.get(`.${editLanguage}.post`);
  var configB = {
    method: "get",
    url: configUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  };
  var jData;
  await axios(configB)
    .then(function (response) {
      jData = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  return jData;
};

const toMongo = async (pData,editLanguage) => {
  const mongoose = require("mongoose");
  mongoose.Promise = global.Promise;
  const mongoConfig = config.get("server.mongo");
  mongoose.connect(mongoConfig, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    // we're connected!
  });
  const translateSchema = new mongoose.Schema({
    //   _id: translateSchema.Types.ObjectId,
    originId: String,
    originalLanguage: String,
    title: String,
    publishedDate: String,
    excerpt: String,
    content: String,
    status: String,
    // might add more later for additional data
  });
  // const LanguageDetect = require("languagedetect");
  // const lngDetector = new LanguageDetect();
  // console.log(lngDetector.detect(pData[0].content.rendered, 1)[0][0]);

  // var TradOrSimp = require("traditional-or-simplified");
  // var franc = require("franc");
  const Translate = mongoose.model("originalposts1", translateSchema);

  for (i = 0; i < pData.length; i++) {
    if (await Translate.exists({ originId: pData[i].id }) ) {
      continue;
    }
    var category = config.get(`${editLanguage}.category`)
    var catTest = false;
    for(x = 0;x<pData[i].categories;x++){
      if(x==category){
        catTest = true
      }
    }
    if (await Translate.exists({ originId: pData[i].id })||catTest==true ) {
      continue;
    }
    //Strip Tags
    var hexcerpt = striptags(pData[i].excerpt.rendered);
    //make a new model

    article = new Translate();

    article.originId = pData[i].id;
    article.title = pData[i].title.rendered;
    article.publishedDate = pData[i].date;
    article.excerpt = hexcerpt;
    article.content = pData[i].content.rendered;
    article.originalLanguage = editLanguage
    // article.status = "unedited";

    //detect language
    // article.originalLanguage = lngDetector.detect(
    //   pData[0].content.rendered,
    //   1
    // )[0][0];
    //console.log(franc("無需帳戶或註冊"));

    // if (franc(pData[i].title.rendered) == "por") {
    //   article.originalLanguage = "pt";
    // } else if (franc(pData[i].title.rendered) == "eng") {
    //   article.originalLanguage = "en";
    // } else if (franc(pData[i].title.rendered) == "cmn") {
    //   if (TradOrSimp.isSimplified(pData[i].title.rendered) == true) {
    //     article.originalLanguage = "zh-CN";
    //   } else {
    //     article.originalLanguage = "zh-TW";
    //   }
    // } else {
    //   article.originalLanguage = "NA";
    // }
    article.save();
  }

  // await Translate.create({ name: xxx });
};
// const publishArticles = async (token) => {
//   // var pubData = require the pubData from translatedB
//   var pubData = require("../translator/src/pages/translatedA/translatedB/onPublish");
//   if (pubData) {
//     var data = pubData;
//     var configUrl = ""
//     var configB = {
//       method: "post",
//       url: configUrl,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + token,
//       },
//       data: data,
//     };
//     var jData;
//     await axios(configB)
//       .then(function (response) {
//         jData = response.data;
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//     console.log("the data has been published");
//     return jData;
//   }
// };
async function main() {
  //   console.log(token(), "bbbbbbbbbbbbb");
  await toMongo(await getArticles(await token("pt"),"pt"),"pt");
  // await toMongo(await getArticles(await token("pt"),"pt"),"pt");
  // await toMongo(await getArticles(await token()));
  console.log("done getting articles");

  // fs.writeFileSync(__dirname + "/data.json");
}

main();
