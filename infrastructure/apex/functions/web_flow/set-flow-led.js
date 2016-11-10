import axios from "axios";

// Set provided LED state for the provided device serial on the provided
// Flow host
function setFlowLed(flowEndpoint, serial, state) {
    return axios({
        url: `https://${flowEndpoint}/setLed`,
        method: "POST",
        data: {serial, state},
    });
}

export default setFlowLed;

// For testing, call flow endpoint directly
// Set the TEST_LED_STATE environment variable to 0 or 1 as desired
if (require.main === module) {
    setFlowLed(process.env.FLOW_ENDPOINT, process.env.DEVICE_SERIAL_ID, +process.env.TEST_LED_STATE)
    .then(response => console.log(response.data))
    .catch(err => console.error(err));
}
