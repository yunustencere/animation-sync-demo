export const getNodeByPlayerId = (scene, id) => {
    const node = scene.getNodeByName("Character_" + id);
    return scene.getNodeByName("Character_" + id)
}

// export const findSomeoneToSpectate = (scene, multiplayer) => {
//     console.log("multiplayerme", multiplayer)
//     const nonSpectators = multiplayer.players.filter(player => !player.isSpectator)
//     console.log("nonSpectators", nonSpectators)
//     if (nonSpectators.length > 0)
//         return getNodeByPlayerId(scene, nonSpectators[0].socketId)
// }