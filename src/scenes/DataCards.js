import { Engine, Scene, FreeCamera, Vector3, MeshBuilder, StandardMaterial, Color3, HemisphericLight } from "@babylonjs/core";
import { brand } from "@/helpers/brand";
const createScene = (canvas) => {
  const engine = new Engine(canvas);
  const scene = new Scene(engine);
  scene.clearColor = Color3.FromHexString(brand.light1);

  const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
  camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, true);

  new HemisphericLight("light", Vector3.Up(), scene);

  const box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
  const material = new StandardMaterial("box-material", scene);
  material.diffuseColor = Color3.Blue();
  box.material = material;

  // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
  const ground = MeshBuilder.CreateGround("ground", { height: 10, width: 20, subdivisions: 4 });
  const groundMat = new StandardMaterial("ground-material", scene);
  groundMat.alpha = 1;
  groundMat.diffuseColor = new Color3.FromHexString(brand.dark4);
  ground.material = groundMat;

  const xrDefault = scene.createDefaultXRExperienceAsync({
    floorMeshes: [ground]
  }); // WebXRDefaultExperience
  const xrHelper = xrDefault.baseExperience;
  console.log(xrHelper);

  engine.runRenderLoop(() => {
    scene.render();
  });
};

export { createScene };
