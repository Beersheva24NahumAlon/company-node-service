import { service } from "../service/company.mjs";
import protocolObj from "../protocol/protocol.mjs";
import http from "node:http";

const server = http.createServer();

function protocol(protocolObj) {
    //subscribing
    for (const eventName in protocolObj) {
        server.on(eventName, protocolObj[eventName]);
    }
}
protocol(protocolObj);

server.listen(3500);
const eventNames = server.eventNames();
server.on("request", async (req, res) => {
    let data = "";
    const eventName = req.url;
    if (!eventNames.includes(eventName)) {
        sendResponse(res, 404, `${eventName} dosn't exist`);
    } else {
        for await (const part of req) {
            data += part;
        }
        const { code, response } = await getResponse(data, eventName);
        sendResponse(res, code, response);
    }
});
function sendResponse(res, code, response) {
    res.statusCode = code;
    res.write(response);
    res.end();
}

async function getResponse(data, eventName) {
    return new Promise((resolve) => {
        server.on("response", (response) => {
            resolve(response);
        });
        server.emit(eventName, data, server, service);
    });
}