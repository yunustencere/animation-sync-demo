import { ActionManager, ExecuteCodeAction, Vector3 } from "@babylonjs/core";

export const inputController = (scene, animationGroups, socketId, dispatchCharacter) => {
    //set up input map
    var inputMap = {};
    scene.actionManager = new ActionManager(scene);
    scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

    }));
    scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

    }));

    // const character = scene.getMeshByName("Alpha_Surface")

    const character = scene.getNodeByName("Character_" + socketId)

    console.log(socketId, character)
    let anim = animationGroups[0];
    scene.onBeforeRenderObservable.add(function () {
        if (character) {
            if (inputMap["w"] || inputMap["ArrowUp"]) {
                // character.position.z += character.speed * 0.01

                anim.start();
                dispatchCharacter({
                    type: "updateCharacter",
                    character: {
                        position: { x: character.position._x, y: character.position._y, z: character.position._z },
                        animation: { animationGroupsIndex: 0, start: true }
                    }
                });
            }
            else {
                anim.stop();
                dispatchCharacter({
                    type: "updateCharacter",
                    character: {
                        position: { x: character.position._x, y: character.position._y, z: character.position._z },
                        animation: { animationGroupsIndex: 0, start: false }
                    }
                });
            }
            // if (inputMap["a"] || inputMap["ArrowLeft"]) {
            //     character.rotation.y -= .1;
            //     character.frontVector = new Vector3(Math.sin(character.rotation.y), 0, Math.cos(character.rotation.y));
            // }
            // if (inputMap["s"] || inputMap["ArrowDown"]) {
            //     // character.moveWithCollisions(character.frontVector.multiplyByFloats(-character.speed, -character.speed, -character.speed));
            //     character.position.z -= character.speed * 0.01
            // }
            // if (inputMap["d"] || inputMap["ArrowRight"]) {
            //     character.rotation.y += .1;
            //     character.frontVector = new Vector3(Math.sin(character.rotation.y), 0, Math.cos(character.rotation.y));
            // }

        }


    })
}