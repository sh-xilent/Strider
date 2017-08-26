Strider.Module.register(new Strider.Module('strider-core/strider-core-event', ['strider-utils'], (exports) => {
    Object.assign(exports, {
        Event: require('events/event').default,
        EventSource: require('events/event-source').default,
        EventBus: require('services/event-bus').default
    });
}));