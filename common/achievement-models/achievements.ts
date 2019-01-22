import { PlayerAchievement, PlayerAchievementGroup, GroupAchievement, PlayerAchievementCategory, GroupAchievementCategory, AchievementId, Achievement, AchievementGroup, GroupAchievementGroup, AchievemenCategory } from './models';
import { KillRule } from './rules';
import { GroupKillRule } from './group_rules';

import { MatchV4MatchDto, MatchV4MatchTimelineDto } from 'kayn/typings/dtos';


// [0], [1, 2], [3, 4, 5]
//TODO: sup, clown, group

//Clown
const group10Level0: PlayerAchievement = new PlayerAchievement(100, 0, "", "Test unlock message", "Warriors", "Become ARAM-challenjour. Go on a killing spree with more than 4/7/10 kills.", [new KillRule()]);
const group10Level1: PlayerAchievement = new PlayerAchievement(101, 1, "", "Test unlock message", "Warriors", "Become ARAM-challenjour. Go on a killing spree with more than 7/10 kills.", [new KillRule()]);
const group10Level2: PlayerAchievement = new PlayerAchievement(102, 2, "", "Test unlock message", "Warriors", "You have been promoted to ARAM-challenjour. Go on a killing spree with more than 10 kills to celebrate.", [new KillRule()]);

const group11Level0: PlayerAchievement = new PlayerAchievement(110, 0, "", "Test unlock message", "CS is power", "Knowledge is power? Nah. Have at least 80/120/170 CS.", [new KillRule()]);
const group11Level1: PlayerAchievement = new PlayerAchievement(111, 1, "", "Test unlock message", "CS is power", "Knowledge is power? Nah. Have at least 120/170 CS.", [new KillRule()]);
const group11Level2: PlayerAchievement = new PlayerAchievement(112, 2, "", "Test unlock message", "CS is power", "Have at least 170 CS. You could even win the game of thrones with all that CS.", [new KillRule()]);

const group12Level0: PlayerAchievement = new PlayerAchievement(120, 0, "", "Test unlock message", "Legends never die", "Legends also never go shopping. Win an ARAM with less than 2/1/no deaths.", [new KillRule()]);
const group12Level1: PlayerAchievement = new PlayerAchievement(121, 1, "", "Test unlock message", "Legends never die", "Legends also never go shopping. Win an ARAM with less than 1/no deaths.", [new KillRule()]);
const group12Level2: PlayerAchievement = new PlayerAchievement(122, 2, "", "Test unlock message", "Legends never die", "Legends also don't have any impact in ARAM lategame. Win an ARAM with no deaths.", [new KillRule()]);

const group13Level0: PlayerAchievement = new PlayerAchievement(130, 0, "", "Test unlock message", "We have eternity", "Just one more quick ARAM before going to bed? Play an ARAM that lasts longer than 25/30/38mins.", [new KillRule()]);
const group13Level1: PlayerAchievement = new PlayerAchievement(131, 1, "", "Test unlock message", "We have eternity", "Just one more quick ARAM before going to bed? Play an ARAM that lasts longer than 30/38mins.", [new KillRule()]);
const group13Level2: PlayerAchievement = new PlayerAchievement(132, 2, "", "Test unlock message", "We have eternity", "Play an ARAM that lasts longer than 38mins. Man, did you sign a peace treaty?", [new KillRule()]);

const group14Level0: PlayerAchievement = new PlayerAchievement(140, 0, "", "Test unlock message", "Worlds Collide", "Be brave! Build a Tear of the Goddess + a Blade of the Ruined King/+ Gargoyle Stone Plate/+ Mikael's Crucible in one game.", [new KillRule()]);
const group14Level1: PlayerAchievement = new PlayerAchievement(141, 1, "", "Test unlock message", "Worlds Collide", "Be brave! Build a Tear of the Goddess + a Blade of the Ruined King + Gargoyle Stone Plate/+ Mikael's Crucible in one game.", [new KillRule()]);
const group14Level2: PlayerAchievement = new PlayerAchievement(142, 2, "", "Test unlock message", "Worlds Collide", "Do you still have friends left to play with you? Build a Tear of the Goddess + a Blade of the Ruined King/+ Gargoyle Stone Plate + Mikael's Crucible in one game.", [new KillRule()]);

