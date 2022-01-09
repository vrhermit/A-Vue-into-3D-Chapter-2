import { Engine, Scene, Vector3, Matrix, TmpVectors, TransformNode } from "@babylonjs/core";
import { GUI3DManager, SpherePanel } from "@babylonjs/gui";
import { createCamera, createEnvironment, createLogo, createTitle, createGround } from "@/scenes/SceneHelpers/Housekeeping";
import createStartMenu from "@/scenes/SceneHelpers/StartMenu";
import createCompactCard from "@/scenes/SceneHelpers/CompactCard";
import createDetailCard from "@/scenes/SceneHelpers/DetailCard";

const myScene = {
  engine: null,
  scene: null,
  manager: null,
  anchor: null,

  spherePanel: null,
  detailTexture: null,

  createScene: async (canvas) => {
    // Create and customize the scene
    const engine = new Engine(canvas);
    const scene = new Scene(engine);

    myScene.engine = engine;
    myScene.scene = scene;
    createEnvironment(scene);
    createCamera(canvas, scene);
    createTitle(scene);
    createLogo(scene);
    const ground = createGround(scene); // used for WebXR teleportation

    // Detail card
    // TODO: Replace this method or caching the detail texture. Instead, update the compact card with a query that can find the detail card texture in the scene graph
    const detailTexture = createDetailCard(scene);
    myScene.detailTexture = detailTexture;

    // Create the 3D UI manager
    const manager = new GUI3DManager(scene);
    const anchor = new TransformNode("");
    anchor.position = new Vector3(0, 1.6, 0);
    myScene.manager = manager;
    myScene.anchor = anchor;

    var panel = new SpherePanel("spherePanel");
    myScene.spherePanel = panel;
    panel.margin = 0.05;

    manager.addControl(panel);
    panel.linkToTransformNode(anchor);
    panel.position.z = -1.6;
    panel.columns = 6;
    // Adapted from here: https://github.com/BabylonJS/Babylon.js/blob/master/gui/src/3D/controls/spherePanel.ts#L60-L69
    // TODO: Check to see if there is a new way to do this in 5.0
    panel._sphericalMapping = function (source) {
      let newPos = new Vector3(0, 0, this._radius);

      let xAngle = source.y / this._radius;
      let yAngle = source.x / this._radius;

      Matrix.RotationYawPitchRollToRef(yAngle, xAngle, 0, TmpVectors.Matrix[0]);

      return Vector3.TransformNormal(newPos, TmpVectors.Matrix[0]);
    };

    // WebXRDefaultExperience
    const xrDefault = scene.createDefaultXRExperienceAsync({
      floorMeshes: [ground]
    });
    const xrHelper = xrDefault.baseExperience;
    console.info("webxr:", xrHelper);

    engine.runRenderLoop(() => {
      scene.render();
    });
  },

  // --- Call these functions from Vue to pass in the data or setup the scene ---

  addStartMenu: function (startButtonCallback) {
    // Takes in a function from Vue to setup the scene when the start button is clicked
    const startButton = createStartMenu(startButtonCallback);
    myScene.manager.addControl(startButton);
    startButton.linkToTransformNode = myScene.anchor;
    startButton.position = new Vector3(0, 1.3, 2.2);
    startButton.scaling = new Vector3(0.4, 0.4, 0.4);
  },

  setCompactCards: function (items) {
    // Have to copy the array without reference to the original using the spread operator
    // Without doing this, foreach only iterates over half the array
    const panel = myScene.spherePanel;
    panel.blockLayout = true;
    if (panel.children.length > 0) {
      const children = [...panel.children];
      children.forEach((child) => {
        panel.removeControl(child);
      });
    }
    items.forEach((item) => {
      const card = createCompactCard(item, myScene.detailTexture, myScene.scene);
      panel.addControl(card);
    });
    panel.blockLayout = false;
  }
};

export default myScene;
