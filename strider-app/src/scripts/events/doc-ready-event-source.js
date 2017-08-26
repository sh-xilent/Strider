import DocumentReadyEvent from 'events/doc-ready-event';
const {EventSource} = Strider.Module.import('strider-core/strider-core-event');

export default class DocumentReadyEventSource extends EventSource {
    start(eventObserver) {
        const _this = this;

        if (isDocumentInCompleteState() || documentIsNotLoading()) {
            setTimeout(() => eventObserver(new DocumentReadyEvent(_this, document)), 0);
        } else {
            document.addEventListener("DOMContentLoaded", () => {
                eventObserver(new DocumentReadyEvent(_this, document));
            });
        }
    }
}

function documentIsNotLoading() {
    return document.readyState !== "loading" && !document.documentElement.doScroll;
}

function isDocumentInCompleteState() {
    return document.readyState === "complete";
}