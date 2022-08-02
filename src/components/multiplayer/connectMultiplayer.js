
import io from "socket.io-client";
import { createCharacter } from "../character/createCharacter";

export let socket;

export const connectMultiplayer = (scene, multiplayer, dispatchMultiplayer) => {

    console.log("ConnectMultiplayer run")
    socket = io("http://localhost:2567");
    let me = {};
    console.log(socket)
    dispatchMultiplayer({
        type: "updateSocket",
        socket
    })

    socket.on("connect", () => {
        console.log("on connect", socket.id); // x8WIv7-mJelg7on_ALbx
        me = { ...multiplayer.me, socketId: socket.id };
        socket.emit("newPlayer", me)
        socket.emit("getPlayers")
        dispatchMultiplayer({
            type: "setMe",
            me
        })
    });


    socket.on("newPlayer", (player) => {
        console.log("newPlayer:", player, scene);
        if (socket.id !== me.socketId) {
            dispatchMultiplayer({
                type: "newPlayer",
                player,
            })
        }
    });

    socket.on("getPlayers", (players) => {
        // console.log("players:", players);
        dispatchMultiplayer({
            type: "setPlayers",
            players,
        })
    });


    socket.on("playerLeft", (socketId) => {
        console.log("playerLeft:", socketId);
        dispatchMultiplayer({
            type: "playerLeft",
            socketId,
        })
    });

    socket.on("move", (data) => {
        console.log("somebody moved:", data); // "world"
    });
}
