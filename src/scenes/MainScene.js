import { Engine, Scene, Vector3, TransformNode } from "@babylonjs/core";
import { GUI3DManager } from "@babylonjs/gui";
import { createCamera, createEnvironment, createLogo, createTitle, createGround } from "@/scenes/SceneHelpers/Housekeeping";
import createStartMenu from "@/scenes/SceneHelpers/StartMenu";
import { createCompactCard, createSpherePanel } from "@/scenes/SceneHelpers/CompactCard";
import createDetailCard from "@/scenes/SceneHelpers/DetailCard";

const myScene = {
  engine: null,
  scene: null,
  manager: null,
  anchor: null,
  spherePanel: null,

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
    createDetailCard(scene);

    // Create the 3D GUI
    const manager = new GUI3DManager(scene);
    const anchor = new TransformNode("");
    anchor.position = new Vector3(0, 1.6, 0);

    const panel = createSpherePanel();
    panel.linkToTransformNode(anchor);
    manager.addControl(panel);
    panel.position.y = 1.6;
    panel.position.z = -1.6;

    // Stash these in the myScene object for later use
    myScene.manager = manager;
    myScene.anchor = anchor;
    myScene.spherePanel = panel;

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
    if (panel.children?.length > 0) {
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
