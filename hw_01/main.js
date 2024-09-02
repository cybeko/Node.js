//1
var point = require('./point');

var pointA = new point.Point(8, 5);
var pointB = new point.Point(1, 5);

pointA.print();
pointB.print();

point.isParallel(pointA, pointB);


//2 

var person = require('./person')

var John = new person.Person("John","Doe", 25,"M");
John.print();

//3

var fraction = require('./fraction')
var A = new fraction.Fraction(3, 6);
var B = new fraction.Fraction(2, 4);

A.print();
B.print();


var res = fraction.sum(A, B);
res.print();

res = fraction.extr(A, B);
res.print();

res = fraction.mult(A, B);
res.print(); 

res = fraction.div(A, B);
res.print(); 

//4
var student = require('./student');
var Student1 = new student.Student('John', 'Doe', 19);
var Student2 = new student.Student('Jane', 'Doe', 18);

var journal = require('./journal');
var newJournal = new journal.Journal(Student1, Student2);
newJournal.print(); 

newJournal.deleteStudentByName('John', 'Doe');
newJournal.print(); 

newJournal.updateStudentByName('Jared', 'Bright', 'Janet', 'Doe', 18);
newJournal.updateStudentByName('Jane', 'Doe', 'Janet', 'Doe', 19);
newJournal.print();

