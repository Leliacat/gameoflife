window.onload = function(){

    const canvas = document.getElementById('canvas');
    const btn_play = document.getElementById('btn_play');
    const btn_stop = document.getElementById('btn_stop');
    const btn_init = document.getElementById('btn_init');

    //************************************************** variables **************************************************** */

    let cellSize = 15;
    let colsNb = canvas.width/cellSize;
    let rowsNb = canvas.height/cellSize;
    // to have a pattern of the state of each cells in the grid at a given point 
    let currentGrid ;
    // and a pattern of how those cells will be at the next step
    // will contain cells with following values: 0 (if dead cell) or 1 (if alive cell);

    // make the context of the canvas accessible in every function
    const ctx = canvas.getContext('2d'); // get the canvas context 

    // int representing the number of alive cells around one cell
    let aliveNeighboursNb;

    // handle the interval at which the frame is refreshed
    // (time between currentGrid & nextGrid)
    let delay;
    let timeOut;
    //************************************************** functions *************************************************** */

    // create an empty 2D array (with the same number of cells as the grid on canvas) 
    // to store the state of each cell
    const make2DArray = () => {
        let grid = new Array(rowsNb);
        for (let i = 0; i < rowsNb; i ++){
            grid[i] = new Array(colsNb);
        }
        // console.log(grid);
        return grid;
    }

    // draw the initial grid, and fill it with a random composition of alive and dead cells
    const init = () => {
        for (let i = 0; i < colsNb; i ++){
            for (let j = 0; j < rowsNb; j ++){
                let x = i * cellSize;
                let y = j * cellSize;
                // draw the border of each cell
                ctx.strokeStyle = 'rgba(25, 38, 51, 0.2)';  
                ctx.strokeRect(x, y , cellSize, cellSize);
            }      
        }  
        currentGrid = make2DArray(rowsNb, colsNb);
        for (let i = 0; i < colsNb; i ++){
            for (let j = 0; j < rowsNb; j ++){
                // we loop through currentGrid to randomly assign to each cell a value of either 0 or 1
                // 0 means the cell is dead
                // 1 means the cell is alive
                currentGrid [j][i] = Math.round(Math.random() * 1);
            }
        }
        drawgrid(currentGrid);
    }


    // loop on each cell of a grid and check the value of each cell
    // if the value is 1, then we fill the cell with color
    const drawgrid = (grid) => {
        console.log('First element of grid received as argument to DRAW_GRID: ' + grid[0]);
        for (let i = 0; i < grid.length; i ++){
            for (let j = 0; j < grid[i].length; j ++){
                let x = j * cellSize;
                let y = i * cellSize;
                ctx.clearRect(x, y, cellSize, cellSize);
                ctx.save();
                // draw the border of each cell
                ctx.strokeStyle = 'rgba(25, 38, 51, 0.2)';  
                ctx.strokeRect(x, y , cellSize, cellSize);
                ctx.strokeStyle = 'rgba(25, 38, 51, 0.2)';  
                if (grid[i][j] == 1) {
                    ctx.fillStyle = 'rgba(51, 204, 51, 0.5)';
                    ctx.fillRect(x ,y , cellSize, cellSize);
                }
                ctx.restore();
            }
        }          
    }

    // count the number of alive neighbours for a given cell located in x, y 
    // mini-loop over mini-grid composed of the cell and her 8 neighbours
    const countNeighbors = (grid, x, y) => {
        let neighbors = 0;
        // console.log('First element of grid received as an argument to COUNT_NEIGHBORS: ' + grid[0]);
        const numberOfRows = grid.length;
        const numberOfCols = grid[0].length;
        // the nested loop begins one cell before the current cell and ends one cell after
        // hence the -1 to 2(excluded); the current cell being in position 0
        // we loop through -1 ; 0 ; 1
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                // the weird manipulation with the modulo aims at dealing with the edges of the grid
                const row = (x + i + numberOfRows) % numberOfRows;
                const col = (y + j + numberOfCols) % numberOfCols;
                // at each loop we add to the neighbors the value of the cell (which is either 0 or 1)
                // this way we get the number of neighbors
                neighbors += grid[row][col];
            }
        }
        // we retrieve the current cell from the total of neighbours
        // because we don't want to count it as a neighbour of itself
        // console.log(neighbors);
        neighbors -= grid[x][y];
        // console.log(neighbors);
        return neighbors;
    }
    
    // loop on every cell of the grid
    // to determine what the next state of each cell will be
    const updateCells = (grid) => {
        console.log('First element of grid received as argument to UPDATE_CELLS: '+ grid[0]);
        nextGrid = make2DArray(rowsNb, colsNb);
        for (let i = 0; i < colsNb; i ++){
            for (let j = 0; j < rowsNb; j ++){
                aliveNeighboursNb = countNeighbors(grid, j, i);
                // console.log('this cell has ' + aliveNeighboursNb + ' neighbours');
                if       ((grid[j][i] == 1) && (aliveNeighboursNb < 2)){
                    nextGrid [j][i] = 0; // the cell dies from isolation
                }else if ((grid[j][i] == 1) && (aliveNeighboursNb > 3)){
                    nextGrid [j][i] = 0; // the cell dies from suffocation
                }else if ((grid[j][i] == 0) && (aliveNeighboursNb == 3)){
                    nextGrid [j][i] = 1; // a new cell is born from the warm and sweet proximity of 3 cells ;)
                    // do you think this is how baby pandas are made ? 
                 }else {
                     nextGrid [j][i] = grid[j][i]; // what was remains... nothing new under the sun
                 }
            }
        }     
        console.log('First element of NEXT_GRID: ' + nextGrid[0]);
        return nextGrid;                                     
    }

    // re-draw the canvas according to the pattern defined in nextgrid
    const refreshCanvas = () => {
        console.log('First element of grid received as argument to REFRESH_CANVAS: ' + currentGrid[0]);
        // calculate new pattern of cells and return the new grid
        nextGrid = updateCells(currentGrid);
        // draw the new grid
        drawgrid(nextGrid);
        // the next grid becomes the current grid
        currentGrid = nextGrid;
        // window.requestAnimationFrame(refreshCanvas);
        timeOut = window.setTimeout(refreshCanvas, delay);
        return currentGrid;
    }

    
    //********************************************** callbacks functions for buttons ****************************************** */

    const playGameOfLife = () => {
        console.log("button PLAY has been clicked");
        console.log('First element of CURRENT_GRID ' + currentGrid[0]);
        delay = 50;
        refreshCanvas();
    }

    const stopGameOfLife = () => {
        console.log("button STOP has been clicked");
        clearTimeout(timeOut);
    }

    const initGameofLife = () => {
        console.log("button INIT has been clicked");
        clearTimeout(timeOut);
        currentGrid = make2DArray();
        init();
    }

    //**************************************************** game of life *************************************************** */
    init();
    btn_play.addEventListener('click', playGameOfLife);
    btn_stop.addEventListener('click', stopGameOfLife);
    btn_init.addEventListener('click', initGameofLife);
   
}