const group15Level0: PlayerAchievement = new PlayerAchievement(150, 0, "", "Test unlock message", "Run it down mid!", "Occasionally dying is too easy. Die more than 13/17/22 times and still win the game.", [new KillRule()]);
const group15Level1: PlayerAchievement = new PlayerAchievement(151, 1, "", "Test unlock message", "Run it down mid!", "Occasionally dying is too easy. Die more than 17/22 times and still win the game.", [new KillRule()]);
const group15Level2: PlayerAchievement = new PlayerAchievement(152, 2, "", "Test unlock message", "Run it down mid!", "I just really like to spend money. Die more than 22 times and still win the game.", [new KillRule()]);

export const group15: PlayerAchievementGroup = {
    name: "Run it down mid!",
    childAchievements: [],
    levels: [group15Level0, group15Level1, group15Level2],
}
export const group14: PlayerAchievementGroup = {
    name: "Worlds Collide",
    childAchievements: [],
    levels: [group14Level0, group14Level1, group14Level2],
}
export const group13: PlayerAchievementGroup = {
    name: "We have eternity",
    childAchievements: [],
    levels: [group13Level0, group13Level1, group13Level2]
}
export const group12: PlayerAchievementGroup = {
    name: "Legends never die",
    childAchievements: [group15],
    levels: [group12Level0, group12Level1, group12Level2],
}
export const group11: PlayerAchievementGroup = {
    name: "CS is power",
    childAchievements: [group13, group14],
    levels: [group11Level0, group11Level1, group11Level2],
}
export const group10: PlayerAchievementGroup = {
    name: "Warriors",
    childAchievements: [group11, group12],
    levels: [group10Level0, group10Level1, group10Level2]
}

//Top
const group20Level0: PlayerAchievement = new PlayerAchievement(200, 0, "", "Test unlock message", "Pressure", "Have a CS advantage of 15/25/40 compared to the enemy top laner at 10 minutes. No need to kill to destroy.", [new KillRule()]);
const group20Level1: PlayerAchievement = new PlayerAchievement(201, 1, "", "Test unlock message", "Pressure", "Have a CS advantage of 15/25/40 compared to the enemy top laner at 10 minutes. No need to kill to destroy.", [new KillRule()]);
const group20Level2: PlayerAchievement = new PlayerAchievement(202, 2, "", "Test unlock message", "Pressure", "Am I alone on this lane? Have a CS advantage of 15/25/40 compared to the enemy top laner at 10 minutes.", [new KillRule()]);

const group21Level0: PlayerAchievement = new PlayerAchievement(210, 0, "", "Test unlock message", "Meet Shelly", "Participate in killing the Rift Herald pre 20/15/10 minutes. This pet has same weird aggression issues.", [new KillRule()]);
const group21Level1: PlayerAchievement = new PlayerAchievement(211, 1, "", "Test unlock message", "Meet Shelly", "Participate in killing the Rift Herald pre 20/15/10 minutes. This pet has same weird aggression issues.", [new KillRule()]);
const group21Level2: PlayerAchievement = new PlayerAchievement(212, 2, "", "Test unlock message", "Meet Shelly", "Bye bye, turret. Participate in killing the Rift Herald pre 20/15/10 minutes.", [new KillRule()]);

const group22Level0: PlayerAchievement = new PlayerAchievement(220, 0, "", "Test unlock message", "No quarter", "I crush you like a Teemo. Win a game starting with Ignite and Ghost as summoner spells (and have more than 5/10 kills).", [new KillRule()]);
const group22Level1: PlayerAchievement = new PlayerAchievement(221, 1, "", "Test unlock message", "No quarter", "I crush you like a Teemo. Win a game starting with Ignite and Ghost as summoner spells and have more than 5/10 kills.", [new KillRule()]);
const group22Level2: PlayerAchievement = new PlayerAchievement(222, 2, "", "Test unlock message", "No quarter", "I crush everyone like a Teemo. Win a game starting with Ignite and Ghost as summoner spells and have more than 10 kills.", [new KillRule()]);

