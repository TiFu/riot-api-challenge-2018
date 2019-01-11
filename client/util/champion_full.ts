const json = require("./championFull.json");

const result: any = {}
//console.log(json["data"])
for (const championName in json["data"]) {
    const champ = json["data"][championName]
    const skins: any = {}
    for (const skin in champ["skins"]) {
        skins[champ["skins"][skin]["id"]] = champ["id"] + "_" + champ["skins"][skin]["num"] + ".jpg"
    }
    result[champ["key"]] = skins
}
console.log(JSON.stringify(result))