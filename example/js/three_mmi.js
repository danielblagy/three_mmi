/*
	Github: https://github.com/danielblagy/three_mmi
	
	MIT License

	Copyright (c) 2021 danielblagy
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
	
	An example project (*github link*)
	
	USAGE:
	// pass threejs scene and camera
	const mmi = new MouseMeshInteraction(scene, camera);
	
	// create an interactable mesh
	const mesh = new THREE.Mesh(geometry, material);
	// specify a name for the mesh (needed for mmi to work, you can give the same name to multiple meshes)
	mesh.name = 'my_interactable_mesh';
	scene.add(mesh);
	
	// there are 3 types of interactions available:
	//		* 'click' (left mouse button click)
	//		* 'dblclick' (left mouse button double click)
	//		* 'contextmenu' (right mouse button click, triggered before opening the context menu)
	
	// create a handler for when user clicks on the mesh with name 'my_interactable_mesh'
	mmi.addHandler('my_interactable_mesh', 'click', function(mesh) {
		console.log('interactable mesh has been clicked!');
		console.log(mesh);
	});
	
	// put mmi.update() inside the graphics update function
	function animate() {
		requestAnimationFrame( animate );
		
		mmi.update();
		
		renderer.render( scene, camera );
	}
	animate();
	
	QUICKSTART TEMPLATE:
	
	For a project with the following structure:
	index.html
	js/three.js
	js/three_mmi.js
	
	*index.html*
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
*/

class MouseMeshInteractionHandler {
	constructor(mesh_name, handler_function) {
		this.mesh_name = mesh_name;
		this.handler_function = handler_function;
	}
}

class MouseMeshInteraction {
	constructor(scene, camera) {
		this.scene = scene;
		this.camera = camera;
		
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		
		this.updated = false;
		this.event = '';
		
		this.handlers = new Map();
		
		this.handlers.set('click', []);
		this.handlers.set('dblclick', []);
		this.handlers.set('contextmenu', []);
		
		window.addEventListener('mousemove', this);
		
		window.addEventListener('click', this);
		window.addEventListener('dblclick', this);
		window.addEventListener('contextmenu', this);
	}
	
	handleEvent(e) {
		switch(e.type) {
			case "mousemove": {
				this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
				this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
			}
			break;
			default: {
				this.updated = true;
				this.event = e.type;
			}
		}
	}
	
	addHandler(mesh_name, event_type, handler_function) {
		if (this.handlers.has(event_type)) {
			this.handlers.get(event_type).push(new MouseMeshInteractionHandler(mesh_name, handler_function));
		}
	}
	
	update() {
		if (this.updated) {
			// update the picking ray with the camera and mouse position
			this.raycaster.setFromCamera(this.mouse, this.camera);
			
			// calculate objects intersecting the picking ray
			const intersects = this.raycaster.intersectObjects(this.scene.children);
			
			if (intersects.length > 0) {
				let handlers_of_event = this.handlers.get(this.event);
				for (const handler of handlers_of_event) {
					if (handler.mesh_name === intersects[0].object.name) {
						handler.handler_function(intersects[0].object);
						break;
					}
				}
			}
			
			this.updated = false;
		}
	}
}