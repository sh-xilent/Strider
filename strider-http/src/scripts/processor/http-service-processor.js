import BeanProcessor from 'processor/bean-processor';
import HttpService from 'services/http-service';
import HttpServiceConstructor from 'services/http-service-constructor';
const {Types} = Strider.Module.import('strider-utils');

HttpServiceProcessor.prototype = new BeanProcessor();

export default function HttpServiceProcessor(httpServiceConstructor) {
    Types.check(arguments, HttpServiceConstructor);

    return Object.assign(this, {
        process
    });

    function process(bean) {
        if (bean instanceof HttpService) {
            return httpServiceConstructor.constructFromInstance(bean);
        }
        return bean;
    }
}