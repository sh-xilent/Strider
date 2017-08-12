import Model from 'models/model';
import REQUEST_METHOD from "constants/request-method-constants";

export default Model.create({
    /**
     * Resource url. Could parametrized in such way: /resource/{param1}/get?query={param2}.
     * Note: if query parameter has no value, it will not be sent in request.
     * @Required
     */
    url: null,

    /**
     * HTTP method, see {@code constants/request-method-constants#REQUEST_METHOD}
     * @Required
     */
    method: REQUEST_METHOD.GET,

    /**
     * Will be used as request body
     * @Optional
     */
    body: null,

    /**
     * Response model, should be {@code models/model#Model}
     * @Optional
     */
    response: null,

    /**
     * Function which able to transform response body text to appropriate data
     * @Optional
     */
    bodyReader: null
});