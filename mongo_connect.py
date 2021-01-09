from flask import request
from bson.json_util import dumps
from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = ""
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
mongo = PyMongo(app)
# curs = mongo.db.ha.find({})


print('ddddddddddddddddddddddddddddddddddddddddd')


@app.route("/")
def home():
    # pog = dumps(mongo.db.ha.find())
    # count =0
    # diction = {'counter':None,'Data':[]}
    # diction['counter'] = mongo.db.ha.count()
    # print(diction)
    # for each in curs:
    #     each['_id'] = '1'
    #     diction['Data'].append(each)
    #     count+=1
    # return diction
    return 'ok'


@app.route("/search", methods=['GET', 'POST'])
# http://127.0.0.1:5000/search?data='pogggywoggy'
# http://127.0.0.1:5000/search?data=Website House ID&info=3328349
def search():
    #scount = 0

    # get the data from the url, match the value of url with database, return it

    #fiction = []
    #poggywoggy = mongo.db.ha.find({})

    uniqueID = request.args.get('_id')
    originID = request.args.get("originID")
    originLanguage = request.args.get('original language')
    title = request.args.get('title')
    publishedDate = request.args.get('published date')
    excerpt = request.args.get('excerpt')
    content = request.args.get("content")

    page = request.args.get('page')

    query = {}
    # http://127.0.0.1:5000/search?houseName=君薈
    # query['title'] = {"$regex": title}
    # query['origin id'] = {"$regex": originID}
    # query['original language'] = {"$regex": originLanguage}

    if originID != None:
        query["origin id"] = {"$regex": originID}

    loggy = mongo.db.originalPost.find(query, {'_id': 0})
    if page != None:
        pagesSkip = (int(page)-1)*20
        loggy = mongo.db.originalPost.find(
            query, {'_id': 0}).skip(pagesSkip).limit(20)

    print(query)
    articles = {'originalPost': []}
    for eeee in loggy:
        articles['originalPost'].append(eeee)

    #poggy = mongo.db.ha.find_one({data : info}, {'_id': 0,'更新日期':1})
    return articles


app.run()
