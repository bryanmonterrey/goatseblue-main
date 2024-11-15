declare module 'three/examples/jsm/loaders/GLTFLoader' {
    import { Object3D, Material, LoadingManager } from 'three';
  
    export interface GLTF {
      scene: Object3D;
      scenes: Object3D[];
      cameras: any[];
      animations: any[];
      asset: any;
      parser: any;
      userData: any;
    }
  
    export class GLTFLoader {
      constructor(manager?: LoadingManager);
      load(
        url: string,
        onLoad: (gltf: GLTF) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: ErrorEvent) => void
      ): void;
      parse(
        data: ArrayBuffer | string,
        path: string,
        onLoad: (gltf: GLTF) => void,
        onError?: (event: ErrorEvent) => void
      ): void;
    }
  }