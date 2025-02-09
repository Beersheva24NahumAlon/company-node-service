import Employee from "../dto/Employee.mjs";

const protocolObj = {
    "/addEmployee": addEmployee,
    "/getEmployee": getEmployee,
    "/removeEmployee": removeEmployee,
    "/getDepartmentBudget": getDepartmentBudget,
    "/getDepartments": getDepartments,
    "/getManagersWithMostFactor": getManagersWithMostFactor
}

function createResponse(code, response) {
    return { code, response };
}

async function getManagersWithMostFactor(data, server, service) {
    const managers = await service.getManagersWithMostFactor();
    server.emit("response", createResponse(200, JSON.stringify(managers.map(m => JSON.stringify(m)))));
}

async function getDepartments(data, server, service) {
    const departments = await service.getDepartments();
    server.emit("response", createResponse(200, JSON.stringify(departments)));
}

async function getDepartmentBudget(data, server, service) {
    const budget = await service.getDepartmentBudget(data);
    server.emit("response", createResponse(200, budget + ""));
}

async function removeEmployee(data, server, service) {
    try {
        const empl = await service.removeEmployee(data);
        server.emit("response", createResponse(200, JSON.stringify(empl)));
    } catch (error) {
        server.emit("response", createResponse(404, error))
    }
}

async function addEmployee(data, server, service) {
    try {
        await service.addEmployee(Employee.fromJSON(data));
        server.emit("response", createResponse(204, ""));
    } catch (error) {
        server.emit("response", createResponse(400, error))
    }
}

async function getEmployee(data, server, service) {
    try {
        const empl = await service.getEmployee(data);
        server.emit("response", createResponse(200, JSON.stringify(empl)));
    } catch (error) {
        server.emit("response", createResponse(404, error))
    }
}

export default protocolObj;