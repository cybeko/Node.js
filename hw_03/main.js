const fs = require('fs');

class Participant {
    constructor(name) {
        this.name = name;
    }

    run() {
        return `${this.name} is running`;
    }

    jump() {
        return `${this.name} is jumping`;
    }

    canRun(distance) {
        return true; 
    }

    canJump(height) {
        return true;
    }
}

class Human extends Participant {
    canRun(distance) {
        return distance <= 100;
    }

    canJump(height) {
        return height <= 2;
    }
}

class Cat extends Participant {
    canRun(distance) {
        return distance <= 150;
    }

    canJump(height) {
        return height <= 4; 
    }
}

class Robot extends Participant {
    canRun(distance) {
        return distance <= 250; 
    }

    canJump(height) {
        return height <= 3; 
    }
}

class Obstacle {
    constructor(value) {
        this.value = value; 
    }

    overcome(participant) {
        return participant.canRun(this.value) || participant.canJump(this.value);
    }
}

class RunningTrack extends Obstacle {
    constructor(value) {
        super(value);
        this.type = 'RunningTrack';
    }

    overcome(participant) {
        return participant.canRun(this.value);
    }
}

class Wall extends Obstacle {
    constructor(value) {
        super(value);
        this.type = 'Wall';
    }

    overcome(participant) {
        return participant.canJump(this.value);
    }
}

function interact(participants, obstacles) {
    let results = '';

    participants.forEach(participant => {
        let succeeded = true;
        let totalDistance = 0;

        for (const obstacle of obstacles) {
            if (succeeded) {
                if (obstacle.type === 'RunningTrack' && obstacle.overcome(participant)) {
                    totalDistance += obstacle.value;
                } else if (!obstacle.overcome(participant)) {
                    succeeded = false;
                    results += `Participant ${participant.name} did not overcome obstacle \"${obstacle.type}\" with difficulty ${obstacle.value}. Total distance: ${totalDistance}\n`;
                    break;
                }
            }
        }

        if (succeeded) {
            results += `${participant.name} overcame all obstacles. Total distance: ${totalDistance}\n`;
        }
    });

    fs.writeFileSync('results.txt', results);
    console.log('Results written to results.txt');
}

const participants = [
    new Human('John Doe'),
    new Cat('Tara'),
    new Robot('Brandon')
];

const obstacles = [
    new RunningTrack(100),
    new Wall(2),
    new RunningTrack(150),
    new Wall(3),
    new RunningTrack(250),
];

interact(participants, obstacles);
