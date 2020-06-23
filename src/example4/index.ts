// Example-4 Publish simulated LIDAR LaserScan msg

'strict mode';


import * as rclnodejs from 'rclnodejs';
import { GameOfLife } from "./game-of-life";

const NODE_NAME = 'game_of_life_node';
const NODE_NAMESPACE = 'ros2_js_examples';
const TOPIC = 'game_of_life';
const FRAME_ID = 'game_of_life_frame';

/**
 * The main entry-pt for game-of-life.
 */
async function main() {

  // initialize the rclnodejs client library
  await rclnodejs.init();

  // create ros2 node and an instance of GameOfLife
  let node = rclnodejs.createNode(NODE_NAME, NODE_NAMESPACE);
  let game = new GameOfLife(node, TOPIC, FRAME_ID);
  
  // start the node communication and message processing 
  rclnodejs.spin(node);
  
  // start the game clock
  // run until no cells remain or the world does not change
  //   in any significant way
  game.start();
}

// run the program
main();
