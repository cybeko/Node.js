function Journal(...students) {
    this.entries = students;
    
    this.print = () => {
        console.log('Students list:');
        this.entries.forEach(entry => entry.print());
    };

    this.addStudent = (newStudent) => {
        this.entries.push(newStudent);
    };

    this.deleteStudentByName = (name, last_name) => {
        this.entries = this.entries.filter(entry => !(entry.name === name && entry.last_name === last_name));
    };

    this.updateStudentByName = (name, last_name, newName, newLastName, newAge) => {
        const student = this.entries.find(entry => entry.name === name && entry.last_name === last_name);
        if (student) {
            student.name = newName;
            student.last_name = newLastName;
            student.age = newAge;
        } else {
            console.log(`Student "${name} ${last_name}" not found.`);
        }
    };
}

exports.Journal = Journal;
