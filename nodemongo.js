const config = require("config");
var goog = config.get("googleAPI.googleLink");
process.env.GOOGLE_APPLICATION_CREDENTIALS = goog;

var express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const translate = require("/node-google-translate-free");
var cors = require("cors");
var axios = require("axios");
const { json } = require("express");
const fs = require("fs");
const { argsToArgsConfig } = require("graphql/type/definition");
const { exit } = require("process");

const typeDefs = gql`
  type Query {
    getArticles(
      originId: String
      since: [String]
      status: [String]
      langFilter: String
      accessToken: String
    ): [Translate]
    # getArticles(query: ArticleQueryInput, since: [String]): [Translate]
  }
  type Mutation {
    editTranslation(
      editExcerpt: String
      editTitle: String
      editContent: String
      originId: String
      status: String
      editLanguage: String
      deployId: String
    ): [Editing]
  }
  # input ArticleQueryInput {
  #   originId: String
  #   since: [String]
  # }
  type Editing {
    editExcerpt: String
    editContent: String
    editTitle: String
    editorId: String
    status: String
    originId: String
    editLanguage: String
    editorName: String
    deployId: String
  }
  type Translate {
    id: ID!
    originId: String
    originalLanguage: String
    title(to: String): String
    publishedDate: String
    excerpt(to: String): String
    content(to: String): String
    status: [String]
    editings: [Editing]
  }
`;

