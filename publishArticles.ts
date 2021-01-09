var axios = require("axios");
const { json } = require("express");
const fs = require("fs");
const { argsToArgsConfig } = require("graphql/type/definition");
const { exit } = require("process");
const config = require("config");


// });
var data1 = JSON.stringify({
  username: "",
  password: "password",
});
const token = async () => {
  
  var configUrl = "http://localhost:8000/wp-json/jwt-auth/v1/token";
  var configA = {
    method: "post",
    url: configUrl,
    headers: {
      "Content-Type": "application/json",
    },
    data: data1,
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
  return dat;
};
// async function publishArticles(pubData) {
export default async function publishArticles(d) {
  // var pubData = require the pubData from translatedB
  var pubData = JSON.stringify({
    title: "CCCCCCCCCCCCCC",
    content: "t23123123",
    excerpt: "t31231231233",
  });
  const jwt = await token();
  console.log(jwt);
  var data = d;
  var configUrl = "http://localhost:8000/wp-json/wp/v2/posts";
  var configB = {
    method: "post",
    url: configUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
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
  console.log("the data has been published");
}
// async function main() {
//   await publishArticles(await token());
// }
// main();
