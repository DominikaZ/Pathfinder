// here are the helper functions

export function id(id) {
    return document.getElementById(id);
}

export function qs(selector) {
    return document.querySelector(selector);
}

export function qsa(selector) {
    return document.querySelectorAll(selector);
}


//so I dont have to use shift which is ineffective
export class Queue {
    constructor() {
        this.head = 0;
        this.tail = -1;
        this.q = [];
    }
    length() {
        return this.tail - this.head + 1;
    }
    enqueue(item) {
        this.q[++this.tail] = item;
    }
    deque() {
        let item = this.q[this.head];
        delete this.q[this.head++]; // will be undefined
        return item;
    }
}

export function setDelay() {
    setTimeout(function () {
    }, 1000);
}



export class PQItem {
    constructor(val, priority) {
        this.val = val;
        this.priority = priority;
    }
}

export class PQ {
    constructor() {
        this.items = new Queue();
    }

    length() {
        return this.items.length();
    }

    enqueue(element, priority) {
        var newPQItem = new PQItem(element, priority);
        var contain = false;

        // iterating through the entire 
        // item array to add element at the 
        // correct location of the Queue 
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > newPQItem.priority) {
                // Once the correct location is found it is 
                // enqueued 
                this.items.splice(i, 0, newPQItem);
                contain = true;
                break;
            }
        }

        // if the element have the highest priority 
        // it is added at the end of the queue 
        if (!contain) {
            this.items.push(newPQItem);
        }
    }
    dequeue() {
        // return the dequeued element 
        // and remove it. 
        // if the queue is empty 
        // returns Underflow
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }


}