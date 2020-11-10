// @ts-check
import * as tools from './tools.js';

var canvas = tools.id('canvas');  //find canvas
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 60;
let ctx = canvas.getContext("2d");        // methods for drawing let fps = 50;

//var cols = 40;
//var rows = 20;
var cols = 5;
var rows = 5;
var w = canvas.width / cols; // width of one node
var h = canvas.height / rows; // height of one node
var start;
var end;
let grid = new Array();
let diagonal = true;

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

    restart() {
        this.visited = Color.W;
        this.distance = Number.POSITIVE_INFINITY;
        this.predecessor = null;
    }

    findNeighbours() {
        // only pairs of coordinates, not objects (less space)
        // diagonals are going last
        if (this.y > 0) {
            this.neighbours.push([this.x, this.y - 1]); //up
        }
        if (this.x < cols - 1) {
            this.neighbours.push([this.x + 1, this.y]); //right
        }
        if (this.y < rows - 1) {
            this.neighbours.push([this.x, this.y + 1]); //down
        }
        if (this.x > 0) {
            this.neighbours.push([this.x - 1, this.y]); //left
        }

        if (diagonal) {
            if (this.y > 0 && this.x < cols - 1) {
                this.neighbours.push([this.x + 1, this.y - 1]); // diagonal right up
            }
            if (this.x < cols - 1 && this.y < rows - 1) {
                this.neighbours.push([this.x + 1, this.y + 1]); // diagonal right down
            }
            if (this.x > 0 && this.y < rows - 1) {
                this.neighbours.push([this.x - 1, this.y + 1]); // diagonal left down
            }
            if (this.x > 0 && this.y > 0) {
                this.neighbours.push([this.x - 1, this.y - 1]); //diagonal left up
            }
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

    async wait() {
        if (fps === 0) {
            return;
        }
        return new Promise(resolve => {
            setTimeout(resolve, fps);
        });
    }

    async animate(color) {
        ctx.beginPath();
        ctx.strokeStyle = "#1bafee";
        ctx.fillStyle = color;
        ctx.rect(this.x * w, this.y * h, w, h);
        ctx.stroke();
        await this.wait();
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
    end = grid[0][3];

    start.show("yellow");
    end.show("yellow");
}


function restart() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].restart();
        }
    }
}


async function findPath() {
    let current = end;
    while (current != start) {
        await current.animate("yellow");
        current = current.predecessor;
    }
    await current.animate("yellow");
}

// ALGORYTMY

async function bfs() {
    let queue = new tools.Queue();
    queue.enqueue(start);
    start.distance = 0;

    while (queue.length() > 0) {
        let current = queue.deque();
        if (current === end) {
            break;
        }

        for (const nCoordinates of current.neighbours) {
            let neighbour = grid[nCoordinates[0]][nCoordinates[1]];
            if (neighbour.visited == Color.W) {     // found new
                await neighbour.animate("blue");
                neighbour.visited = Color.G;
                neighbour.distance = current.distance + 1;
                neighbour.predecessor = current;
                queue.enqueue(neighbour);
            }
        }

        current.visited = Color.B;
        await current.animate("red");
    }
    await findPath();
}


// for maze discovery
// async function dfsAll() {
//     for (let i = 0; i < cols; i++) {
//         for (let j = 0; j < rows; j++) {
//             if (grid[i][j] == end) {
//                 await findPath();
//                 break;
//             }
//             await dfsRec(grid[i][j]);
//         }
//     }
// }


async function dfs(current) {
    current.visited = Color.G;
    await current.animate("blue");
    if (current === end) {
        findPath();
    }
    for (const nCoordinates of current.neighbours) {
        let neighbour = grid[nCoordinates[0]][nCoordinates[1]];
        if (neighbour.visited == Color.W) {
            neighbour.predecessor = current;
            await dfs(neighbour);
            if (end.visited == Color.G) {
                return;
            }
        };
    }
    current.visited = Color.B;
    await current.animate("red");
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
//bfs();
dfs(start);
findPath();
//djikstra();