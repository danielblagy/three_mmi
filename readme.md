# MouseMeshInteraction
is a utility class that lets you easily set up mouse event handlers for threejs meshes (THREE.Mesh objects).

##
[Making Xylophone Simulation (Youtube video)](https://youtu.be/kAAgb1qYMbA)

##  
[Making the example (Youtube video)](https://www.youtube.com/watch?v=hSBYYDx-KL0)

##  
[File System Visualizer that uses three_mmi (Github repository)](https://github.com/danielblagy/wm3dfsv)

## Download:

To download the script, go to [three_mmi.js](three_mmi.js), open in raw view, right click -> Save as... (or Ctrl + S)

The "module" version of the script is at [module/three_mmi.js](module/three_mmi.js)

## Include:

You can include three_mmi as a simple js script in index.html:
```js
/* index.html */
// inside of html body
<script src="js/three.js"></script>
// comes after including three.js
<script src="js/three_mmi.js"></script>
```

## npm install

If you want to use three mmi in a nodejs project, you can install the module with npm.

```
npm i @danielblagy/three-mmi
```

or you can include it as a module, for example:
```js
/* script.js */
import * as THREE from 'three'
import MouseMeshInteraction from './three_mmi'
```

## Usage:
Initialize MouseMeshInteraction object (doesn't have to come before creating mesh objects)
```js
// pass threejs scene and camera
const mmi = new MouseMeshInteraction(scene, camera);
```
Create an interactable mesh
```js
// create an interactable mesh
const mesh = new THREE.Mesh(geometry, material);
// specify a name for the mesh (needed for mmi to work, you can give the same name to multiple meshes)
mesh.name = 'my_interactable_mesh';
scene.add(mesh);
```
Add a handler of a mouse event for a mesh with a specified name
Supported mouse events:
* 'click' (left mouse button click)
* 'dblclick' (left mouse button double click)
* 'contextmenu' (right mouse button click, triggered before opening the context menu)
* 'mouseenter' 	(mouse cursor is moved onto the element that has the listener attached)
* 'mouseleave' 	(mouse cursor is moved off the element that has the listener attached)
* 'mousedown' 	(mouse button is pressed on an element)
* 'mouseup' 	(mouse button is released over an element)
```js
// create a handler for when user clicks on a mesh with the name 'my_interactable_mesh'
mmi.addHandler('my_interactable_mesh', 'click', function(mesh) {
	console.log('interactable mesh has been clicked!');
	console.log(mesh);
});
```
Inside of render & update loop, call update function
```js
// put mmi.update() inside the graphics update function
function animate() {
	requestAnimationFrame( animate );
	
	mmi.update();
	
	renderer.render( scene, camera );
}
animate();
```
That's it!

## Quickstart Template (as a js script):
For a project with the following structure:
- index.html
- js/three.js
- js/three_mmi.js

```
/* index.html */
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>three_mmi Quickstart Template</title>
	</head>
	<body>
		<script src="js/three.js"></script>
		<script src="js/three_mmi.js"></script>
		<script>
			const scene = new THREE.Scene();
			
			const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
			camera.position.set(0, 0, 50);
					
			const renderer = new THREE.WebGLRenderer({antialias : true});
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.setClearColor(0xe0b2a4, 1.0);
			document.body.appendChild(renderer.domElement);
			
			// create an interactable light buld mesh
			
			const gray_color = new THREE.Color(0x57554f);
			const yellow_color = new THREE.Color(0xe0c53a);
			
			const bulb_geometry = new THREE.BoxGeometry(5, 5, 5);
			
			const bulb_material = new THREE.MeshBasicMaterial( { color: yellow_color } );
			
			var bulb_mesh = new THREE.Mesh(bulb_geometry, bulb_material);
			// add a name to the mesh (needed for mmi to work, you can give the same name to multiple meshes)
			bulb_mesh.name = 'bulb';
			bulb_mesh.position.set(0, 0, 0);
			scene.add(bulb_mesh);
			
			// initialize instance of class MouseMeshInteraction, passing threejs scene and camera
			const mmi = new MouseMeshInteraction(scene, camera);
			
			// add a handler on mouse click for mesh (or meshes) with the name 'bulb'
			mmi.addHandler('bulb', 'click', function(mesh) {
				console.log('bulb mesh is being clicked!');
				// switch between colors
				if (mesh.material.color === gray_color) {
					mesh.material.color = yellow_color;
				}
				else {
					mesh.material.color = gray_color;
				}
			});
			
			function render() {
				requestAnimationFrame(render);
				// update the mmi
				mmi.update();
				renderer.render(scene, camera);
			}
			
			render();
		</script>
	</body>
</html>
```

## Quickstart Template (as a js module):
```js
/* script.js */

import * as THREE from 'three'
import MouseMeshInteraction from 'three_mmi'

const scene = new THREE.Scene();
			
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 50);
		
const renderer = new THREE.WebGLRenderer({antialias : true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xe0b2a4, 1.0);
document.body.appendChild(renderer.domElement);

// create an interactable light buld mesh

const gray_color = new THREE.Color(0x57554f);
const yellow_color = new THREE.Color(0xe0c53a);

const bulb_geometry = new THREE.BoxGeometry(5, 5, 5);

const bulb_material = new THREE.MeshBasicMaterial( { color: yellow_color } );

var bulb_mesh = new THREE.Mesh(bulb_geometry, bulb_material);
// add a name to the mesh (needed for mmi to work, you can give the same name to multiple meshes)
bulb_mesh.name = 'bulb';
bulb_mesh.position.set(0, 0, 0);
scene.add(bulb_mesh);

// initialize instance of class MouseMeshInteraction, passing threejs scene and camera
const mmi = new MouseMeshInteraction(scene, camera);

// add a handler on mouse click for mesh (or meshes) with the name 'bulb'
mmi.addHandler('bulb', 'click', function(mesh) {
	console.log('bulb mesh is being clicked!');
	// switch between colors
	if (mesh.material.color === gray_color) {
		mesh.material.color = yellow_color;
	}
	else {
		mesh.material.color = gray_color;
	}
});

// just to test if the new features are conflicting with previously supported events
//		(everything seems to be OK)
mmi.addHandler('bulb', 'dblclick', function(mesh) {
	console.log('bulb mesh is double clicked!');
});
mmi.addHandler('bulb', 'contextmenu', function(mesh) {
	console.log('bulb mesh is pressed with the right button!');
});

const green_color = new THREE.Color(0x00bb00);
const orange_color = new THREE.Color(0xffaa00);
const red_color = new THREE.Color(0xff0a0a);
const test_mesh_geometry = new THREE.BoxGeometry( 5, 5, 5 ); 
const test_mesh_material = new THREE.MeshBasicMaterial( { color: green_color } );
var test_mesh = new THREE.Mesh(test_mesh_geometry, test_mesh_material);
test_mesh.name = 'new_features_mesh';
test_mesh.position.set(10, 0, 10);
scene.add(test_mesh);
		
mmi.addHandler('new_features_mesh', 'mouseenter', function(mesh) {
	console.log('mouse is over the mesh!  ', mesh);
	mesh.material.color = orange_color;
});

mmi.addHandler('new_features_mesh', 'mouseleave', function(mesh) {
	console.log('mouse has left!  ', mesh);
	mesh.material.color = green_color;
});

mmi.addHandler('new_features_mesh', 'mousedown', function(mesh) {
	console.log('mouse button is pressing on the mesh!  ', mesh);
	mesh.material.color = red_color;
});

mmi.addHandler('new_features_mesh', 'mouseup', function(mesh) {
	console.log('mouse button is released on the mesh!  ', mesh);
	mesh.material.color = orange_color;
});

mmi.addHandler('new_features_mesh', 'click', function(mesh) {
	console.log('mouse button is clicked on the mesh!  ', mesh);
});

function render() {
	requestAnimationFrame(render);
	// update the mmi
	mmi.update();
	renderer.render(scene, camera);
}

render();
```