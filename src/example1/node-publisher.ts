// Example-1, Create Node and simple Publisher

'strict mode';


import * as rclnodejs from 'rclnodejs';

async function main() {

    // initialize the ros-client-library
    await rclnodejs.init();

    // create node and generic message publisher
    let node = rclnodejs.createNode('ros2js_examples_node_publisher'); 
    let publisher = node.createPublisher('std_msgs/msg/String', 'msg');

    rclnodejs.spin(node);

     // publish helloworld String msg every second
    setInterval(() => {
        let msg = `hello world at ${new Date()}`;
        console.log('publishing ', msg);
        publisher.publish(msg);
    }, 1000);
}

// run the program
main();
 
