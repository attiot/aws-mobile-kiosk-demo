import 'core-js/es6';
import 'core-js/es7/reflect';
require('zone.js/dist/zone');
if (!process.env.ENABLE_PROD_MODE) {
    Error['stackTraceLimit'] = Infinity;
    require('zone.js/dist/long-stack-trace-zone');
}
