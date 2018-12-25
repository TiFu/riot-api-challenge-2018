import { PlayerStateUpdatedAction, PlayerInfo } from './types';
import { ActionCreator } from 'redux';

export const updatePlayerInfo: ActionCreator<PlayerStateUpdatedAction> = (playerInfo?: PlayerInfo) => {
    return {
        type: '@@player/PLAYER_STATE_UPDATED',
        payload: playerInfo
    }
}