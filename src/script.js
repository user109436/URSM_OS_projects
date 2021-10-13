
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
class Philosopher{
    constructor(name, left, right) {
        this.name = name;
        this.left = left;
        this.right = right;
        this.eating = 0;
        this.ate = 0;
        this.plate = 0;
    }
    eat = async (ms=3000) => {
        this.eating = 1;
        await sleep(ms);
        // add animation when fork is grab
        // fork-this.left //get this element
        new ForkElement(this.left);
        new Log(this.name, `get left fork ${this.left} <i class="fas fa-utensil-spoon"></i>`).logActvityElement();
        await sleep(ms);
        new ForkElement(this.right);
        new Log(this.name, `get right fork ${this.right} <i class="fas fa-utensil-spoon"></i>`).logActvityElement();
        await sleep(ms);
        // add yellow border on plates when philosopher is eating
        new PlateElement(this.plate);
        new Log(this.name, `is eating <i class="fas fa-utensils"></i> <i class="fas fa-cookie-bite"></i>`).logActvityElement();
        await sleep(ms);
        // remove animation when fork is relased
        // add Border green when philosopher is done eating
        new ForkElement(this.left);
        new ForkElement(this.right);
        new Log(this.name, `is done eating <i class="far fa-laugh-beam"></i>`).logActvityElement('text-green-500');
        this.eating = 0;

    }
}
class Table{
    constructor(philosophers=[], randomEat=1){
        this.numPhilosophers = philosophers.length;
        this.philosophersName = philosophers//fetch from api with limit
        this.philosophers = [];
        this.random = [];
        this.completed = 0;
        this.randomEat = randomEat;
        for (let i = 0; i < this.numPhilosophers; i++){
            this.setPersonForks(i);
        }
        this.randomOrder();
        this.getEatOrder();
        this.diningStart();
    }
     setPersonForks = (i) => {
         this.philosophers.push(new Philosopher(this.philosophersName[i], i, (i + 1) % this.numPhilosophers));
    }
    diningStart = async (ms=3000) => {//even and odd solution
            do {
                for (let i = 0; i < this.numPhilosophers; i++) {
                    if (this.philosophers[this.random[i]].ate==1) {
                        continue;
                    }
                    // check if left and right neighbor is eating before eat
                    let neighbor = this.getNeighbor(this.random[i]);
                    if (this.isNeighborEating(neighbor)) {
                        new Log(this.philosophers[this.random[i]].name, `is waiting <i class="fas fa-brain"></i>`).logActvityElement("text-gray-500");
                    } else {
                        let philosopher = this.philosophers[this.random[i]];
                        if (!philosopher.ate) {
                            philosopher.plate = this.random[i];//identify philosphers plate given the position on the table
                            philosopher.eat();
                            philosopher.ate = 1;
                            this.completed++;
                        }
                    }
                    await sleep(ms);
                }
                
            } while (this.completed!=this.numPhilosophers);
    }
    zeroIndex = (i, length) => {
        if (i == 0) {
            return length - 1;
        }
        return i-1;
    }
    getNeighbor = (i) => {
         let neighbor = {
                left: this.zeroIndex(i, this.numPhilosophers),
                right: (i+1) % this.numPhilosophers
        }
        return neighbor;
    }

    randomOrder = () => {
        for (let i = 0; i < this.numPhilosophers;i++){
            this.random.push(i);
        }
        if (!this.randomEat) {
            return this.random;
        }
        return this.random = this.random.sort(() => 0.5 - Math.random());
    }
    getEatOrder = () => {
        new Log(`Philosophers`, " Eat Order").logHeadingElement();
        let x = 0;
        for (let i of this.random) {
            // replace avatar with the actual philosophers Image
            let philosophersImgContainer = document.getElementsByClassName('philosophers-img-container');
            let img = philosophersImgContainer[i].children[0];
            let imgPath = img.src;
             let srcIndex = imgPath.indexOf("/img");
            imgPath= imgPath.substring(0, srcIndex);
            img.src = `${imgPath}/img/${this.philosophers[i].name}.png`;
            // log eat order of philosophers
            new Log(`${this.philosophers[i].name}`).logActvityElement();
            x++;
        }
        new Log(``, " Dining Start").logHeadingElement();

    }
    isNeighborEating = (neighbor) => {
        return this.philosophers[neighbor.left].eating || this.philosophers[neighbor.right].eating;
    }
}

