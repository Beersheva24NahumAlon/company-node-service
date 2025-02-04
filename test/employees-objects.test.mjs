import { describe, it, expect } from "vitest";
import Employee from "../src/dto/Employee.mjs";
import WageEmployee from "../src/dto/WageEmployee.mjs";
import Manager from "../src/dto/Manager.mjs";
import SalesPerson from "../src/dto/SalesPerson.mjs";


const basicSalary = 10000;
const department = "dep1";
const id = 1;
const wage = 50;
const hours = 5;
const sales = 200;
const percent = 0.1;
const factor = 1.6;
const employee = new Employee(id, department, basicSalary);
const wageEmployee = new WageEmployee(id, department, basicSalary, wage, hours);
const salesPerson = new SalesPerson(id, department, basicSalary, wage, hours, percent, sales);
const manager = new Manager(id, department, basicSalary, factor);
describe("constructors, getters and computeSalary tests", () => {
    it("employee test", () => {
        expect(employee.getBasicSalary()).toBe(basicSalary);
        expect(employee.computeSalary()).toBe(basicSalary);
        expect(employee.getDepartment()).toBe(department);
        expect(employee.getId()).toBe(id);
    });
    it("wage employee test", () => {
        expect(wageEmployee.getWage()).toBe(wage);
        expect(wageEmployee.computeSalary()).toBe(basicSalary + wage * hours);
        expect(wageEmployee.getHours()).toBe(hours);
    });
    it("sales person test", () => {
        expect(salesPerson.getPercent()).toBe(percent);
        expect(salesPerson.computeSalary()).toBe(basicSalary + wage * hours + sales * percent / 100);
        expect(salesPerson.getSales()).toBe(sales);
    });
    it("manager test", () => {
        expect(manager.getFactor()).toBe(factor);
        expect(manager.computeSalary()).toBe(basicSalary * factor);
    });
    it("polymorphism test", () => {
        const employees = [employee, wageEmployee, salesPerson, wageEmployee];
        const budget = employees.reduce((sum, o) => sum + o.computeSalary(), 0);
        const expectedBudget = employee.computeSalary() + wageEmployee.computeSalary() + salesPerson.computeSalary() + wageEmployee.computeSalary();
        expect(budget).toBe(expectedBudget);
    });
    it("setPrototype", () => {
        const obj1 = {basicSalary: 12000};
        Object.setPrototypeOf(obj1, Employee.prototype);
        expect(obj1.computeSalary()).toBe(12000);
        const obj2 = {basicSalary: 12000, factor: 2};
        Object.setPrototypeOf(obj2, Manager.prototype);
        expect(obj2.computeSalary()).toBe(24000);
    });
});
describe("object to JSON and object to JSON", () => {
    it("Employees to JSON", () => {
        expect(JSON.stringify(employee).indexOf("Employee")).toBeGreaterThan(-1);
        expect(JSON.stringify(wageEmployee).indexOf("WageEmployee")).toBeGreaterThan(-1);
        expect(JSON.stringify(salesPerson).indexOf("SalesPerson")).toBeGreaterThan(-1);
        expect(JSON.stringify(manager).indexOf("Manager")).toBeGreaterThan(-1);
    });
    it("JSON to Employee", () => {
        const employee2 = Employee.fromJSON(JSON.stringify(employee));
        expect(employee2.computeSalary()).toBe(employee.computeSalary());
        const wageEmployee2 = Employee.fromJSON(JSON.stringify(wageEmployee));
        expect(wageEmployee2.computeSalary()).toBe(wageEmployee.computeSalary());
        const salesPerson2 = Employee.fromJSON(JSON.stringify(salesPerson));
        expect(salesPerson2.computeSalary()).toBe(salesPerson.computeSalary());
        const manager2 = Employee.fromJSON(JSON.stringify(manager));
        expect(manager2.computeSalary()).toBe(manager.computeSalary());
    });
});