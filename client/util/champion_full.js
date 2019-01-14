"use strict";
var json = require("./championFull.json");
var result = {};
//console.log(json["data"])
for (var championName in json["data"]) {
    var champ = json["data"][championName];
    var skins = {};
    for (var skin in champ["skins"]) {
        skins[champ["skins"][skin]["id"]] = champ["id"] + "_" + champ["skins"][skin]["num"] + ".jpg";
    }
    result[champ["key"]] = skins;
}
console.log(JSON.stringify(result));
