import { loadConfigFromEnvironment } from '../achievement-config/index';
import { AchievementDB} from 'achievement-db'

const config = loadConfigFromEnvironment();
const db = new AchievementDB(config.db);
db.createPlayer(36904072, "euw1", "TiFu", "lVSMwnL45YvVvPO9ejH95PsKNhfhG9vw_whFXSYzPQ6znQ").catch((err) => {
    console.log(err)
}).then(() => {
    console.log("Done");
})
