import {slot, Slot, createEventBus, GenericChannel, combineEvents, TransportMessage} from 'ts-event-bus'

const AchievementEvents = {
    "lcu_connection_state_changed": slot<boolean, void>(),
}

export type AchievementEventBus = {
    "lcu_connection_state_changed": Slot<boolean, void>,
    "user_login": Slot<void, void>
}

const eventBus = createEventBus( {
    events: AchievementEvents
})

export default eventBus