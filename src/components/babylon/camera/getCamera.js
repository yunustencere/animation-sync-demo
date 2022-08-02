import { FollowCamera, Vector3 } from "@babylonjs/core";

export const getCamera = (scene, target) => {
    const canvas = scene.getEngine().getRenderingCanvas();
    scene.activeCamera.dispose();
    const camera = createFollowCamera(scene, target);
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    camera.inputs.removeByType('FollowCameraPointersInput');

    // camera.maxZ = 0.01
    
    return camera;
}

const createFollowCamera = (scene, target) => {
    const camera = new FollowCamera("FollowCamera", new Vector3(2, 0, 2), scene);
    camera.heightOffset = 2;
    camera.rotationOffset = 0;
    camera.cameraAcceleration = .1;
    camera.maxCameraSpeed = 1;
    camera.lockedTarget = target;
    // camera.attachControl(canvas, true);   

    return camera;
}