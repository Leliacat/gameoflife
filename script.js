window.onload = function(){

    const canvas = document.getElementById('canvas');
    const btn_play = document.getElementById('btn_play');
    const btn_stop = document.getElementById('btn_stop');
    const btn_init = document.getElementById('btn_init');
    const btn_fast = document.getElementById('btn_fast');
    const btn_slow = document.getElementById('btn_slow');

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
    let delay = 50;

    //************************************************** functions *************************************************** */

    // create an empty 2D array (with the same number of cells as the grid on canvas) 
    // to store the state of each cell
    const make2DArray = ( rowsNb, colsNb ) => {
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
        // hence the -1 to 2(excluded), 
        // the current cell being in position 0
        // -1 ; 0 ; 1
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                // the weird manipulation with the modulo aims at dealing with the edges of the grid
                const row = (x + i + numberOfRows) % numberOfRows;
                const col = (y + j + numberOfCols) % numberOfCols;
                // at each loop we add to the neighbors the value of the cell (which is either 0 or 1)
                // this way we get the number of neighbor
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
        window.setTimeout(refreshCanvas, delay);
        return currentGrid;
    }

    
    //********************************************** callbacks functions for buttons ****************************************** */

    const playGameOfLife = () => {
        console.log("button PLAY has been clicked");
        console.log('First element of CURRENT_GRID ' + currentGrid[0]);
        // refreshCanvas(currentGrid);
        refreshCanvas();
    }

    const stopGameOfLife = () => {
        console.log("button STOP has been clicked");
    }

    const initGameofLife = () => {
        console.log("button INIT has been clicked");
    }

    const speedUpGame = () => {
        console.log("button FAST has been clicked");
    }

    const slowDownGame = () => {
        console.log("button SLOW has been clicked");
    }

    //**************************************************** game of life *************************************************** */
    init();
    btn_play.addEventListener('click', playGameOfLife);
    btn_stop.addEventListener('click', stopGameOfLife);
    btn_init.addEventListener('click', initGameofLife);
    btn_fast.addEventListener('click', speedUpGame);
    btn_slow.addEventListener('click', slowDownGame);
    

    // ctx.fillStyle = 'rgba(51, 204, 51, 0.5)';
    // ctx.fillRect(x, y, cellSize, cellSize);
    // ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
    // ctx.fillRect(x, y, cellSize, cellSize);
    // refreshCanvas();

        //   // add linear gradient
        //   var grd = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        //   // light blue
        //   grd.addColorStop(0, '#8ED6FF');   
        //   // dark blue
        //   grd.addColorStop(1, '#004CB3');
        //   context.fillStyle = grd;
        //   context.fill();
       

    // Une cellule morte possédant exactement trois voisines vivantes devient vivante (elle naît).
    //  if (!isAlive && aliveNeighboursNb == 3){
    //      isAlive = true;
    //  }
    // // Une cellule vivante possédant deux ou trois voisines vivantes le reste, sinon elle meurt.
    // if (isAlive && aliveNeighboursNb >=2 && aliveNeighboursNb<=3 ){
    //     isAlive = true;
    // }else{
    //     isAlive = false;
    // }


    // Any live cell with fewer than two live neighbors dies, as if by underpopulation.
    // Any live cell with two or three live neighbors lives on to the next generation.
    // Any live cell with more than three live neighbors dies, as if by overpopulation.
    // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

    // fillRect(x, y, largeur, hauteur)
    // Dessine un rectangle rempli.

    // strokeRect(x, y, largeur, hauteur)
    // Dessine un contour rectangulaire

    // clearRect(x, y, largeur, hauteur)
    // Efface la zone rectangulaire spécifiée, la rendant complètement transparente.

    // stroke()
    // Dessine la forme en traçant son contour.

    // fill()
    // Dessine une forme pleine en remplissant la zone de contenu du trajet.

    // fillStyle = color
    // Définit le style utilisé lors du remplissage de formes.
    // strokeStyle = color
    // Définit le style pour les contours des formes.

    // save()
    // Sauvegarde l'état du canevas dans sa globalité.
    // restore()
    // Restore le plus récent état sauvegardé du canevas.
    
    // const drawCell= (ctx, position) => {
    //         let x = position[0] * cellSize;
    //         let y = position[1] * cellSize;
    //         ctx.fillRect(x,y,cellSize,cellSize);
    // }

    
    
        
}