import λ from "apex.js";
import setFlowLed from "./set-flow-led";

export default λ(async event => {
    // Set LED state as 0 or 1 if it is available
    if (!event.state || undefined === event.state.led) {
        console.log("No state or LED state provided, so no action will be taken");
        return;
    }

    const ledState = +event.state.led ? 1 : 0;
    const response = await setFlowLed(process.env.FLOW_ENDPOINT, process.env.DEVICE_SERIAL_ID, ledState);
    return response.data;
});
