import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

class ARDrawing {
    constructor() {
        this.camera = null;
        this.scene = null;
        this.renderer = null;
        this.controller = null;
        this.isDrawing = false;
        this.drawingLine = null;
        this.lineMaterial = null;
        this.currentPositions = [];
        
        this.init();
    }

    init() {
        const container = document.createElement('div');
        document.body.appendChild(container);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
        light.position.set(0.5, 1, 0.25);
        this.scene.add(light);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(this.animate.bind(this));
        this.renderer.xr.enabled = true;
        container.appendChild(this.renderer.domElement);

        document.body.appendChild(ARButton.createButton(this.renderer));

        this.lineMaterial = new LineMaterial({ color: 0xffffff, linewidth: 25 });

        this.controller = this.renderer.xr.getController(0);
        this.controller.addEventListener('selectstart', this.onSelectStart.bind(this));
        this.controller.addEventListener('selectend', this.onSelectEnd.bind(this));
        this.scene.add(this.controller);

        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    onSelectStart() {
        this.isDrawing = true;
    }

    onSelectEnd() {
        this.isDrawing = false;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        if (this.isDrawing) {
            const position = this.controller.position;
            this.currentPositions.push(position.x, position.y, position.z);
            
            if (this.currentPositions.length > 3) {
                const geometry = new LineGeometry();
                geometry.setPositions(this.currentPositions);
                geometry.setColors(this.currentPositions.map(() => 1, 1, 1));
                const line = new Line2(geometry, this.lineMaterial);
                line.computeLineDistances();
                line.scale.set(1, 1, 1);
                this.scene.add(line);
            }
        } else {
            this.currentPositions = [];
        }
        this.renderer.render(this.scene, this.camera);
    }
}

export default ARDrawing;