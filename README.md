# ros2-js-examples
ROS 2 examples from the [ros2jsguy articles](https://medium.com/@ros2jsguy).

* Example-1: node-publisher
* Example-2: node-subscriber
* Example-3: laserscan-publisher
* Example-4: Conway's Game of Life

The project is implemented using TypeScript, Node.js and the [rclnodejs](https://github.com/RobotWebTools/rclnodejs) ROS 2 client library.

## Prerequisites
* [git](https://git-scm.com/)
* [Node.js](nodejs.org) ver. 12 and either npm or yarn package manager
* [ROS 2 Foxy distribution](https://index.ros.org/doc/ros2/Installation/Foxy)


## Installation and Running
From a command shell run the commands shown in the following steps.

### Step-1 Clone ros2_js_examples github repository
```
git clone https://github.com/ros2jsguy/ros2_js_examples.git
```
You should see the project code downloaded to a new directory named `ros2_js_example.

### Step-2 Install Project Dependencies
```
cd ros2_js_examples
npm install
```
This may take 1-2 minutes to complete as the rclnodejs package must be compiled as part of the installation process.
### Step-3 Run TypeScript Compiler
```
npm run build
```

### Step-4 Run examples
Each src/example* folder includes a README that describes the example and provides details for building and running the example.


