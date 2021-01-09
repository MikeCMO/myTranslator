from pymongo import MongoClient
import json
from langdetect import detect
with open("..//data.json", 'r') as f:
    distros_dict = json.load(f)


client = MongoClient("localhost", 27017)

database = client[""]
mongoCol = database["originalposts"]
mongoLastDict = {}
# still shows the html tags in rendered and youtube links
for each in distros_dict:
    mongoDict = {}
    # checks what language the article is in
    if detect(each["content"]["rendered"]) == "pt":
        mongoDict["originalLanguage"] = "portuguese"
    elif detect(each["content"]["rendered"]) == "zh-cn":
        mongoDict["originalLanguage"] = "simplified chinese"
    elif detect(each["content"]["rendered"]) == "zh-tw":
        mongoDict["originalLanguage"] = "traditional chinese"
    elif detect(each["content"]["rendered"]) == "en":
        mongoDict["originalLanguage"] = "english"

    mongoDict["originId"] = each["id"]
    mongoDict["title"] = each["title"]["rendered"]
    mongoDict["publishedDate"] = each["date"]
    mongoDict["excerpt"] = each["excerpt"]["rendered"]
    mongoDict["content"] = each["content"]["rendered"]
    # author not shown in the original article
    # tags are numbers? most likely used to link to their database
    # mongoList.append(mongoDict)
    mongoCol.insert_one(mongoDict)


# print(mongoList)
