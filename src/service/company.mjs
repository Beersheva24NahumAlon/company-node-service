import Employee from "../dto/Employee.mjs";
import Manager from "../dto/Manager.mjs";
import { readFile, writeFile } from "node:fs/promises";
import { EMPLOYEE_ALREADY_EXISTS, EMPLOYEE_DOES_NOT_EXIST, INVALID_EMPLOYEE_TYPE } from "../exceptions/exceptions.mjs";

export class Company {
    #employees; 
    #departments; 
    #stateChanged 

    constructor() {
        this.#employees = {};
        this.#departments = {};
        this.#stateChanged = false;
    }

    async addEmployee(empl) {
        if (!(empl instanceof Employee)) {
            throw INVALID_EMPLOYEE_TYPE(empl);
        }
        const id = empl.getId();
        if (this.#employees[id] != undefined) {
            throw EMPLOYEE_ALREADY_EXISTS(id);
        }
        this.#employees[id] = empl;
        this.#addEmployeeToDepartment(empl);
        this.#stateChanged = true;
    }

    #addEmployeeToDepartment(empl) {
        const department = empl.getDepartment();
        const array = this.#departments[department] ?? [];
        array.push(empl);
        this.#departments[department] = array;
    }

    async getEmployee(id) {
        const empl = this.#employees[id];
        if (empl == undefined) {
            throw EMPLOYEE_DOES_NOT_EXIST(id);
        }
        return empl;
    }

    async removeEmployee(id) {
        const empl = this.#employees[id];
        if (empl == undefined) {
            throw EMPLOYEE_DOES_NOT_EXIST(id);
        }
        this.#removeEmployeeFromDepartment(empl);
        delete this.#employees[id];
        this.#stateChanged = true;
        return empl;
    }

    #removeEmployeeFromDepartment(empl) {
        const department = empl.getDepartment();
        const array = this.#departments[department];
        const index = array.findIndex(e => e.getId() == empl.getId());
        if (index > -1) {
            array.splice(index, 1);
            if (array.length == 0) {
                delete this.#departments[department];
            } else {
                this.#departments[department] = array;
            }
        }
    }

    async getDepartmentBudget(department) {
        let res = 0;
        const array = this.#departments[department];
        if (array != undefined) {
            res = array.reduce((budget, empl) => budget + empl.computeSalary(), 0);
        }
        return res;
    }

    async getDepartments() {
        return Object.keys(this.#departments);
    }

    async getManagersWithMostFactor() {
        const res = [];
        const managers = this.#getManagers();
        if (managers.length > 0) {
            managers.sort((empl1, empl2) => (empl2.getFactor() - empl1.getFactor()));
            let i = 0;
            const mostFactor = managers[0].getFactor();
            while (i < managers.length && managers[i].getFactor() == mostFactor) {
                res.push(managers[i++]);
            }
        }
        return res;
    }

    #getManagers() {
        return Object.values(this.#employees).filter((empl) => empl instanceof Manager);
    }

    async saveToFile(fileName) {
        const strings = [];
        Object.values(this.#employees).forEach((empl) => strings.push(JSON.stringify(empl)));
        await writeFile(fileName, strings.join("\n"), "utf-8");
        this.#stateChanged = false;
    }

    async restoreFromFile(fileName) {
        const text = await readFile(fileName, "utf-8");
        const strings = text.split("\n");
        strings.forEach((s) => this.addEmployee(Employee.fromJSON(s)));
    }

    setIterable(predicateFunc = () => true) {
        const company = this;
        this[Symbol.asyncIterator] = async function* () {
            for (let empl of Object.values(company.#employees)) {
                if (predicateFunc(empl)) {
                    yield empl;
                }
            }
        };
    }
}
export const service = new Company();