const group23Level0: PlayerAchievement = new PlayerAchievement(230, 0, "", "Test unlock message", "Hi inhib~", "Deal more than 7k/10k/13k damage to turrets. Run it down top!", [new KillRule()]);
const group23Level1: PlayerAchievement = new PlayerAchievement(231, 1, "", "Test unlock message", "Hi inhib~", "Deal more than 10k/13k damage to turrets. Run it down top!", [new KillRule()]);
const group23Level2: PlayerAchievement = new PlayerAchievement(232, 2, "", "Test unlock message", "Hi inhib~", "Deal more than 13k damage to turrets. And no, Ziggs is usually not a top lane champ.", [new KillRule()]);

const group24Level0: PlayerAchievement = new PlayerAchievement(240, 0, "", "Test unlock message", "Island", "I walk a lonely lane. There are only solo kills on top lane (no takedowns by other players from either side involving top laners) pre 10/15/20 minutes.", [new KillRule()]);
const group24Level1: PlayerAchievement = new PlayerAchievement(241, 1, "", "Test unlock message", "Island", "I walk a lonely lane. There are only solo kills on top lane (no takedowns by other players from either side involving top laners) pre 15/20 minutes.", [new KillRule()]);
const group24Level2: PlayerAchievement = new PlayerAchievement(242, 2, "", "Test unlock message", "Island", "My jungler is TSM Santorin. There are only solo kills on top lane (no takedowns by other players from either side involving top laners) pre 20 minutes.", [new KillRule()]);

const group25Level0: PlayerAchievement = new PlayerAchievement(250, 0, "", "Test unlock message", "“Tank Meta is over”", "My mum said I can be everything. Deal more than 20/30/40k damage to champions while having more than 30k damage taken.", [new KillRule()]);
const group25Level1: PlayerAchievement = new PlayerAchievement(251, 1, "", "Test unlock message", "“Tank Meta is over”", "My mum said I can be everything. Deal more than 30/40k damage to champions while having more than 30k damage taken.", [new KillRule()]);
const group25Level2: PlayerAchievement = new PlayerAchievement(252, 2, "", "Test unlock message", "“Tank Meta is over”", "Oh, I am not supposed to one-shot their carry? Deal more than 40k damage to champions while having more than 30k damage taken.", [new KillRule()]);

export const group25: PlayerAchievementGroup = {
    name: "“Tank Meta is over”",
    childAchievements: [],
    levels: [group25Level0, group25Level1, group25Level2],
}
export const group24: PlayerAchievementGroup = {
    name: "Island",
    childAchievements: [],
    levels: [group24Level0, group24Level1, group24Level2],
}
export const group23: PlayerAchievementGroup = {
    name: "Hi inhib~",
    childAchievements: [],
    levels: [group23Level0, group23Level1, group23Level2]
}
export const group22: PlayerAchievementGroup = {
    name: "No quarter",
    childAchievements: [group25],
    levels: [group22Level0, group22Level1, group22Level2],
}
export const group21: PlayerAchievementGroup = {
    name: "Meet Shelly",
    childAchievements: [group23, group24],
    levels: [group21Level0, group21Level1, group21Level2],
}
export const group20: PlayerAchievementGroup = {
    name: "Pressure",
    childAchievements: [group21, group22],
    levels: [group20Level0, group20Level1, group20Level2]
}

//Jungle
const group30Level0: PlayerAchievement = new PlayerAchievement(300, 0, "", "Test unlock message", "Danger!", "Participate in at least two lane kills/more than a kill on two different lanes/on every lane pre 15 minutes. The enemy laners love you.", [new KillRule()]);
const group30Level1: PlayerAchievement = new PlayerAchievement(301, 1, "", "Test unlock message", "Danger!", "Participate in more than a kill on two different lanes/on every lane pre 15 minutes. The enemy laners love you.", [new KillRule()]);
const group30Level2: PlayerAchievement = new PlayerAchievement(302, 2, "", "Test unlock message", "Danger!", "Make jungle great again! Participate in more than a kill on every lane pre 15 minutes.", [new KillRule()]);

const group31Level0: PlayerAchievement = new PlayerAchievement(310, 0, "", "Test unlock message", "Master Smiter", "Secure 3/5/7 epic monsters in one game. Such jungle talent, so wow.", [new KillRule()]);
const group31Level1: PlayerAchievement = new PlayerAchievement(311, 1, "", "Test unlock message", "Master Smiter", "Secure 5/7 epic monsters in one game. Such jungle talent, so wow.", [new KillRule()]);
const group31Level2: PlayerAchievement = new PlayerAchievement(312, 2, "", "Test unlock message", "Master Smiter", "Secure 7 epic monsters in one game. Now that's gonna be one powerful elder drake.", [new KillRule()]);

