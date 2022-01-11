import { Engine, Scene, Vector3, TransformNode, StandardMaterial, Color3 } from "@babylonjs/core";
import { GUI3DManager } from "@babylonjs/gui";
import { createCamera, createEnvironment, createLogo, createTitle, createGround } from "@/scenes/SceneHelpers/Housekeeping";
import createStartMenu from "@/scenes/SceneHelpers/StartMenu";
import createDetailCard from "@/scenes/SceneHelpers/DetailCard";
import { createSpherePanel, populateCompactCard } from "@/scenes/SceneHelpers/CompactCard";
import { createBackdrop, createControlPanelButton, createStackPanel } from "@/scenes/SceneHelpers/ControlPanel";
import { brand } from "@/helpers/brand";

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
    createBackdrop();
    const ground = createGround(scene); // used for WebXR teleportation
    const cardMat = new StandardMaterial("compact-card-mat");
    cardMat.diffuseColor = new Color3.FromHexString(brand.dark3);
    cardMat.specularColor = new Color3(0.3, 0.3, 0.3);

    // Detail card
    createDetailCard(scene, cardMat);

    // Create the 3D GUI
    const manager = new GUI3DManager(scene);
    const anchor = new TransformNode("");
    anchor.position = new Vector3(0, 1.6, 0);

    // Sphere panel to hold the compact cards
    const panel = createSpherePanel(manager, anchor, cardMat);
    panel.position = new Vector3(0, 0.1, 0.5);

    // Stack panek to hold the control buttons
    const controlPanel = createStackPanel();
    controlPanel.linkToTransformNode(anchor);
    manager.addControl(controlPanel);
    controlPanel.position = new Vector3(0, 1.1, 2.1);
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
    const button = createControlPanelButton(label, callbackAction, SceneWrapper.scene);

    SceneWrapper.controlPanel.addControl(button);
  },

  populateCompactCards: function (items) {
    // Grap the sphere panel and and the scene and pass them on with the items
    populateCompactCard(items, SceneWrapper.spherePanel, SceneWrapper.scene);
  }
};

export default SceneWrapper;
