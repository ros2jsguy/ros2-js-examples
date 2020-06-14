// Example-2, Create Node and simple Subscription

'strict mode';


import * as rclnodejs from 'rclnodejs';

async function main() {

    // initialize the ros-client-library
    await rclnodejs.init();

    // create a node and subscription for topic: msg'
    let node = rclnodejs.createNode('node_subscriber', 'ros2_js_examples'); 
    let subscriber = node.createSubscription('std_msgs/msg/String', 'msg', undefined, 
      (msg: rclnodejs.Message) => {
        console.log('msg: ', (msg as rclnodejs.std_msgs.msg.String).data);
      });

    console.log('node-subscriber waiting for messages');

    // start accepting msgs
    rclnodejs.spin(node);
}

// run the program
main();
 
