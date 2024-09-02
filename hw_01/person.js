function Person(name, last_name, age, sex) {
    this.name = name;
    this.last_name = last_name;
    this.age = age;
    this.sex = sex;
  
    this.print = () => {
      console.log(`Name: ${this.name}; Last Name: ${this.last_name}; Age: ${this.age}; Sex: ${this.sex};`);
    };
  }
  
  exports.Person = Person;
  