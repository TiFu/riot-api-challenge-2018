import {Achievement, Rule, AchievementType} from './models';
import { KillRule } from './rules';

export const achievements: Achievement[] = [
    {
        id: 1,
        name: "Test",
        description: "Test Description",
        trophyImage: "",
        type: AchievementType.PLAYER,
        rules: [
            new KillRule()
        ]
    }
]