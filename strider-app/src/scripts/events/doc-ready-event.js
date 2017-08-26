const {Event} = Strider.Module.import('strider-core/strider-core-event');

export default class DocumentReadyEvent extends Event {
    constructor(source, target) {
        super();
        Object.assign(this, {source, target});
    }
}