import { Engine, Scene, Vector3, TransformNode } from "@babylonjs/core";
import { GUI3DManager } from "@babylonjs/gui";
import { createCamera, createEnvironment, createLogo, createTitle, createGround } from "@/scenes/SceneHelpers/Housekeeping";
import createStartMenu from "@/scenes/SceneHelpers/StartMenu";
import createDetailCard from "@/scenes/SceneHelpers/DetailCard";
import { createCompactCard, createSpherePanel } from "@/scenes/SceneHelpers/CompactCard";
import { createControlPanelButton, createStackPanel } from "@/scenes/SceneHelpers/ControlPanel";

const SceneWrapper = {
  engine: null,
  scene: null,
  manager: null,
  anchor: null,
  spherePanel: null,
  controlPanel: null,

  createScene: async (canvas) => {
    // Create and customize the scene
    const engine = new Engine(canvas);
    const scene = new Scene(engine);

    SceneWrapper.engine = engine;
    SceneWrapper.scene = scene;
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

    const controlPanel = createStackPanel();
    controlPanel.linkToTransformNode(anchor);
    manager.addControl(controlPanel);
    controlPanel.position = new Vector3(0, 1.2, 2.1);
    controlPanel.scaling = new Vector3(0.1, 0.1, 0.1);

    // Stash these in the SceneWrapper object for later use
    SceneWrapper.manager = manager;
    SceneWrapper.anchor = anchor;
    SceneWrapper.spherePanel = panel;
    SceneWrapper.controlPanel = controlPanel;

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

  sendStartButton: function (startButtonCallback) {
    // Takes in a function from Vue to setup the scene when the start button is clicked
    const startButton = createStartMenu(startButtonCallback);
    SceneWrapper.manager.addControl(startButton);
    startButton.linkToTransformNode = SceneWrapper.anchor;
    startButton.position = new Vector3(0, 1.3, 2.2);
    startButton.scaling = new Vector3(0.4, 0.4, 0.4);
  },

  sendControlPanelButton: function (label, callbackAction) {
    // Takes in a function from Vue to setup the scene when the start button is clicked
    const button = createControlPanelButton(label, callbackAction);
    // button.scaling = new Vector3(0.4, 0.4, 0.4);

    SceneWrapper.controlPanel.addControl(button);
    // SceneWrapper.manager.addControl(startButton);
    // startButton.linkToTransformNode = SceneWrapper.anchor;
    // startButton.position = new Vector3(0, 1.3, 2.2);
    // startButton.scaling = new Vector3(0.4, 0.4, 0.4);
  },

  sendItems: function (items) {
    // Check the spehre panel for any existing cards and remove them, then create new ones
    // Have to copy the array without reference to the original using the spread operator
    // Without doing this, foreach only iterates over half the array
    const panel = SceneWrapper.spherePanel;
    panel.blockLayout = true;
    if (panel.children?.length > 0) {
      const children = [...panel.children];
      children.forEach((child) => {
        panel.removeControl(child);
        child.dispose();
      });
    }
    items.forEach((item) => {
      const card = createCompactCard(item, SceneWrapper.detailTexture, SceneWrapper.scene);
      panel.addControl(card);
    });
    panel.blockLayout = false;
  }
};

export default SceneWrapper;
