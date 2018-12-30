import { AchievementDB } from 'achievement-db'
import { loadConfigFromEnvironment } from 'achievement-config';
import { AchievementRedis } from 'achievement-redis';
import { ProcessingMaster } from './services/ProcessingMaster';
import { ProcessingService } from './services/ProcessingService';

import {Kayn, REGIONS } from 'kayn'

const config = loadConfigFromEnvironment()

const db = new AchievementDB(config.db)

const riotApi = Kayn(config.riotApi.apiKey)()
const subscribeRedis = new AchievementRedis(config.redis) // redis subscribed mode doesn't allow publish etc
const processingRedis = new AchievementRedis(config.redis);

const processingService = new ProcessingService(riotApi, db, processingRedis)
const master = new ProcessingMaster(subscribeRedis, processingRedis, processingService);
master.run()