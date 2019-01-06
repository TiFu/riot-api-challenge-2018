import { loadConfigFromEnvironment } from '../achievement-config/index';
import { AchievementDatabase, Player } from 'achievement-db';

const config = loadConfigFromEnvironment();
const db = new AchievementDatabase(config.db);

const promises = [
    db.PlayerDB.createPlayer(36904072, "euw1", "TiFu", "lVSMwnL45YvVvPO9ejH95PsKNhfhG9vw_whFXSYzPQ6znQ"),
    db.PlayerDB.createPlayer(1212122, "euw1", "d0t3r", "2tsJFPYwRiKaWV5Qotl5V4g2V4CSjvAxz7uss9waj2atRgM"),
    db.PlayerDB.createPlayer(1212123, "euw1", "HighNoonSona", "b69R7IETvfc3mWt05Tr71_l3Xj_sgHicwh3-3pTOWkfUioc"),
    db.PlayerDB.createPlayer(1212124, "euw1", "Icetsteak", "QuWzknGE2Bzj2N9SqEfHqsP6wFoh5K2YJiZbpOGr03IsOQI"),
    db.PlayerDB.createPlayer(1212125, "euw1", "L V", "6oUeh867Ts29z1B3A-uWxMtLtUUzFRr2P7Ia6J5PV1zSiQ")
]

Promise.all(promises).then((players) => {

    return db.GroupDB.createGroup((players as any)[0].id, "TestGroup").then((groupId) => {
        const promises = []
        for (let i = 1; i < players.length; i++) {
            promises.push(db.GroupDB.addPlayerToGroup((players[i] as any).id, groupId, false))
        }
        return Promise.all(promises);
    })
}).catch((err) => {
    console.log(err)
}).then(() => {
    console.log("Done");
})
