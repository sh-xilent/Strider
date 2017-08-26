const {Model} = Strider.Module.import('strider-utils');

export default Model.create({
    /**
     * Describes that rest service should use promises as return value of any resource
     */
    async: true,

    /**
     * Could be used to call subdomain or make a cross origin request
     */
    targetHost: null
});