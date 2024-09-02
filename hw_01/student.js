function Student(name, last_name, age) {
    this.name = name;
    this.last_name = last_name;
    this.age = age;

    this.print = () => {
        console.log(`Name: ${this.name}; Last Name: ${this.last_name}; Age: ${this.age};`);
    };
}

exports.Student = Student;