const group32Level0: PlayerAchievement = new PlayerAchievement(320, 0, "", "Test unlock message", "Strategic waiting", "Don't forget to bring your tent. Participate in killing the same enemy laner 2/4/6 times pre 15min.", [new KillRule()]);
const group32Level1: PlayerAchievement = new PlayerAchievement(321, 1, "", "Test unlock message", "Strategic waiting", "Don't forget to bring your tent. Participate in killing the same enemy laner 4/6 times pre 15min.", [new KillRule()]);
const group32Level2: PlayerAchievement = new PlayerAchievement(322, 2, "", "Test unlock message", "Strategic waiting", "Participate in killing the same enemy laner 6 times pre 15min. Did you get his All-Chat love yet?", [new KillRule()]);

const group33Level0: PlayerAchievement = new PlayerAchievement(330, 0, "", "Test unlock message", "Invasion", "Kill the enemy jungler in their jungle 1/3/5 times before the 20 minute mark. I will find you, and I will kill you!", [new KillRule()]);
const group33Level1: PlayerAchievement = new PlayerAchievement(331, 1, "", "Test unlock message", "Invasion", "Kill the enemy jungler in their jungle 3/5 times before the 20 minute mark. I will find you, and I will kill you!", [new KillRule()]);
const group33Level2: PlayerAchievement = new PlayerAchievement(332, 2, "", "Test unlock message", "Invasion", "Kill the enemy jungler in their jungle 5 times before the 20 minute mark. A new invasive species has been detected.", [new KillRule()]);

const group34Level0: PlayerAchievement = new PlayerAchievement(340, 0, "", "Test unlock message", "Help me push", "Get an assist on 1/2/all three outer turrets. Objectives > kills.", [new KillRule()]);
const group34Level1: PlayerAchievement = new PlayerAchievement(341, 1, "", "Test unlock message", "Help me push", "Get an assist on 2/all three outer turrets. Objectives > kills.", [new KillRule()]);
const group34Level2: PlayerAchievement = new PlayerAchievement(342, 2, "", "Test unlock message", "Help me push", "Get an assist on all three outer turrets. Don't forget to collect tax while you are at it muhahaha.", [new KillRule()]);

const group35Level0: PlayerAchievement = new PlayerAchievement(350, 0, "", "Test unlock message", "Lost in the jungle", "GG no jungler. Have less than 10k/5k/least damage dealt to enemy champions and win the game.", [new KillRule()]);
const group35Level1: PlayerAchievement = new PlayerAchievement(351, 1, "", "Test unlock message", "Lost in the jungle", "GG no jungler. Have less than 5k/least damage dealt to enemy champions and win the game.", [new KillRule()]);
const group35Level2: PlayerAchievement = new PlayerAchievement(352, 2, "", "Test unlock message", "Lost in the jungle", "Have less than least damage dealt to enemy champions and win the game. Did we just win 4v5?", [new KillRule()]);

export const group35: PlayerAchievementGroup = {
    name: "Lost in the jungle",
    childAchievements: [],
    levels: [group35Level0, group35Level1, group35Level2],
}
export const group34: PlayerAchievementGroup = {
    name: "Help me push",
    childAchievements: [],
    levels: [group34Level0, group34Level1, group34Level2],
}
export const group33: PlayerAchievementGroup = {
    name: "Invasion",
    childAchievements: [],
    levels: [group33Level0, group33Level1, group33Level2]
}
export const group32: PlayerAchievementGroup = {
    name: "Strategic waiting",
    childAchievements: [group35],
    levels: [group32Level0, group32Level1, group32Level2],
}
export const group31: PlayerAchievementGroup = {
    name: "Master Smiter",
    childAchievements: [group33, group34],
    levels: [group31Level0, group31Level1, group31Level2],
}
export const group30: PlayerAchievementGroup = {
    name: "Danger!",
    childAchievements: [group31, group32],
    levels: [group30Level0, group30Level1, group30Level2]
}

