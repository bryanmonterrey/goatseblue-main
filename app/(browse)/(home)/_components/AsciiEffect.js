/**
 * ASCII Effect adapted for modern Three.js from https://github.com/mrdoob/three.js/blob/master/examples/jsm/effects/AsciiEffect.js
 */

import * as THREE from 'three';

class AsciiEffect {
    constructor(renderer, charSet = ' .:-=+*#%@', options = {}) {
        this.renderer = renderer;

        this.domElement = document.createElement('pre');
        this.domElement.style.position = 'absolute';
        this.domElement.style.top = '0';
        this.domElement.style.left = '0';
        this.domElement.style.margin = '0';
        this.domElement.style.padding = '0';
        this.domElement.style.color = options.color || '#ffffff';
        this.domElement.style.backgroundColor = options.backgroundColor || '#000000';
        this.domElement.style.fontFamily = 'monospace';
        this.domElement.style.fontSize = '10px';
        this.domElement.style.lineHeight = '10px';
        this.domElement.style.letterSpacing = '0';
        this.domElement.style.cursor = 'default';

        this.characters = charSet.split('');
        this.resolution = options.resolution || 0.15;
        this.scale = options.scale || 1;
        this.invert = options.invert || false;

        // Create canvas and context
        this.canvas = document.createElement('canvas');
        this.canvas.style.display = 'none';
        this.context = this.canvas.getContext('2d');
        this.imageData = null;

        this.setSize(renderer.domElement.width, renderer.domElement.height);
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;

        const aspect = width / height;
        const charAspect = 0.5;

        this.cellWidth = Math.round(width * this.resolution);
        this.cellHeight = Math.round((width * this.resolution) / (aspect * charAspect));

        this.canvas.width = this.cellWidth;
        this.canvas.height = this.cellHeight;

        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, this.cellWidth, this.cellHeight);

        this.imageData = this.context.getImageData(0, 0, this.cellWidth, this.cellHeight);

        this.domElement.style.width = `${width}px`;
        this.domElement.style.height = `${height}px`;
    }

    render(scene, camera) {
        this.renderer.render(scene, camera);

        this.context.drawImage(this.renderer.domElement, 0, 0, this.cellWidth, this.cellHeight);
        this.imageData = this.context.getImageData(0, 0, this.cellWidth, this.cellHeight);
        const pixels = this.imageData.data;

        let output = '';
        let index = 0;

        for (let y = 0; y < this.cellHeight; y++) {
            for (let x = 0; x < this.cellWidth; x++) {
                const r = pixels[index];
                const g = pixels[index + 1];
                const b = pixels[index + 2];

                const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                const charIndex = this.invert 
                    ? Math.floor(brightness * (this.characters.length - 1))
                    : Math.floor((1 - brightness) * (this.characters.length - 1));
                
                output += this.characters[charIndex];
                index += 4;
            }
            output += '\n';
        }

        this.domElement.textContent = output;
    }
}

export { AsciiEffect };