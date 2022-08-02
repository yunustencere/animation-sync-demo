import { SceneLoader, Vector3 } from "@babylonjs/core";
import { useMultiplayerValue } from "../../context/MultiplayerContext";
import { getCamera } from "../babylon/camera/getCamera";
import { inputController } from "../babylon/input/inputController";

export const createCharacter = async (scene, player, multiplayer, loadingAssets, setLoadingAssets, dispatchCharacter, setAnimationGroups) => {

    const characterGlb = await SceneLoader.ImportMeshAsync("", "./", "walking.glb", scene,
        (evt) => {
            // onProgress
            let loadedPercent = 0;
            if (evt.lengthComputable) {
                loadedPercent = ((evt.loaded * 100) / evt.total).toFixed();
            } else {
                const dlCount = evt.loaded / (1024 * 1024);
                loadedPercent = Math.floor(dlCount * 100.0) / 100.0;
            }
            const tempLoadingAssets = [...loadingAssets];
            let loadingAsset = tempLoadingAssets.find((el) => el.name === "Character_" + player.socketId);
            if (!loadingAsset) {
                loadingAsset = {
                    ...player,
                    name: "Character_" + player.socketId,
                };
                tempLoadingAssets.push(loadingAsset)
            }

            loadingAsset.percent = parseFloat(loadedPercent);
            setLoadingAssets(tempLoadingAssets);
        }
    );
    console.log("loaded")

    // const character = scene.getMeshByName("Alpha_Surface")
    const characterNode = characterGlb.meshes[2]._parentNode
    console.log(characterNode)
    characterNode.name = "Character_" + player.socketId;
    characterNode.id = "Character_" + player.socketId;

    characterNode.speed = 1;
    characterNode.frontVector = new Vector3(0, 0, -1);
    characterNode.position = new Vector3(player?.position?.x ?? 0, player?.position?.y ?? 0, player?.position?.z ?? 1);
    characterNode.position = new Vector3(0, 0, 1);

    console.log("animation groups", characterGlb.animationGroups);
    characterGlb.animationGroups[0].stop();
    setAnimationGroups(characterGlb.animationGroups);

    console.log(scene.getNodeByName("Character_" + player.socketId))
    //if player is me
    if (player.socketId === multiplayer.me.socketId) {
        const followCamera = getCamera(scene, characterNode);//create this camera after main character instantiated
        inputController(scene, characterGlb.animationGroups, player.socketId, dispatchCharacter);
        // followCamera.setTarget(characterNode.position);
        console.log(scene.activeCamera)
    }
}