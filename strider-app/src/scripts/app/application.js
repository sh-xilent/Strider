import DocumentReadyEvent from 'events/doc-ready-event';
import DocumentReadyEventSource from 'events/doc-ready-event-source';
const {Deferred} = Strider.Module.import('strider-utils');
const {EventBus} = Strider.Module.import('strider-core/strider-core-event');

const ApplicationState = {
    CREATED: 'CREATED',
    STARTING: 'STARTING',
    STARTED: 'STARTED',
    STOPPING: 'STOPPING',
    STOPPED: 'STOPPED'
};

export default function Application() {

    const _this = this;

    let eventBus;

    let state = ApplicationState.CREATED;

    return Object.assign(this, {
        start,
        stop
    });

    function start() {
        pushState(ApplicationState.STARTING);

        eventBus = new EventBus();

        eventBus.registerSource(new DocumentReadyEventSource());
        return eventBus.eventPromise(DocumentReadyEvent)
            .then(() => console.log('Application started'))
            .then(() => {
                pushState(ApplicationState.STARTED);
                return _this;
            });
    }

    function stop() {
        pushState(ApplicationState.STOPPING);

        eventBus = null;

        const deferred = new Deferred();
        deferred.resolve();

        return deferred.promise
            .then(() => console.log('Application stopped'))
            .then(() => {
                pushState(ApplicationState.STOPPED);
                return _this;
            })
    }

    function pushState(targetState) {
        if (targetState !== ApplicationState.STARTED && state === ApplicationState.STARTING) {
            throw new Error('Application start in progress');
        }
        if (targetState === ApplicationState.STARTING && state === ApplicationState.STARTED) {
            throw new Error('Application already running');
        }
        if (targetState === ApplicationState.STOPPING && (state === ApplicationState.STOPPED || state === ApplicationState.CREATED)) {
            throw new Error('Application already stopped');
        }
        state = targetState;
    }
}