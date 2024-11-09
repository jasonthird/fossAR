import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';
class Ar{
    constructor(text){
        this.text = text;
        this.init();
        this.isMoving = false;
    }
    

    init(){
        const container = document.createElement('div');
        document.body.appendChild(container);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
        this.light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
        this.scene.add(this.light);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(this.animate.bind(this));
        this.renderer.xr.enabled = true;
        container.appendChild(this.renderer.domElement);

        document.body.appendChild(ARButton.createButton(this.renderer));

        window.addEventListener('resize', this.onWindowResize.bind(this));

        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const material = new THREE.MeshNormalMaterial();
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.position.set(0, 0, -0.3);
        this.scene.add(this.cube);
        const controller = this.renderer.xr.getController(0);
        controller.addEventListener('selectstart', this.onSelect.bind(this));
        controller.addEventListener('selectend', this.onDeselect.bind(this));

    }

    onSelect(){
        this.isMoving = true;
    }

    onDeselect(){
        this.isMoving = false;
    }

    onWindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate(){
        this.renderer.render(this.scene, this.camera);
        if (this.isMoving) {
            var controllerPos = this.renderer.xr.getController(0).position;
            this.cube.position.set(controllerPos.x, controllerPos.y, controllerPos.z);
        }
    }

}

export default Ar;