//Mid
const group40Level0: PlayerAchievement = new PlayerAchievement(400, 0, "", "Test unlock message", "Open up the map", "Push down the enemy mid turret before 15 minutes/10 minutes/any champion gets first blooded. Now their map just got a lot more dangerous.", [new KillRule()]);
const group40Level1: PlayerAchievement = new PlayerAchievement(401, 1, "", "Test unlock message", "Open up the map", "Push down the enemy mid turret before 10 minutes/any champion gets first blooded. Now their map just got a lot more dangerous.", [new KillRule()]);
const group40Level2: PlayerAchievement = new PlayerAchievement(402, 2, "", "Test unlock message", "Open up the map", "Have you considered a career in demolition yet? Push down the enemy mid turret before any champion gets first blooded.", [new KillRule()]);

const group41Level0: PlayerAchievement = new PlayerAchievement(410, 0, "", "Test unlock message", "Snacked", "Win lane, win game. Be ahead of the enemy mid laner by 2/5/10 kills at 20 minutes and win the game.", [new KillRule()]);
const group41Level1: PlayerAchievement = new PlayerAchievement(411, 1, "", "Test unlock message", "Snacked", "Win lane, win game. Be ahead of the enemy mid laner by 5/10 kills at 20 minutes and win the game.", [new KillRule()]);
const group41Level2: PlayerAchievement = new PlayerAchievement(412, 2, "", "Test unlock message", "Snacked", "Better mid wins. Be ahead of the enemy mid laner by 10 kills at 20 minutes and win the game.", [new KillRule()]);

const group42Level0: PlayerAchievement = new PlayerAchievement(420, 0, "", "Test unlock message", "Heroes never die", "Is it still tank meta? Have more than 20k/30k/most damage taken in game.", [new KillRule()]);
const group42Level1: PlayerAchievement = new PlayerAchievement(421, 1, "", "Test unlock message", "Heroes never die", "Is it still tank meta? Have more than 30k/most damage taken in game.", [new KillRule()]);
const group42Level2: PlayerAchievement = new PlayerAchievement(422, 2, "", "Test unlock message", "Heroes never die", "Is it still tank meta? Have more than most damage taken in game.", [new KillRule()]);

const group43Level0: PlayerAchievement = new PlayerAchievement(430, 0, "", "Test unlock message", "Mid SS", "Get a total of 2/4/6 takedowns pre 15 minutes on top- and botlane. They'll never know what hit them.", [new KillRule()]);
const group43Level1: PlayerAchievement = new PlayerAchievement(431, 1, "", "Test unlock message", "Mid SS", "Get a total of 4/6 takedowns pre 15 minutes on top- and botlane. They'll never know what hit them.", [new KillRule()]);
const group43Level2: PlayerAchievement = new PlayerAchievement(432, 2, "", "Test unlock message", "Mid SS", "It's a team game and your enemies are hating you for it. Get a total of 6 takedowns pre 15 minutes on top- and botlane.", [new KillRule()]);

const group44Level0: PlayerAchievement = new PlayerAchievement(440, 0, "", "Test unlock message", "Wait for me", "Achieve more than 60%/70%/80% kill participation in one game. At least gimme an assist!", [new KillRule()]);
const group44Level1: PlayerAchievement = new PlayerAchievement(441, 1, "", "Test unlock message", "Wait for me", "Achieve more than 60%/70%/80% kill participation in one game. At least gimme an assist!", [new KillRule()]);
const group44Level2: PlayerAchievement = new PlayerAchievement(442, 2, "", "Test unlock message", "Wait for me", "Achieve more than 60%/70%/80% kill participation in one game. Did you just sneak assists, or did you actually contribute?", [new KillRule()]);

const group45Level0: PlayerAchievement = new PlayerAchievement(450, 0, "", "Test unlock message", "It's not over yet", "Get a solo kill on the enemy mid laner while being down 1/3/5 kills compared to him. Or her.", [new KillRule()]);
const group45Level1: PlayerAchievement = new PlayerAchievement(451, 1, "", "Test unlock message", "It's not over yet", "Get a solo kill on the enemy mid laner while being down 3/5 kills compared to him. Found my outplay button.", [new KillRule()]);
const group45Level2: PlayerAchievement = new PlayerAchievement(452, 2, "", "Test unlock message", "It's not over yet", "Get a solo kill on the enemy mid laner while being down 5 kills compared to him. Maybe he should just uninstall.", [new KillRule()]);

