import {IotData} from "aws-sdk";

// Update an IoT device shadow with the desired state
async function updateDeviceShadow(endpoint, thingName, desired) {
    const iotData = new IotData({endpoint});
    const deviceShadowPayload = {
        state: {
            desired,
        },
    };

    const params = {
        thingName,
        payload: JSON.stringify(deviceShadowPayload),
    };

    return await iotData.updateThingShadow(params).promise();
}

export default updateDeviceShadow;

// For testing, update device shadow when run directly
// Set the TEST_PAYLOAD environment variable as the desired state JSON string
if (require.main === module) {
    updateDeviceShadow(process.env.IOT_ENDPOINT, process.env.IOT_THING_NAME, JSON.parse(process.env.TEST_PAYLOAD))
    .then(data => console.log(data))
    .catch(err => console.error(err));
}
