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