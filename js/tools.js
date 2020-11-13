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
        this.priority = priority;   // 0 is the biggest priority
    }
}

export class PQ {
    constructor() {
        this.items = [];
    }

    size() {
        return this.items.length;
    }

    parentIndex(i) {
        if (i > 0) {
            return i - 1;
        }
        return -1;
    }

    leftIndex(i) {
        let idx = i * 2 + 1;
        if (idx < this.size()) {
            return idx;
        }
        return -1;
    }

    rightIndex(i) {
        let idx = i * 2 + 2;
        if (idx < this.size()) {
            return idx;
        }
        return -1;
    }

    parent(i) {
        let idx = this.parentIndex(i);
        if (idx !== -1) {
            return this.items[idx];
        }
        return null;
    }


    left(i) {
        let idx = this.leftIndex(i);
        if (idx !== -1) {
            return this.items[idx];
        }
        return null;
    }

    right(i) {
        let idx = this.rightIndex(i);
        if (idx !== -1) {
            return this.items[idx];
        }
        return null;
    }

    swap(i, j) {
        [this.items[i], this.items[j]] = [this.items[j], this.items[i]];
    }

    enqueue(element, priority) {
        let newPQItem = new PQItem(element, priority);
        this.items.push(newPQItem);
        let i = this.size() - 1;
        let p = this.parent(i);
        console.log(p);
        while (this.parent(i) != null && this.parent(i).priority > this.items[i]) {
            this.swap(i, this.parentIndex(i));
            i = this.parentIndex(i);
        }
    }

    dequeue() {
        if (this.size() < 1) {
            return null;
        }

        this.swap(this.size() - 1, 0);
        let deleted = this.items.pop();
        this.heapify(0);
        return deleted;
    }

    //checks if heap is ok, if not, repairs it, logn operations max
    heapify(i) {
        let l = this.left(i);
        let r = this.right(i);
        let biggestPriorityI = i;

        if (l != null && this.items[biggestPriorityI] > l.priority) {
            biggestPriorityI = this.leftIndex(i);
        }
        if (r != null && this.items[biggestPriorityI] > r.priority) {
            biggestPriorityI = this.leftIndex(i);
        }
        if (biggestPriorityI != i) {
            swap(i, biggestPriorityI);
            this.heapify(biggestPriorityI);
        }
    }


}
