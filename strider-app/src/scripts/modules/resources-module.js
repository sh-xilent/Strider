import ModuleConfig from 'config/module-config';
const {HttpRequestFactory, NativeRequestFactory, ResponseSupplierFactory} = Strider.Module.import('strider-core/strider-core-resources');

export default new ModuleConfig('strider-core-resources')
    .bean(HttpRequestFactory)
    .bean(NativeRequestFactory)
    .bean(ResponseSupplierFactory)
    .toModel();