export const group45: PlayerAchievementGroup = {
    name: "It's not over yet",
    childAchievements: [],
    levels: [group45Level0, group45Level1, group45Level2],
}
export const group44: PlayerAchievementGroup = {
    name: "Wait for me",
    childAchievements: [],
    levels: [group44Level0, group44Level1, group44Level2],
}
export const group43: PlayerAchievementGroup = {
    name: "Mid SS",
    childAchievements: [],
    levels: [group43Level0, group43Level1, group43Level2]
}
export const group42: PlayerAchievementGroup = {
    name: "Heroes never die",
    childAchievements: [group45],
    levels: [group42Level0, group42Level1, group42Level2],
}
export const group41: PlayerAchievementGroup = {
    name: "Snacked",
    childAchievements: [group43, group44],
    levels: [group41Level0, group41Level1, group41Level2],
}
export const group40: PlayerAchievementGroup = {
    name: "Open up the map",
    childAchievements: [group41, group42],
    levels: [group40Level0, group40Level1, group40Level2]
}

//ADC
const group50Level0: PlayerAchievement = new PlayerAchievement(500, 0, "", "Test unlock message", "Farmerama", "You rise and fall by your farming skill. Proof that you are a good farmer, have 65/75/90 CS at 10 minutes.", [new KillRule()]);
const group50Level1: PlayerAchievement = new PlayerAchievement(501, 1, "", "Test unlock message", "Farmerama", "You rise and fall by your farming skill. Have 75/90 CS at 10 minutes.", [new KillRule()]);
const group50Level2: PlayerAchievement = new PlayerAchievement(502, 2, "", "Test unlock message", "Farmerama", "You farm well indeed. Can you manage 90 CS at 10 minutes?", [new KillRule()]);

const group51Level0: PlayerAchievement = new PlayerAchievement(510, 0, "", "Test unlock message", "I will carry you", "It's called carry for a reason. Win a game with more than 25k/35k/50k damage dealt to champions.", [new KillRule()]);
const group51Level1: PlayerAchievement = new PlayerAchievement(511, 1, "", "Test unlock message", "I will carry you", "It's called carry for a reason. Win a game with more than 35k/50k damage dealt to champions.", [new KillRule()]);
const group51Level2: PlayerAchievement = new PlayerAchievement(512, 2, "", "Test unlock message", "I will carry you", "GG no bot my a**. Win a game with more than 50k damage dealt to champions.", [new KillRule()]);

const group52Level0: PlayerAchievement = new PlayerAchievement(520, 0, "", "Test unlock message", "Hi I'm support", "Report my team for ks! Finish a game while having less than 2/1/0 kills and at least 5/7/10 assists.", [new KillRule()]);
const group52Level1: PlayerAchievement = new PlayerAchievement(521, 1, "", "Test unlock message", "Hi I'm support", "Report my team for ks! Finish a game while having less than 1/0 kills and at least 7/10 assists.", [new KillRule()]);
const group52Level2: PlayerAchievement = new PlayerAchievement(522, 2, "", "Test unlock message", "Hi I'm support", "Maybe I should find another job. Finish a game while having 0 kills and at least 10 assists.", [new KillRule()]);

const group53Level0: PlayerAchievement = new PlayerAchievement(530, 0, "", "Test unlock message", "I will hunt you down", "Passive laning is boring. Score a double kill before 15/10/5 minutes into the game.", [new KillRule()]);
const group53Level1: PlayerAchievement = new PlayerAchievement(531, 1, "", "Test unlock message", "I will hunt you down", "Passive laning is boring. Score a double kill before 10/5 minutes into the game.", [new KillRule()]);
const group53Level2: PlayerAchievement = new PlayerAchievement(532, 2, "", "Test unlock message", "I will hunt you down", "Channel your inner Draven. Score a double kill before 5 minutes into the game.", [new KillRule()]);

const group54Level0: PlayerAchievement = new PlayerAchievement(540, 0, "", "Test unlock message", "Strong & independent", "I don't need protection. Get 2/4/7 solo kills in one game.", [new KillRule()]);
const group54Level1: PlayerAchievement = new PlayerAchievement(541, 1, "", "Test unlock message", "Strong & independent", "I don't need protection. Get 4/7 solo kills in one game.", [new KillRule()]);
const group54Level2: PlayerAchievement = new PlayerAchievement(542, 2, "", "Test unlock message", "Strong & independent", "Support, you are fired! Get 7 solo kills in one game.", [new KillRule()]);