class Log {
    constructor(name="", activity="") {
        this.name = name;
        this.activity = activity;
    }

    logActvityElement = (textColor="text-white") => {
        let el= `
         <div
                class="
                  person-log-container
                  flex
                  h-14
                  border-b border-gray-700
                  p-2
                "
              >
                <div class="person-img object-cover">
                  <img src="/img/${this.name}.png" class="h-full rounded-full" alt="" />
                </div>
                <div class="person-activity self-center p-2 ${textColor}">
                  ${this.name} ${this.activity}
                </div>
        </div>
        `;
        this.appendLog(el);
        return 1;
    }
    logHeadingElement = () => {
        let el= `
          <div
                class="
                  person-log-container
                  flex
                  h-12
                  border-b border-gray-700
                  p-2
                  text-green-500
                  items-center
                  uppercase
                "
              >
                ${this.name} ${this.activity}
              </div>
        `;
        this.appendLog(el);
        return 1;
    }
    appendLog = (el) => {
        let logContent = document.querySelectorAll('.log-content')[0];
        let log = document.createRange().createContextualFragment(el);
        logContent.insertBefore(log, logContent.lastElementChild.nextSibling);
        return 1;

    }
}

class ForkElement{
    constructor(fork) {
        this.animateForkElement(fork);
    }
    animateForkElement=(fork)=>{
        let philosopherFork = document.getElementsByClassName(`fork-${fork}`)[0];
        if (philosopherFork.classList.contains('scale-150') || philosopherFork.classList.contains('rotate-180')) {
            philosopherFork.classList.remove('scale-150');
            philosopherFork.classList.remove('rotate-180');
        } else {
            philosopherFork.classList.add('scale-150');
             philosopherFork.classList.add('rotate-180');
        }
    }
}
class PlateElement{
    constructor(plate, borderColor="border-yellow-800") {
        this.animatePlateElement(plate, borderColor);
    }
    animatePlateElement=(plate, borderColor)=>{
        let philosopherPlate = document.getElementsByClassName(`dish-${plate}`)[0];
        if (philosopherPlate.classList.contains(borderColor)) {
            philosopherPlate.classList.remove(borderColor);
        } else {
            philosopherPlate.classList.add(borderColor);
            let img = philosopherPlate.children[0]// replace image with empty plate
            let imgIndex = img.src.indexOf('/img');
            let path = img.src.substring(0, imgIndex);
            img.src = `${path}/img/food/${plate}-empty.png`;
        }
    }
}




let randomLabel = document.getElementById('random');
let startBtn = document.getElementsByClassName('start-btn')[0];
let random = true;
randomLabel.addEventListener('click', () => {
    if (randomLabel.checked) {
        random = true;
    } else {
        random = false;
    }
});
startBtn.addEventListener('click', () => {
    resetPlateElements();
    new Table(
    ['Reterta', 'De Guzman', 'Anselmo', 'Berongoy', 'Felix'], random
    );

});

resetPlateElements = () => {//find fix for dynamic input reset colors
    let dishes = document.getElementsByClassName('dishes');
    let x = 1;
    for (dish of dishes) {
        dish.classList.remove('border-yellow-800');
        let img = dish.children[0];
        let imgIndex = img.src.indexOf('/img');
        let path = img.src.substring(0, imgIndex);
        img.src = `${path}/img/food/${x}.png`;
        x++;
    }
}





