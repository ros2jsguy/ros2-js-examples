
'strict mode';


import * as rclnodejs from 'rclnodejs';

/**
 * ROS2 publisher of simulated LaserScan messages.
 * A timer is used to create and publish a laserScan message once per second (1 Hz).
 * Use start() and stop() to initiate and terminate messgage publication.  
 */
export class LaserScanPublisher {

  private isRunning = false;
  private publisher: rclnodejs.Publisher;
  private publisherTimer: rclnodejs.Timer;

  /**
   * Create an instance
   * 
   * @param node - The node that to which this publisher belongs.
   * @param topic - The topic name to which laserScan msgs will be published.
   */
  constructor(public readonly node: rclnodejs.Node, public readonly topic = 'laserscan') {
    this.publisher = node.createPublisher('sensor_msgs/msg/LaserScan', topic);
  }

  /**
   * Start the laserScan message generation and publishing process.
   * 
   * @param interval - The unit of time (milliseconds) to wait before running the next .
   */
  start(interval = 1000): void {
    if (this.isRunning) return;

    this.isRunning = true;

    this.publisherTimer = this.node.createTimer(interval, () => {
      let msg = this.genLaserScanMsg();
      console.log('publish msg at ', msg.header.stamp.sec);
      this.publisher.publish(msg);
    });
  }

  /**
   * Stop creating and publishing laserScan messages.
   */
  stop() {
    this.publisherTimer.cancel();
    this.publisherTimer = null;
    this.isRunning = false;
  }

  /**
   * Creates a simulated forward facing LaserScan message.
   * Scan data consists of 180 measurements on a 180 degree arc centered on the
   * x-axis extending directly forward of the virutal lidar device.
   * 
   * @param range  - The distance of simulated lidar range readings
   * @returns A new LaserScan message
   */
  protected genLaserScanMsg(range = 10): rclnodejs.sensor_msgs.msg.LaserScan {

    // create empty laserScan msg
    let laserScanMsg = new (rclnodejs.require('sensor_msgs/msg/LaserScan'));

    // configure msg header 
    laserScanMsg.header.frame_id = 'laserscan_frame';
    laserScanMsg.header.stamp = this.node.now().toMsg();

    // generate range and intensity data
    let sample_cnt = 180;
    let ranges = new Array(sample_cnt).fill(range);
    let intensities = new Array(sample_cnt).fill(1.0);

    // configure msg data
    laserScanMsg.angle_min = 0;
    laserScanMsg.angle_max = Math.PI / 2.0;
    laserScanMsg.angle_increment = Math.PI / 180.0;
    laserScanMsg.time_increment = 1.0 / sample_cnt;
    laserScanMsg.scan_time = 1.0;
    laserScanMsg.range_min = range - 1;
    laserScanMsg.range_max = range + 1;
    laserScanMsg.ranges = ranges;
    laserScanMsg.intensities = intensities;

    return laserScanMsg;
  }
}