const group55Level0: PlayerAchievement = new PlayerAchievement(550, 0, "", "Test unlock message", "Squishy?", "Tired of being one-shot? Build a Bramble Vest before 20/15/10 minutes and keep it until the end of the game. Oh, and winning is important as well.", [new KillRule()]);
const group55Level1: PlayerAchievement = new PlayerAchievement(551, 1, "", "Test unlock message", "Squishy?", "Tired of being one-shot? Build a Bramble Vest before 15/10 minutes and keep it until the end of the game. Oh, and winning is important as well.", [new KillRule()]);
const group55Level2: PlayerAchievement = new PlayerAchievement(552, 2, "", "Test unlock message", "Squishy?", "Better than Executioner's Calling, trust me. Build a Bramble Vest before 10 minutes and keep it until the end of the game. Oh, and winning is important as well.", [new KillRule()]);

export const group55: PlayerAchievementGroup = {
    name: "Squishy?",
    childAchievements: [],
    levels: [group55Level0, group55Level1, group55Level2],
}
export const group54: PlayerAchievementGroup = {
    name: "Strong & independent",
    childAchievements: [],
    levels: [group54Level0, group54Level1, group54Level2],
}
export const group53: PlayerAchievementGroup = {
    name: "I will hunt you down",
    childAchievements: [],
    levels: [group53Level0, group53Level1, group53Level2]
}
export const group52: PlayerAchievementGroup = {
    name: "Hi I'm support",
    childAchievements: [group55],
    levels: [group52Level0, group52Level1, group52Level2],
}
export const group51: PlayerAchievementGroup = {
    name: "I will carry you",
    childAchievements: [group53, group54],
    levels: [group51Level0, group51Level1, group51Level2],
}
export const group50: PlayerAchievementGroup = {
    name: "Farmerama",
    childAchievements: [group51, group52],
    levels: [group50Level0, group50Level1, group50Level2]
}


// Clown ID 1xx
<<<<<<< HEAD
const clownCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "ARAM", "desc", "./assets/lanes/fun.png", group50);
=======
const clownCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "Test", "desc", "./assets/lanes/fun.png", group10);
>>>>>>> added aram achievement structure

//Top ID 2xx
const topCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "1x1.png"}], "Top", "desc", "./assets/lanes/top.png", group20);

// Jungle ID 3xx
const jungleCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "Jungle", "desc", "./assets/lanes/jungle.png", group30);

// Mid ID 4xx
const midCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "Mid", "desc", "./assets/lanes/middle.png", group40);

// ADC ID 5xx
const adcCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "1x1.png"}, { completionState: 0.15, trophyImage: "adc_1.png"}, { completionState: 0.44, trophyImage: "adc_2.png"}, { completionState: 0.71, trophyImage: "adc_3.png"}, { completionState: 0.99, trophyImage: "adc_4.png"}], "ADC", "desc", "./assets/lanes/bottom.png", group50);

// Support ID 6xx
const supportCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "Support", "desc", "./assets/lanes/support.png", group50);


type PlayerAchievementCategories = {
    "top": PlayerAchievementCategory,
    "jungle": PlayerAchievementCategory,
    "mid": PlayerAchievementCategory,
    "support": PlayerAchievementCategory,
    "adc": PlayerAchievementCategory,
    "clownfiesta": PlayerAchievementCategory
}


export const playerAchievementCategories: PlayerAchievementCategories = {
    "top": topCategory,
    "jungle": jungleCategory,
    "mid": midCategory,
    "support": supportCategory,
    "adc": adcCategory,
    "clownfiesta": clownCategory
}



// Group Achievement Category
const group2Level0: GroupAchievement = new GroupAchievement(2, 0,  "", "test unlock message", "achievement2 test name", "desc", [ new GroupKillRule() ]);
const group3Level0: GroupAchievement = new GroupAchievement(3, 0, "", "test unlock message", "achievement3 test name", "desc", [ new GroupKillRule() ]);

const group3: GroupAchievementGroup = {
    name: "Test2",
    childAchievements: [],
    levels: [group3Level0]
}
const group2: GroupAchievementGroup = {
    name: "Test",
    childAchievements: [group3],
    levels: [group2Level0]
}

