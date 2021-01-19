# MouseMeshInteraction
is a utility class that lets you easily set up mouse event handlers for threejs meshes (THREE.Mesh objects).

##  
[Making the example (Youtube video)](https://www.youtube.com/watch?v=hSBYYDx-KL0)

##  
[File System Visualizer that uses three_mmi (Github repository)](https://github.com/danielblagy/wm3dfsv)

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

## Quickstart Template:
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