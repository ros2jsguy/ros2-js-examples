import * as rclnodejs from 'rclnodejs';

// grid dimensions and cell size
const WIDTH = 100;
const HEIGHT = 100;
const RESOLUTION = 0.2;

// Timer tick in milliseconds
const TICK_LEN = 500;

// cell states
const ALIVE = 100;
const DEAD = 0;

/**
 * Implements Conway's Game of Life (cellular automata) using
 * ROS 2 OccupancyGrid to model the cellular world and a Timer to tick through 
 * generations. For each generation, the state of the cellular world is 
 * published as an OccupancyGrid message.
 * 
 * Use start() and stop() to control the simulation.
 * 
 * Two data arrays are maintained, 1 for cthe urrent generation and 1 for the 
 * previous generation. A single occupacnymap instance is created and reused 
 * across each generation, only updating the map's data and timestamp
 */
export class GameOfLife {

  // counter of generations completed
  private generation: number;

  // 
  private prevGen: number[];
  private curGen: number[];
  
  private publisher: rclnodejs.Publisher;
  private map: rclnodejs.nav_msgs.msg.OccupancyGrid;
  private timer: rclnodejs.Timer;
  
  private isRunning: boolean;

  /**
   * Create a new Game of Life instance.
   * 
   * @param node - The ROS2 node context for this instance
   * @param topic - Publish game state as an occupancyGrid to this topic
   * @param frameId - The frame_id of published occupancyGrid messages
   */
  constructor(private node: rclnodejs.Node, topic: string, frameId: string) {
    this.generation = 0;
    this.isRunning = false;

    // create random state cellular automata world
    this.prevGen = new Array<number>(WIDTH * HEIGHT);
    for (let i=0; i < WIDTH * HEIGHT; i++) {
      this.prevGen[i] = Math.round(Math.random()) > 0 ? ALIVE : DEAD;
    }
    this.curGen = Array.from(this.prevGen);
  
    // create occupancy-map publisher
    this.publisher = this.node.createPublisher('nav_msgs/msg/OccupancyGrid', topic);

    // create the map instance
    const map = new (rclnodejs.require('nav_msgs/msg/OccupancyGrid'));
    map.header.frame_id = frameId;
    map.header.stamp = this.node.now().toMsg();
    map.info.map_load_time = map.header.stamp;
    map.info.resolution = RESOLUTION;
    map.info.width = WIDTH;
    map.info.height = HEIGHT;
    map.info.origin = {  // geometry_msgs.msg.Pose
      position: {x: 0, y: 0, z: 0}, 
      orientation: {x: 0, y: 0, z: 0, w: 1.0}
    };
    this.map = map;
  }

  /**
   * Start the game.
   */
  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.displayGenerationInfo();
    this.timer = this.node.createTimer(TICK_LEN, ()=>this.tick());
  }

  /**
   * Terminate the current game.
   */
  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.timer.cancel();
  }

  /**
   * Initiate transition to next generation
   */
  protected tick(): void {

    // stop if there are no alive cells
    if (!this.aliveCount()) { 
      this.stop();
      return;
    }

    this.generation++;

    // apply rules to prev generation to create current generation
    for (let row = 0; row < HEIGHT; row++) {
      for (let column = 0; column < WIDTH; column++) {
        let newCellValue = DEAD; // rule-3 is default all cells are dead
        const neighborCnt = this.getNeighborCount(row,column);
        
        if (this.isCellAlive(row,column)) { //apply live cell rules
          newCellValue = neighborCnt === 2 || neighborCnt === 3 ? ALIVE : DEAD;
        } else if (neighborCnt === 3) {  // apply dead-cell rule
          newCellValue = ALIVE;
        }

        // update current cells state
        const idx = this.computeDataIndex(row,column);
        this.curGen[idx] = newCellValue;
      }
    }

    // update map with current time and cell data
    this.map.header.stamp = this.node.now().toMsg();
    this.map.data = this.curGen;

    this.displayGenerationInfo();

    // publish new map state
    this.publisher.publish(this.map);

    // swap curGen with prevGen
    const tmp = this.prevGen;
    this.prevGen = this.curGen;
    this.curGen = tmp;
  }

  /**
   * Return the number of alive cells adjacent to a cell at (row,col) grid coordinate.
   * 
   * @param row - The 0-index row number of the cell
   * @param column - The 0-index column number of the cell
   * @returns The number alive neigherbor cells 
   */
  protected getNeighborCount(row: number, column: number): number {
    let total = 0;
    
    //search top row
    total += this.isCellAlive(row-1,column-1) ? 1 : 0;
    total += this.isCellAlive(row-1,column) ? 1 : 0;
    total += this.isCellAlive(row-1,column+1) ? 1 : 0;

    //search same row
    total += this.isCellAlive(row,column-1) ? 1 : 0;
    total += this.isCellAlive(row,column+1) ? 1 : 0;

    //search top row
    total += this.isCellAlive(row+1,column-1) ? 1 : 0;
    total += this.isCellAlive(row+1,column) ? 1 : 0;
    total += this.isCellAlive(row+1,column+1) ? 1 : 0;
//console.log('alive cnt:', total);
    return total;
  }

  /**
   * Test is the cell at (row,col) coordinate alive.
   * 
   * @param row - The 0-index row number of the cell
   * @param column - The 0-index column number of the cell
   */
  protected isCellAlive(row: number, column: number): boolean {
    return this.getCellValue(row, column) === ALIVE;
  }

  /**
   * Get the state of cell at grid coordinate (row,col)
   * 
   * @param row - The 0-index row number of the cell
   * @param column - The 0-index column number of the cell
   * @returns 0 for Dead state or 1 for Alive state
   */
  protected getCellValue(row: number, column: number): number {
    const idx = this.computeDataIndex(row, column);
    return idx > -1 ? this.prevGen[idx] : DEAD;
  }

  /**
   * Convert a (row,col) grid coordinate to a linear index into dataset
   * 
   * @param row - The 0-index row number of the cell
   * @param column - The 0-index column number of the cell
   * @returns The dataset index
   */
  private computeDataIndex(row: number, column: number): number {
    if (row < 0) return -1;
    if (row >= HEIGHT) return -1;
    if (column < 0) return -1;
    if (column >= WIDTH) return -1;

    return row * WIDTH + column;
  }

  /**
   * Count and return the number of cells alive in the current generation.
   * 
   * @return The number of alive cells. 
   */
  protected aliveCount(): number {
    return this.curGen.reduce((total, curCellValue) => curCellValue === ALIVE ? total+1 : total, 0);
  }

  /**
   * Output the generation count info to stdout. 
   */
  protected displayGenerationInfo(): void {
    console.log(`Generation ${this.generation}, live count: ${this.aliveCount()}`);
  }
}
