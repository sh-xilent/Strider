import HttpService from 'services/http-service';
import HttpServiceConstructor from 'services/http-service-constructor';
const {Types, ObjectTransformer} = Strider.Module.import('strider-utils');

HttpServiceProcessor.prototype = new ObjectTransformer();

HttpServiceProcessor.inject = ['httpServiceConstructor'];
export default function HttpServiceProcessor(httpServiceConstructor) {
    Types.check(arguments, HttpServiceConstructor);

    return Object.assign(this, {
        transform
    });

    function transform(bean) {
        if (bean instanceof HttpService) {
            return httpServiceConstructor.constructFromInstance(bean);
        }
        return bean;
    }
}