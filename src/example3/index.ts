// Example-3 Publish simulated LIDAR LaserScan msg

'strict mode';


import * as rclnodejs from 'rclnodejs';
import { LaserScanPublisher } from '../example3/laserscan-publisher';

/**
 * The main workflow for generating and publishing ROS2 LaserScan messages.
 */
async function main() {

  // initialize the rclnodejs client library
  await rclnodejs.init();

  // create ros2 node and an instance of LaserScanPublisher
  let node = rclnodejs.createNode('laserscan_publisher', 'ros2_js_examples');
  let publisher = new LaserScanPublisher(node);
  
  // start the node communication and message processing 
  rclnodejs.spin(node);
  
  // start the laserScan creation and publishing process.
  publisher.start();
}

// run the program
main();
