import HttpRequestFactory from 'request/http-request';
import NativeRequestFactory from 'request/native-request';
import ResponseSupplierFactory from 'request/response-supplier';
const {ObjectTransformer} = Strider.Module.import('strider-utils');

export default class ResourcesModuleExtension extends ObjectTransformer {
    transform(moduleConfig) {
        return moduleConfig
            .bean(HttpRequestFactory)
            .bean(NativeRequestFactory)
            .bean(ResponseSupplierFactory);
    }
}