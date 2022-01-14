import { ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Mesh, StandardMaterial, Color3 } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, TextBlock } from "@babylonjs/gui";
import { brand } from "../../helpers/brand";

const createCamera = (canvas, scene) => {
  // Add an ArcRotateCamera to the scene and attach it to the canvas
  // ArcRotateCamera is used to rotate the camera around the scene when not using WebXR
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0), scene);
  camera.wheelDeltaPercentage = 0.01;
  camera.upperBetaLimit = Math.PI / 1.5;
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 50;
  camera.setPosition(new Vector3(0, 1.5, -2));
  camera.setTarget(new Vector3(0, 2, 4));
  camera.attachControl(canvas, true);
};

const createEnvironment = (scene) => {
  // Customize the scene lighting and background color
  const ambientLight1 = new HemisphericLight("light-01", new Vector3(5, 5, 5), scene);
  ambientLight1.intensity = 0.7;
  const ambientLight2 = new HemisphericLight("light-02", new Vector3(-5, 5, -5), scene);
  ambientLight2.intensity = 0.7;
  scene.clearColor = Color3.FromHexString(brand.light2);
};

// A temporary function to create a logo
// TODO: Replace this with a real 3D logo
const createLogo = (scene) => {
  // Placeholder logo - need to put something together in Blender
  const group = new Mesh("logo-group");
  group.position = new Vector3(-1, 2.5, 3);
  group.rotation = new Vector3(0, 2, 0);
  group.scaling = new Vector3(0.3, 0.3, 0.3);
  makeBox("light2", group, scene).position = new Vector3(0, 0, 0);
  makeBox("pink", group, scene).position = new Vector3(0.5, 0, 0);
  makeBox("blue", group, scene).position = new Vector3(0, 0.5, 0);
  makeBox("green", group, scene).position = new Vector3(0, 0, 0.5);
};

const makeBox = (colorName, parent, scene) => {
  // Create a colored box from using a string to get the color from the Brand object
  const mat = new StandardMaterial(`${colorName}-material`, scene);
  mat.diffuseColor = new Color3.FromHexString(brand[colorName]);
  mat.specularColor = new Color3(0.1, 0.1, 0.1);
  const mesh = MeshBuilder.CreateBox(`${colorName}-box`, { size: 0.5 }, scene);
  mesh.material = mat;
  mesh.parent = parent;
  return mesh;
};

const createTitle = (scene) => {
  const plane = MeshBuilder.CreatePlane("scene-title-plane", { height: 1, width: 1 }, scene);
  plane.position = new Vector3(0, 2, 3);
  plane.scaling = new Vector3(1.5, 1.5, 1.5);

  const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);

  const panel = new StackPanel();
  panel.verticalAlignment = 0;
  panel.height = "400px";

  advancedTexture.addControl(panel);

  const title = new TextBlock("scene-title");
  title.text = "Extended Collection";
  title.fontSize = 96;
  title.height = "160px";
  panel.addControl(title);

  const subtitle = new TextBlock("scene-subtitle");
  subtitle.text = "Curating the Immersive Web";
  subtitle.fontSize = 64;
  subtitle.height = "120px";
  panel.addControl(subtitle);
};

const createGround = (scene) => {
  // Add a ground plane to the scene. Used for WebXR teleportation
  const ground = MeshBuilder.CreateGround("ground", { height: 50, width: 60, subdivisions: 4 }, scene);
  const groundMat = new StandardMaterial("ground-material", scene);
  groundMat.alpha = 1;
  groundMat.diffuseColor = new Color3.FromHexString(brand.dark4);
  groundMat.specularColor = new Color3(0.2, 0.2, 0.2);
  ground.material = groundMat;
  return ground;
};

export { createCamera, createEnvironment, createLogo, createTitle, createGround };
