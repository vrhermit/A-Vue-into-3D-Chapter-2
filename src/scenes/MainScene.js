import { Engine, Scene, ArcRotateCamera, Vector3, MeshBuilder, StandardMaterial, Color3, HemisphericLight } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, TextBlock } from "@babylonjs/gui";

import { brand } from "@/helpers/brand";
const createScene = (canvas) => {
  // Create and customize the scene
  const engine = new Engine(canvas);
  const scene = new Scene(engine);
  createSceneEnvironment(scene);
  createSceneCamera(canvas);

  // Placeholder box - we will use the arc rotate camera to move around this object/position
  const box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
  const material = new StandardMaterial("box-material", scene);
  material.diffuseColor = new Color3.FromHexString(brand.pink);
  box.material = material;
  box.position = new Vector3(0, 2, 4);
  createSceneTitle();

  // Add a ground plane to the scene. Used for WebXR teleportation
  const ground = MeshBuilder.CreateGround("ground", { height: 50, width: 60, subdivisions: 4 });
  const groundMat = new StandardMaterial("ground-material", scene);
  groundMat.alpha = 1;
  groundMat.diffuseColor = new Color3.FromHexString(brand.dark4);
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
  new HemisphericLight("light", Vector3.Up(), scene);
  scene.clearColor = Color3.FromHexString(brand.light1);
};

function createSceneTitle() {
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
  title.color = "black";
  title.fontSize = 96;
  title.height = "160px";
  title.textHorizontalAlignment = 0;
  title.textVerticalAlignment = 0;
  title.paddingTop = 40;
  title.paddingLeft = 40;
  title.paddingRight = 40;
  panel.addControl(title);

  const subtitle = new TextBlock("title");
  subtitle.text = "Curating the Immersive Web";
  subtitle.color = "black";
  subtitle.fontSize = 64;
  subtitle.height = "120px";
  subtitle.textHorizontalAlignment = 0;
  subtitle.textVerticalAlignment = 0;
  subtitle.paddingTop = 40;
  subtitle.paddingLeft = 40;
  subtitle.paddingRight = 40;
  panel.addControl(subtitle);
}

// export { createScene };
export default createScene;
