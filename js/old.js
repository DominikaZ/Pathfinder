function bfs1() {
    let queue = new tools.Queue();
    queue.enqueue(start);
    console.log(start);
    start.distance = 0;
    console.log(start);
    let i = 1;

    let bfsInterval = setInterval(function () {
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

        if (queue.length() <= 0) {
            clearInterval(bfsInterval);
        }

    }, 1);

}