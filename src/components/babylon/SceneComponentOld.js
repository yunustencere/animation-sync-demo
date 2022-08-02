/* eslint-disable react/destructuring-assignment */
import { Engine, Scene } from "@babylonjs/core";
import React from "react";
import { engineOptions } from "./helpers/helpers";
export default class SceneComponentOld extends React.Component {

  componentDidMount() {
    this.engine = new Engine(
      this.canvas,
      true,
      engineOptions,
      true
    );

    const scene = new Scene(this.engine);
    this.scene = scene;

    if (typeof this.props.onSceneReady === "function") {
      this.props.onSceneReady(
        this.scene,
        this.canvas
      );
    } else {
      console.error("onSceneReady function not available");
    }

    // Resize the babylon engine when the window is resized
    window.addEventListener("resize", this.onResizeWindow);
  }

  componentWillUnmount() {
    console.log("componentWillUnmount")
    // window.removeEventListener("resize", this.onResizeWindow);
    // if (this.scene) {
    //   this.scene.blockfreeActiveMeshesAndRenderingGroups = true;
    //   this.scene.dispose(true, true);
    //   this.scene.dispose();
    // }
    // if (this.engine) this.engine.dispose();
  }

  onResizeWindow = () => {
    if (this.engine) {
      this.engine.resize();
    }
  };

  onCanvasLoaded = c => {
    if (c !== null) {
      this.canvas = c;
    }
  };

  render() {
    // 'rest' can contain additional properties that you can flow through to canvas:
    // (id, className, etc.)
    const { width, height } = this.props;

    const opts = {};

    if (width !== undefined && height !== undefined) {
      opts.width = width;
      opts.height = height;
    }

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <canvas id="renderCanvas" {...opts} ref={this.onCanvasLoaded} style={{width: 100 + "%"}} />;
  }
}
