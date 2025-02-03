export default class Employee {
    static classMap = { Employee: new Employee() };

    static fromJSON(jsonStr) {
        const object = JSON.parse(jsonStr);
        Object.setPrototypeOf(object, this.classMap[object.className]);
        return object;
    }

    constructor(id = 0, department = null, basicSalary = 0) {
        this.id = id;
        this.department = department;
        this.basicSalary = basicSalary;
        this.className = this.constructor.name;
    }

    computeSalary() {
        return this.getBasicSalary();
    }

    getId() {
        return this.id;
    }

    getDepartment() {
        return this.department;
    }

    getBasicSalary() {
        return this.basicSalary;
    }
}