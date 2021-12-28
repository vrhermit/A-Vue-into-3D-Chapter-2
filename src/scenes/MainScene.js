import { Engine, Scene, ArcRotateCamera, Vector3, MeshBuilder, Mesh, StandardMaterial, Color3, HemisphericLight } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, TextBlock } from "@babylonjs/gui";

import { brand } from "@/helpers/brand";

const createScene = (canvas) => {
  // Create and customize the scene
  const engine = new Engine(canvas);
  const scene = new Scene(engine);
  createSceneEnvironment(scene);
  createSceneCamera(canvas);

  createSceneTitle();
  createLogo();
  createBlocks();

  // Add a ground plane to the scene. Used for WebXR teleportation
  const ground = MeshBuilder.CreateGround("ground", { height: 50, width: 60, subdivisions: 4 });
  const groundMat = new StandardMaterial("ground-material", scene);
  groundMat.alpha = 1;
  groundMat.diffuseColor = new Color3.FromHexString(brand.dark4);
  groundMat.specularColor = new Color3(0.2, 0.2, 0.2);
  ground.material = groundMat;

  // WebXRDefaultExperience
  const xrDefault = scene.createDefaultXRExperienceAsync({
    floorMeshes: [ground]
  });
  const xrHelper = xrDefault.baseExperience;
  console.info("webxr:", xrHelper);

  engine.runRenderLoop(() => {
    scene.render();
  });
};

const createSceneCamera = (canvas) => {
  // Add an ArcRotateCamera to the scene and attach it to the canvas
  // ArcRotateCamera is used to rotate the camera around the scene when not using WebXR
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0));
  camera.upperBetaLimit = Math.PI / 2.2;
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 50;
  camera.setPosition(new Vector3(0, 1.5, 0));
  camera.setTarget(new Vector3(0, 2, 4));
  camera.attachControl(canvas, true);
};

const createSceneEnvironment = (scene) => {
  // Customize the scene lighting and background color
  // new HemisphericLight("light", Vector3.Up(), scene);

  const ambientLight1 = new HemisphericLight("light", new Vector3(5, 5, 5));
  ambientLight1.intensity = 0.7;
  const ambientLight2 = new HemisphericLight("light", new Vector3(-5, 5, -5));
  ambientLight2.intensity = 0.7;
  scene.clearColor = Color3.FromHexString(brand.light1);
};

const createSceneTitle = () => {
  const plane = MeshBuilder.CreatePlane("plane", { height: 1, width: 1 });
  plane.position = new Vector3(0, 3, 6);
  plane.scaling = new Vector3(2, 2, 2);

  const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);

  const panel = new StackPanel();
  panel.verticalAlignment = 0;
  panel.height = "400px";

  advancedTexture.addControl(panel);

  const title = new TextBlock("title");
  title.text = "Extended Collection";
  title.fontSize = 96;
  title.height = "160px";
  panel.addControl(title);

  const subtitle = new TextBlock("title");
  subtitle.text = "Curating the Immersive Web";
  subtitle.fontSize = 64;
  subtitle.height = "120px";
  panel.addControl(subtitle);
};

const createLogo = () => {
  // Placeholder logo - need to put something together in Blender

  const group = new Mesh("logo-group");
  group.position = new Vector3(-1.5, 3.5, 6);
  group.rotation = new Vector3(0, 2, 0);
  group.scaling = new Vector3(0.5, 0.5, 0.5);
  makeBox("light2", group).position = new Vector3(0, 0, 0);
  makeBox("pink", group).position = new Vector3(0.5, 0, 0);
  makeBox("blue", group).position = new Vector3(0, 0.5, 0);
  makeBox("green", group).position = new Vector3(0, 0, 0.5);
};

const createBlocks = () => {
  // Just placing some blocks in the scene for fun

  const group = new Mesh("block-group");
  group.position = new Vector3(0, 0.5, 0);
  makeBox("light2", group).position = new Vector3(-2, 0, 4);
  makeBox("pink", group).position = new Vector3(2, 0, 4);
  makeBox("blue", group).position = new Vector3(-2, 0, -2);
  makeBox("green", group).position = new Vector3(2, 0, -2);
};

const makeBox = (colorName, parent) => {
  const mat = new StandardMaterial(`${colorName}-material`);
  mat.diffuseColor = new Color3.FromHexString(brand[colorName]);
  mat.specularColor = new Color3(0.2, 0.2, 0.2);
  const mesh = MeshBuilder.CreateBox(`${colorName}-box`, { size: 0.5 });
  mesh.material = mat;
  mesh.parent = parent;

  return mesh;
};

export default createScene;
