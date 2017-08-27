import {AppConfig} from "../config/app-config";
import DocumentReadyEvent from 'events/doc-ready-event';
import DocumentReadyEventSource from 'events/doc-ready-event-source';
const {Deferred, Types} = Strider.Module.import('strider-utils');
const {EventBus} = Strider.Module.import('strider-core/strider-core-event');
const {BeanInjectionService} = Strider.Module.import('strider-core/strider-core-injection');

const ApplicationState = {
    CREATED: 'CREATED',
    STARTING: 'STARTING',
    STARTED: 'STARTED',
    STOPPING: 'STOPPING',
    STOPPED: 'STOPPED'
};

export default function Application(config) {
    Types.check(arguments, AppConfig);

    const _this = this;

    let eventBus;
    let beanInjectionService;

    let state = ApplicationState.CREATED;

    return Object.assign(this, {
        start,
        stop,
        getBeanInjectionService
    });

    function start() {
        pushState(ApplicationState.STARTING);

        eventBus = new EventBus();

        eventBus.registerSource(new DocumentReadyEventSource());
        return eventBus.eventPromise(DocumentReadyEvent)
            .then(() => beanInjectionService = new BeanInjectionService(config.beanConfig))
            .then(() => {
                pushState(ApplicationState.STARTED);
                return _this;
            });
    }

    function stop() {
        pushState(ApplicationState.STOPPING);

        eventBus = null;
        beanInjectionService = null;

        const deferred = new Deferred();
        deferred.resolve();

        return deferred.promise
            .then(() => {
                pushState(ApplicationState.STOPPED);
                return _this;
            })
    }

    function getBeanInjectionService() {
        return beanInjectionService;
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