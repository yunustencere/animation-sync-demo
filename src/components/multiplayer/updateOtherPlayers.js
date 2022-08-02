import { ParticleTextureBlock, Vector3 } from "@babylonjs/core";
import { getNodeByPlayerId } from "../helpers/helpers";

export const updateOtherPlayers = (scene, multiplayer, animationGroups) => {
    const players = multiplayer.players
    players.forEach(player => {
        //if player is not me
        if (player.socketId != multiplayer.me.socketId && !player.isSpectator) {
            // updatePosition(scene, player);
            updateAnimation(scene, player, animationGroups);
        }

    });
}

const updatePosition = (scene, player) => {
    const character = player.character;
    if (!isNaN(character?.position?.x) && !isNaN(character?.position?.y) && !isNaN(character?.position?.z)) {
        const characterNode = getNodeByPlayerId(scene, player.socketId);
        console.log(characterNode)

        if (characterNode)
            characterNode.position = new Vector3(character.position.x, character.position.y, character.position.z)

    }
}

const updateAnimation = (scene, player, animationGroups) => {
    const character = player.character;
    if (animationGroups[0] && character?.animation && character?.animation?.start) {
        animationGroups[0].play();
        console.log(animationGroups[0])
    }
    else if (animationGroups[0] && animationGroups[0].stop instanceof Function) {
        console.log("elsee")
        animationGroups[0].stop();
    }

}