// @ts-check
import * as tools from './tools.js';

var canvas = tools.id('canvas');  //find canvas
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 60;
let ctx = canvas.getContext("2d");        // methods for drawing
let speed = 0;


var cols = 40;
var rows = 20;
var w = canvas.width / cols; // width of one node
var h = canvas.height / rows; // height of one node
var start;
var end;
let grid = new Array();

const Color = {
    W: -1,      // not seen
    G: 0,       // seen
    B: 1        //ended
};

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visited = Color.W;
        this.distance = Number.POSITIVE_INFINITY;

        this.neighbours = [];   // array of nodes
        this.findNeighbours();
        this.predecessor = null;
    }

    findNeighbours() {
        // giving there only pairs of coordinates, not objects = Nodes, so I dont have to go through grid again and also it is less space
        if (this.y > 0) {
            this.neighbours.push([this.x, this.y - 1]);
        }
        if (this.y > 0 && this.x < cols - 1) {
            this.neighbours.push([this.x + 1, this.y - 1]);
        }
        if (this.x < cols - 1) {
            this.neighbours.push([this.x + 1, this.y]);
        }
        if (this.x < cols - 1 && this.y < rows - 1) {
            this.neighbours.push([this.x + 1, this.y + 1]);
        }
        if (this.y < rows - 1) {
            this.neighbours.push([this.x, this.y + 1]);
        }
        if (this.x > 0 && this.y < rows - 1) {
            this.neighbours.push([this.x - 1, this.y + 1]);
        }
        if (this.x > 0) {
            this.neighbours.push([this.x - 1, this.y]);
        }
        if (this.x > 0 && this.y > 0) {
            this.neighbours.push([this.x - 1, this.y - 1]);
        }
    }

    show(color) {
        //nakresli sa stvorcek
        ctx.beginPath();
        ctx.strokeStyle = "#1bafee";
        ctx.fillStyle = color;
        ctx.rect(this.x * w, this.y * h, w, h);
        ctx.stroke();
        ctx.fill();
    }
}

function init() {
    //2d array to store Nodes
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new Node(i, j);
            grid[i][j].show("#fff");
        }
    }

    start = grid[0][0];
    end = grid[cols - 1][rows - 1];

    start.show("yellow");
    end.show("yellow");
}

function findPath() {
    let current = end;
    while (current != start) {
        current.show("yellow");
        current = current.predecessor;
    }
}

// ALGORYTMY

function bfs(instant) {
    let queue = new tools.Queue();
    queue.enqueue(start);
    start.distance = 0;

    if (!instant) {
        bfsInterval(queue);
    } else {
        while (queue.length() > 0) {
            let current = queue.deque();
            for (const nCoordinates of current.neighbours) {
                let neighbour = grid[nCoordinates[0]][nCoordinates[1]];
                if (neighbour.visited == Color.W) {     // novy
                    neighbour.show("blue");
                    neighbour.visited = Color.G;
                    neighbour.distance = current.distance + 1;
                    neighbour.predecessor = current;
                    queue.enqueue(neighbour);
                }
            }

            current.visited = Color.B;
            current.show("red");
        }
        findPath();
    }
}

function bfsInterval(queue) {
    let current = queue.deque();
    for (const nCoordinates of current.neighbours) {
        let neighbour = grid[nCoordinates[0]][nCoordinates[1]];
        if (neighbour.visited == Color.W) {     // novy
            neighbour.show("blue");
            neighbour.visited = Color.G;
            neighbour.distance = current.distance + 1;
            neighbour.predecessor = current;
            queue.enqueue(neighbour);
        }
    }

    current.visited = Color.B;
    current.show("red");
    if (queue.length() > 0) {
        const fps = 1000;       // control speed
        setTimeout(() => {
            requestAnimationFrame(function () {
                bfsInterval(queue);
            })

        }, 1000 / fps);
    } else {
        findPath();
    }
}


function dfs(instant) {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j].visited == Color.W) {
                if (instant) {
                    dfsRec(grid[i][j]);
                } else {
                    setTimeout(() => {
                        requestAnimationFrame(function () {
                            dfsRec(grid[i][j]);
                        })

                    }, 1000 / 25);
                }
            }
        }
    }
    findPath();
}

function dfsRec(current) {
    current.visited = Color.G;
    current.show("blue");
    for (const nCoordinates of current.neighbours) {
        let neighbour = grid[nCoordinates[0]][nCoordinates[1]];
        if (neighbour.visited == Color.W) {
            neighbour.predecessor = current;
            dfsRec(neighbour);
        }
    }
    current.visited = Color.B;
    current.show("red");
}

function dfsInterval(current) {
    current.visited = Color.G;
    current.show("blue");
    for (const nCoordinates of current.neighbours) {
        let neighbour = grid[nCoordinates[0]][nCoordinates[1]];
        if (neighbour.visited == Color.W) {
            neighbour.predecessor = current;
            setTimeout(() => {
                requestAnimationFrame(function () {
                    dfsInterval(neighbour);
                })

            }, 1000 / 25);
        }
    }
    current.visited = Color.B;
    current.show("red");
}


function djikstra() {
    start.distance = 0;
    let pq = new tools.PQ();
    pq.enqueue(start, start.distance);
    start.visited = Color.G;

    while (pq.length() > 0) {
        let pnode = pq.dequeue();     // I choose node with highest priority
        let current = pnode.val;
        current.visited = Color.B;
        for (const nCoordinates of current.neighbours) {
            let neighbour = grid[nCoordinates[0]][nCoordinates[1]];
            if (neighbour.color != Color.B && (neighbour.distance > current.distance + 1)) {  // not seen or seen but can be relaxed and not finished
                neighbour.predecessor = current;
                neighbour.distance = current.distance + 1;
                pq.enqueue(neighbour, neighbour.distance);
            }
        }
    }
    findPath();
}







//render();
init();
//bfs(false);
//dfs(false);
djikstra();