import λ from "apex.js";
import updateDeviceShadow from './update-device-shadow';

export default λ(event =>
    updateDeviceShadow(process.env.IOT_ENDPOINT, process.env.IOT_THING_NAME, event.data)
);
