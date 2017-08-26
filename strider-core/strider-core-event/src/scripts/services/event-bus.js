import Event from 'events/event';
import EventSource from 'events/event-source';
const {Types, Deferred} = Strider.Module.import('strider-utils');

export default function EventBus() {

    const eventSources = [];
    const eventObservers = [];

    return Object.assign(this, {
        registerSource,
        registerObserver,
        fireEvent,
        eventPromise
    });

    function registerSource(eventSource) {
        Types.checkType(eventSource, EventSource);

        eventSources.push(eventSource);
        eventSource.start(fireEvent);
    }

    function registerObserver(event, observer) {
        Types.checkType(event.prototype, Event);
        Types.checkType(observer, Function);
        eventObservers.push(createObserverDescriptor(event, observer));
    }

    function fireEvent(event) {
        Types.checkType(event, Event);
        eventObservers
            .filter((observerDescriptor) => event instanceof observerDescriptor.event)
            .forEach(({observer}) => observer(event));
    }

    function eventPromise(event) {
        let descriptor;
        const deferred = new Deferred();
        descriptor = createObserverDescriptor(event, (event) => {
            const index = eventObservers.indexOf(descriptor);
            eventObservers.splice(index, 1);
            deferred.resolve(event);
        });
        eventObservers.push(descriptor);
        return deferred.promise;
    }

    function createObserverDescriptor(event, observer) {
        return {event, observer};
    }
}