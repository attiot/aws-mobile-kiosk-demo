import λ from "apex.js";
import updateDeviceShadow from './update-device-shadow';

export default λ(async event => {
    return await updateDeviceShadow(process.env.IOT_ENDPOINT, process.env.IOT_THING_NAME, event.data);
});
