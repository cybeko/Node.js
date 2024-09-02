function Fraction (num, denom)
{
    this.num=num; 
    this.denom = denom !== 0 ? denom : 1;
    this.print = ()=> {
        if (this.denom === 0) {
            console.log("Denominator cannot be zero");
        } 
        else {
            console.log(`${this.num}/${this.denom}`); 
        }
    }
    this.simplify = () => {
        function gcd(a, b) {
            while (b !== 0) {
                let temp = b;
                b = a % b;
                a = temp;
            }
            return a;
        }
        const divisor = gcd(this.num, this.denom);
        this.num /= divisor;
        this.denom /= divisor;
    }
}

function sum(A, B) {
    const num = A.num * B.denom + B.num * A.denom;
    const denom = A.denom * B.denom;
    const res = new Fraction(num, denom);
    res.simplify();
    return res;
}

function extr(A, B) {
    const num = A.num * B.denom - B.num * A.denom;
    const denom = A.denom * B.denom;
    const res = new Fraction(num, denom);
    res.simplify();
    return res;
}

function mult(A, B) {
    const num = A.num * B.num;
    const denom = A.denom * B.denom;
    const res = new Fraction(num, denom);
    res.simplify();
    return res;
}

function div(A, B) {
    const num = A.num * B.denom;
    const denom = A.denom * B.num;
    const res = new Fraction(num, denom);
    res.simplify();
    return res;
}

module.exports = {
    Fraction: Fraction,
    sum: sum,
    extr: extr,
    mult: mult,
    div: div
};
