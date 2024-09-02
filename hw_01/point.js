function Point(x, y) {
    this.x = x;
    this.y = y;
    this.print = () => {
      console.log('X = ' + this.x + ' Y = ' + this.y);
    };
  }
  
function isParallel(A, B) {
    if (A.y === B.y) {
        console.log('Parallel to x-axis');
    } else if (A.x === B.x) {
        console.log('Parallel to y-axis');
    } else {
        console.log('Not parallel to any'); 
    }
}

module.exports = {
    Point: Point,
    isParallel: isParallel
};
