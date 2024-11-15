declare module 'three/examples/jsm/loaders/RGBELoader' {
    import { Loader, TextureDataType, LoadingManager, PixelFormat, TextureEncoding, Texture } from 'three';
  
    export class RGBELoader extends Loader {
      constructor(manager?: LoadingManager);
      type: TextureDataType;
      setDataType(type: TextureDataType): this;
      load(
        url: string,
        onLoad?: (texture: Texture) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: ErrorEvent) => void
      ): Promise<Texture>;
    }
  }