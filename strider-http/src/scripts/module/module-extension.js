import HttpServiceConstructor from 'services/http-service-constructor';
import HttpRequestFactory from 'request/http-request';
import NativeRequestFactory from 'request/native-request';
import ResponseSupplierFactory from 'request/response-supplier';
import HttpServiceProcessor from 'processor/http-service-processor';
const {ObjectTransformer} = Strider.Module.import('strider-utils');

export default class HttpModuleExtension extends ObjectTransformer {
    transform(moduleConfig) {
        return moduleConfig
            .bean(HttpRequestFactory)
            .bean(NativeRequestFactory)
            .bean(ResponseSupplierFactory)
            .service(HttpServiceConstructor)
            .processor(HttpServiceProcessor);
    }
}