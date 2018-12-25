import {slot, Slot, createEventBus, GenericChannel, combineEvents, TransportMessage} from 'ts-event-bus'
import { LocalPlayer } from './models';
import { GroupInviteRequest, GroupInviteResponse } from 'achievement-sio';

const AchievementEvents = {
    "user_update": slot<LocalPlayer>(),
    "group_invite_request": slot<GroupInviteRequest, GroupInviteResponse>(),
    "lcu_connected": slot<void, void>(),
    "lcu_disconnected": slot<void, void>(),
    "user_login": slot<void, void>()
}

export type AchievementEventBus = {
    "user_update": Slot<LocalPlayer>,
    "group_invite_request": Slot<GroupInviteRequest, GroupInviteResponse>,
    "lcu_connected": Slot<void, void>,
    "lcu_disconnected": Slot<void, void>,
    "user_login": Slot<void, void>
}

const eventBus = createEventBus( {
    events: AchievementEvents
})

export default eventBus