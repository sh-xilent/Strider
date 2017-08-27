import HttpServiceConstructor from 'services/http-service-constructor';
import HttpServiceProcessor from 'processor/http-service-processor';
const {ProcessorScope} = Strider.Module.import('strider-core/strider-core-injection');
const {ObjectTransformer} = Strider.Module.import('strider-utils');

export default class HttpModuleExtension extends ObjectTransformer {
    transform(moduleConfig) {
        return moduleConfig
            .service(HttpServiceConstructor)
            .processor(HttpServiceProcessor, ProcessorScope.GLOBAL);
    }
}