import { describe, it, expect } from "vitest";
import Employee from "../src/dto/Employee.mjs";
import WageEmployee from "../src/dto/WageEmployee.mjs";
import SalesPerson from "../src/dto/SalesPerson.mjs";
import Manager from "../src/dto/Manager.mjs";
import Company from "../src/service/company.mjs";

const ID1 = 123;
const SALARY1 = 1000;
const DEPARTMENT1 = "QA";
const ID2 = 120;
const SALARY2 = 2000;
const ID3 = 125;
const SALARY3 = 3000;
const DEPARTMENT2 = "Development";
const ID4 = 200;
const DEPARTMENT4 = "Audit";
const WAGE1 = 100;
const HOURS1 = 10;
const FACTOR1 = 2;
const PERCENT1 = 0.01;
const SALES1 = 10000;
const FACTOR2 = 2.5;
const ID5 = 300;
const FACTOR3 = 3;
const ID6 = 400;
const ID7 = 500;
const empl1 = new WageEmployee(ID1, DEPARTMENT1, SALARY1, WAGE1, HOURS1);
const empl2 = new Manager(ID2, DEPARTMENT1, SALARY2, FACTOR1);
const empl3 = new SalesPerson(ID3, DEPARTMENT2, SALARY3, WAGE1, HOURS1, PERCENT1, SALES1);
const company = new Company();
for (const empl of [empl1, empl2, empl3]) {
    await company.addEmployee(empl);
}
describe("company", () => {
    it("addEmployee test", async () => {
        const empl = new Employee(ID4, DEPARTMENT1, SALARY1);
        company.addEmployee(empl);
        await expect(() => company.addEmployee(empl)).rejects.toThrowError(new Error("The employee with this id is already exists in th company"));
    });
    it ("getEmployee test", async () => {
        expect(await company.getEmployee(ID1)).toEqual(empl1);
        expect(await company.getEmployee(ID6)).toBeUndefined();
    });
    it("removeEmployee test", async () => {
        expect(await company.removeEmployee(ID1)).toEqual(empl1);
        await expect(() => company.removeEmployee(ID1)).rejects.toThrowError(new Error("The employee with this id doesn't exist in the company"));
    });
    it("getDepartmentBudget test", async () => {
        expect(await company.getDepartmentBudget(DEPARTMENT1)).toBe(SALARY2 * FACTOR1 + SALARY1);
        expect(await company.getDepartmentBudget(DEPARTMENT2)).toBe(SALARY3 + WAGE1 * HOURS1 + PERCENT1 * SALES1 / 100);
        expect(await company.getDepartmentBudget(DEPARTMENT4)).toBe(0);
    });
    it("getDepartments test", async () => {
        expect((await company.getDepartments()).sort()).toEqual([DEPARTMENT1, DEPARTMENT2].sort());
    });
    it("getManagersWithMostFactor", async () => {
        const manager1 = new Manager(ID5, DEPARTMENT1, SALARY2, FACTOR2);
        const manager2 = new Manager(ID6, DEPARTMENT4, SALARY3, FACTOR2);
        company.addEmployee(manager1);
        company.addEmployee(manager2);
        expect((await company.getManagersWithMostFactor()).sort((e1, e2) => e1.getId() - e2.getId()))
                .toEqual([manager2, manager1].sort((e1, e2) => e1.getId() - e2.getId()));
    });
    it("saveToFile and restoreFromFile test", async () => {
        const fileName = "company.txt";
        await company.saveToFile(fileName);
        const oldCompany = company;
        await company.eraseCompany();
        await company.restoreFromFile(fileName);
        expect(await company.getEmployee(ID2)).toEqual(empl2);
        expect(await company.getEmployee(ID7)).toBeUndefined();
        expect(company).toEqual(oldCompany);
    });
});