export const groupAchievementCategories: GroupAchievementCategory[] = [
    new GroupAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "Group Test", "Test Description", "", group2)
]

export const achievementMap = new Map<number, Achievement<any>>()

for (const categoryName in playerAchievementCategories) {
    const category = (playerAchievementCategories as any)[categoryName];
    iterateAndFillMap(category, achievementMap);
}
for (const category of groupAchievementCategories) {
    iterateAndFillMap(category, achievementMap);
}

function iterateAndFillMap(category: AchievemenCategory<any>, map: Map<number, Achievement<any>>) {
    const groups = [category.getFirstGroup()]
    while (groups.length > 0) {
        const group = groups.pop() as AchievementGroup<any>;
        if (group.levels)
            group.levels.forEach(a => map.set(a.id, a));
        if (group.childAchievements)
            group.childAchievements.forEach(a => groups.push(a));
    }
}




export function checkPlayerAchievementCategories(encryptedAccountId: string, obtainedAchievements: Set<AchievementId>, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto, playerAchievementCategories: { [key: string]: PlayerAchievementCategory}) {
    const allObtainedIds: AchievementId[] = [];
    for (const categoryName in playerAchievementCategories) {
        const category = playerAchievementCategories[categoryName];
        const newlyObtainedAchievements = category.checkCategory(encryptedAccountId, obtainedAchievements, game, timeline);
        newlyObtainedAchievements.forEach(a => allObtainedIds.push(a));
    }
    return allObtainedIds;
}

export function filterForLowestObtainableId(obtainableIds: Set<number>, group: AchievementGroup<any>) {

    const ids = group.levels.map(l => l.id);
    let remove = false;
    let log = false;
    for (let i = 0; i < ids.length; i++) {
        if (ids[i] == 530 || ids[i] == 531 || ids[i] == 532) {
            log = true
        }
        if (remove) {
            if (log) {
                console.log("[filter] Removing " + ids[i])
            }
            obtainableIds.delete(ids[i])
        } else if (obtainableIds.has(ids[i])) {
            if (log) {
                console.log("[filter] Lowest ID: " + ids[i] + " was in obtainable id set.")
            }
            remove = true;
        }
    }
    for (let child of group.childAchievements) {
        filterForLowestObtainableId(obtainableIds, child);
    }
    return obtainableIds;
}

export function checkGroupAchievementCategories(accountIds: string[], obtainedAchievements: Set<AchievementId>, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto, groupAchievementCategories: GroupAchievementCategory[]) {
    const allObtainedIds: AchievementId[] = [];
    for (const category of groupAchievementCategories) {
        const newlyObtainedAchievements = category.checkCategory(accountIds, obtainedAchievements, game, timeline);
        newlyObtainedAchievements.forEach(a => allObtainedIds.push(a));
    }
    return allObtainedIds;
}

export function getCategoryCompletionState(category: AchievemenCategory<any>, obtainedAchievements: Set<number>) {
    const [achieved, total ]= groupCompletionState(category.getFirstGroup(), obtainedAchievements);
    return achieved / total;
}

export function getObtainableIds(category: AchievemenCategory<any>, obtainedAchievements: Set<number>) {
    return obtainableIdsByGroup(category.getFirstGroup(), obtainedAchievements)
}

function obtainableIdsByGroup(group: AchievementGroup<PlayerAchievement | GroupAchievement>, obtainedAchievements: Set<number>): number[] {
    const success = group.levels.some(l => obtainedAchievements.has(l.id));
    const obtainable: number[] = []
    if (success) {
        for (const childGroup of group.childAchievements) {
            obtainableIdsByGroup(childGroup, obtainedAchievements).forEach(a => obtainable.push(a));
        }
    }
    group.levels.filter(l => !obtainedAchievements.has(l.id)).forEach(l => obtainable.push(l.id));
    return obtainable;
}

function groupCompletionState(group: AchievementGroup<PlayerAchievement | GroupAchievement>, obtainedAchievements: Set<number>): [number, number] {
    let total = 0
    let achieved = 0;
    for (const level of group.levels) {
        if (obtainedAchievements.has(level.id)) {
            achieved++;
        } 
        total++;
    }
    for (const child of group.childAchievements) {
        const [childAchieved, childTotal] = groupCompletionState(child, obtainedAchievements)
        total += childTotal
        achieved += childAchieved
    }
    return [achieved, total];
}