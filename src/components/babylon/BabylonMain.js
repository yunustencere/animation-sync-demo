import React, { useEffect, useState } from "react";
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder, SceneLoader } from "@babylonjs/core";
// import SceneComponent from "./SceneComponent"; // uses above component in same directory
import SceneComponentOld from "./SceneComponentOld"; // uses above component in same directory
// import "./App.css";
import "@babylonjs/loaders";
import { useMultiplayerValue } from "../../context/MultiplayerContext";
import { createCharacter } from "../character/createCharacter";
import { engineOptions } from "./helpers/helpers";
import { connectMultiplayer, socket } from "../multiplayer/connectMultiplayer";
import { createSpectatorCamera } from "./camera/createSpectatorCamera";
import { findSomeoneToSpectate, getNodeByPlayerId } from "../helpers/helpers";
import { updateOtherPlayers } from "../multiplayer/updateOtherPlayers";
import { useCharacterValue } from "../../context/CharacterContext";
import { useInterval } from "../../hooks/useInterval";


const BabylonMain = () => {
    // console.log("BabylonMain rerendered")
    const [multiplayer, dispatchMultiplayer] = useMultiplayerValue();
    const [character, dispatchCharacter] = useCharacterValue();
    let characterTemp = [character];


    // const [cameraState, setCameraState] = useState();
    const [sceneState, setSceneState] = useState(null);
    const [hasRunBefore, setHasRunBefore] = useState(false);
    const [joinedToMultiplayer, setJoinedToMultiplayer] = useState(false)
    const [playersCreated, setPlayersCreated] = useState(false)
    const [foundSomeoneToSpectate, setFoundSomeoneToSpectate] = useState(false)
    const [hasStartedSendingPositionData, setHasStartedSendingPositionData] = useState(false)


    const [loadingAssets, setLoadingAssets] = useState([]);

    const [isSpectator, setIsSpectator] = useState(multiplayer.me.isSpectator);

    const [animationGroups, setAnimationGroups] = useState([]);

    //connect to multiplayer
    useEffect(() => {
        if (sceneState && !hasRunBefore) {
            console.log("1")
            connectMultiplayer(sceneState, multiplayer, dispatchMultiplayer, isSpectator);
            setHasRunBefore(true)
        }
    }, [sceneState])

    //create main character
    useEffect(() => {
        console.log("multiplayer", multiplayer)
        if (multiplayer?.me?.socketId && !joinedToMultiplayer) {
            console.log("2")
            if (!isSpectator) {
                createCharacter(sceneState, multiplayer.me, multiplayer, loadingAssets, setLoadingAssets, dispatchCharacter, setAnimationGroups);
            }
            setJoinedToMultiplayer(true)
        }
    }, [multiplayer])

    //create other players character
    useEffect(() => {
        if (multiplayer?.players?.length > 0 && multiplayer.me.socketId && !playersCreated) {
            console.log("3")
            multiplayer.players.forEach((player) => {
                if (player.socketId != multiplayer.me.socketId) {
                    createCharacter(sceneState, player, multiplayer, loadingAssets, setLoadingAssets, dispatchCharacter, setAnimationGroups);
                }

            })
            setPlayersCreated(true)
        }
    }, [multiplayer, playersCreated])

    // in spectator mode, check if other character assets are loaded and find someone to spectate
    useEffect(() => {
        // console.log("loadingAssets", loadingAssets)
        if (loadingAssets.length > 0 && isSpectator && !foundSomeoneToSpectate) {
            console.log("4")
            loadingAssets.forEach((asset) => {
                if (asset.percent >= 1 && !asset.isSpectator) {
                    const target = sceneState.getNodeByName(asset.name)
                    console.log("createSpectatorCamera")
                    createSpectatorCamera(sceneState, target)
                    setFoundSomeoneToSpectate(true)
                    //todo: break is not working
                }
            })
        }
    }, [loadingAssets, foundSomeoneToSpectate])

    // const [characterState, setCharacterState] = useState(character);
    // useEffect(() => {
    //     // console.log(character)
    //     setCharacterState(character)
    // }, [character])

    // const [intervalState, setIntervalState] = useState(null);

    //send character data for position and animation
    // useEffect(() => {
    //     if (joinedToMultiplayer && !isSpectator && !hasStartedSendingPositionData) {
    //         console.log("5")
    //         const tickrate = 1
    //         let interval = null;
    //         if (!interval) {
    //             interval = setInterval(intervalFunc, 1000 / tickrate)
    //         }


    //         setIntervalState(interval);

    //         // setHasStartedSendingPositionData(true)

    //         return () => {
    //             clearInterval(intervalState);
    //             setIntervalState(null);
    //         }
    //     }


    // }, [joinedToMultiplayer, multiplayer, character])

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         let char = null;
    //         setCharacterState((prevState) => {
    //             char = prevState;
    //             return prevState ?? characterState
    //         });
    //         intervalFunc(char);
    //     }, 1000);


    //     return () => clearInterval(interval);
    // }, []);

    const tickrate = 30;
    useInterval(() => {
        if (!isSpectator) {
            intervalFunc(character);
        }
    }, 1000 / tickrate);


    const intervalFunc = (character) => {
        // const mainChar = getNodeByPlayerId(sceneState, multiplayer.me.socketId)
        console.log("characterInformation", character)
        // socket.emit("characterInformation", { x: mainChar.position._x, y: mainChar.position._y, z: mainChar.position._z })
        socket.emit("characterInformation", character)

    }


    //update other players state frequently
    useEffect(() => {
        if (multiplayer?.players && multiplayer?.players?.length > 0) {
            updateOtherPlayers(sceneState, multiplayer, animationGroups)
        }

    }, [multiplayer])



    const onSceneReady = (scene) => {
        setSceneState(scene);

        var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

        //Import
        // The first parameter can be set to null to load all meshes and skeletons
        // SceneLoader.ImportMesh("", "/booths/", "stant1.gltf", scene, function (meshes, particleSystems, skeletons) {
        // SceneLoader.ImportMesh("", "./", "walking.gltf", scen    e, function (meshes, particleSystems, skeletons) {
        // });

        // This creates and positions a free camera (non-mesh)
        var camera = new FreeCamera("FreeCamera", new Vector3(0, 5, -10), scene);

        const engine = scene.getEngine();
        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
            }
        });
    };

    return (
        <div>
            {/* <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" /> */}
            <SceneComponentOld onSceneReady={onSceneReady} engineOptions={engineOptions} />
        </div>
    );

}

export default BabylonMain