async function googleT(text, from, id, editWhat, to) {
  if (to) {
    // console.log(editingData);
    if (await Editing.exists({ originId: id, editLanguage: to })) {
      const editingData = await Editing.find({
        originId: id,
        editLanguage: to,
      });
      // if (to == editingData[0]["editLanguage"]) {
      // console.log(editingData[0][editWhat]);
      console.log(
        editingData[0]["editLanguage"],
        "already edited submit/saved the article"
      );
      return editingData[0][editWhat];
      // }
    } else {
      console.log("at translationnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
      const projectId = config.get("googleAPI.projectName"); // Your GCP Project Id

      // Imports the Google Cloud client library
      const { Translate } = require("@google-cloud/translate").v2;

      // Instantiates a client
      const translate = new Translate({ projectId });

      const [translation] = await translate.translate(text, to);
      // console.log(`Text: ${text}`);
      // console.log(`Translation: ${translation}`);

      return translation;
    }
  } else {
    return text;
  }
}

const resolvers = {
  Query: {
    getArticles: async (
      d,
      { originId, since, status, langFilter, accessToken, editings }
    ) => {
      var filters = {};
      if (originId) {
        filters.originId = originId;
      }
      if (since) {
        filters.publishedDate = { $gte: since[0], $lte: since[1] };
      }
      if (langFilter) {
        filters.originalLanguage = langFilter;
      }

      // console.log(filters, "filters");
      const data = await Translate.find(filters);

      // console.log(data);
      console.log("cool data here");
      return data;

      //   translate({
      //     text: text,
      //     source: 'es',
      //     target: 'en'
      // }).then(function(translation) {
      //     console.log(translation);
      // });
    },
    // getArticles: () => console.log("hu"),
  },
  Mutation: {
    editTranslation: async (
      d,
      {
        editExcerpt,
        editContent,
        editTitle,
        originId,
        status,
        editLanguage,
        editorId,
      },
      { session }
    ) => {
      // console.log(
      //   editContent,
      //   editExcerpt,
      //   editTitle,

      
      // );
      // data.xxx = xxxx;
      // await data.save();
      // return data;

      // console.log("originId", originId);
      console.log("got the data from editing submit");
      // console.log(session);

      let editedArticle;

      if (
        await Editing.exists({ originId: originId, editLanguage: editLanguage })
      ) {
        console.log("it exists");
        editedArticle = await Editing.findOne({ originId, editLanguage });
        // if (data[0]["editLanguage"] == editLanguage) {
        // console.log(data, 'data from mongo')

        editedArticle.originId = originId;
        editedArticle.editTitle = editTitle;
        editedArticle.editExcerpt = editExcerpt;
        editedArticle.editContent = editContent;
        editedArticle.status = status;
        editedArticle.editLanguage = editLanguage;

        await editedArticle.save();
        // }
      } else {
        console.log("making new edited article");
        editedArticle = new Editing();

        editedArticle.originId = originId;
        editedArticle.editTitle = editTitle;
        editedArticle.editExcerpt = editExcerpt;
        editedArticle.editContent = editContent;
        editedArticle.status = status;
        editedArticle.editLanguage = editLanguage;
        editedArticle.editorId = session.userId;

        await editedArticle.save();
      }
      if (
        await Editing.exists({
          originId: originId,
          editLanguage: editLanguage,
          status: "published",
        })
      ) {
        
        var axios = require("axios");
        var data1 = JSON.stringify({
          username: "deploy",
          password: "",
        
        });
        const token = async () => {
          console.log("mmmmmmmmmmmmmmmmmmmmmmmmm", editLanguage);
          
          var configUrl = config.get(`.${editLanguage}.token`);

         
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
        async function publishArticles(d) {
          // var pubData = require the pubData from translatedB
          console.log(d, "oii");
          // var pubData = JSON.stringify({
          //   title: "CCCCCCCCCCCCCC",
          //   content: "t23123123",
          //   excerpt: "t31231231233",
          // });
          const jwt = await token();

          //DETERMINE SITE LANGUAGE HERE
          var configurl;
          configUrl = config.get(`.${editLanguage}.post`);
          // if (editLanguage == "zh-TW") {

       
          var data = d;
          
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

          const deployData = await Editing.find({
            originId: originId,
            editLanguage: editLanguage,
            status: "published",
          });
          console.log(jData.id);
          console.log(deployData);
          editedArticle.deployId = jData.id;
          await editedArticle.save();
        }
        var category = config.get(`${editLanguage}.category`)
        var pubData = {
          title: editTitle,
          content: editContent,
          excerpt: editExcerpt,
          categories: category,
        };
        publishArticles(pubData);
      }
      return data;
      // if (!data) {
      // }
      // console.log(originId, data);
      // return data;

      // const data = await Editing.find({});

      // return data;
    },
  },
  Editing: {
    editExcerpt: async (d) => {
      //console.log(d, "this is the d");
      return await d.editExcerpt;
    },
    editContent: async (d) => {
      return await d.editContent;
    },
    editTitle: async (d) => {
      return await d.Title;
    },
    editorName: async (d, args, { session }) => {
      if (!d.editorId) {
        return;
      }
      // const editId = await Editing.find({
      //   originId: d.editings.originId,
      //   editLangauge: d.editings.editLanguage,
      // });
      const editId = d.editorId;
      var pdata = {
        query: `
          query user($editId: [String]) {
            user(query: { id: $editId }) {
              data {
                username
              }
            }
          }
        `,
        variables: { editId: editId },
      };
      var conUrl = config.get("server.eAdminGraphQL");
      var configA = {
        method: "post",
        url: conUrl,
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          access_token: session.accessToken,
        },
        data: pdata,
      };
      console.log("d");
      var editorData = await axios(configA);

      console.log(editorData.data.data.user.data[0].username);

      return editorData.data.data.user.data[0].username;
    },
  },
  Translate: {
    //still dont have translation for tags
    title: async (d, { to }) => {
      return await googleT(
        d.title,
        d.originalLanguage,
        d.originId,
        "editTitle",
        to
      );
    },
    excerpt: async (d, { to }) => {
      return await googleT(
        d.excerpt,
        d.originalLanguage,
        d.originId,
        "editExcerpt",
        to
      );
    },
    content: async (d, { to }) => {
      return await googleT(
        d.content,
        d.originalLanguage,
        d.originId,
        "editContent",
        to
      );
    },
    editings: async (d, { to }) => {
      const statusS = await Editing.find({
        originId: d.originId,
      });
      // console.log(statusS, "what the happening");
      return statusS;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (ctx) => ({ session: ctx.req.session }),
});
var Restrict = require("/restrict");
var app = express();
var conRes = config.get("server.eAdminRestrict");
var restrict = Restrict({ baseUrl: conRes });
app.get("/", (req, res) => res.end());
app.use(cors());
app.use(restrict());
server.applyMiddleware({ app });
var conApollo = config.get("server.apolloServer");
var conport = config.get("server.port");
app.listen({ port: conport }, () =>
  console.log(`🚀 Server ready at ${conApollo}`)
);

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var conMon = config.get("server.mongo");
mongoose.connect(conMon, {
  useNewUrlParser: true,
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
  // might add more later for additional data
  editorId: String,
  editorName: String,
  translate: String,
  status: String,
});

const editSchema = new mongoose.Schema({
  editExcerpt: String,
  editContent: String,
  editTitle: String,
  editorId: String,
  status: String,
  originId: String,
  editLanguage: String,
  editorName: String,
  deployId: String,
});
const Editing = mongoose.model("editingposts", editSchema);
const Translate = mongoose.model("originalposts1", translateSchema);
