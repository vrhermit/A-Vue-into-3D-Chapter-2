import { Engine, Scene, ArcRotateCamera, Vector3, MeshBuilder, Mesh, StandardMaterial, Color3, HemisphericLight, TransformNode } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, TextBlock, Image, Button, MeshButton3D, GUI3DManager, SpherePanel } from "@babylonjs/gui";
import { brand } from "@/helpers/brand";

const createScene = (canvas) => {
  // Create and customize the scene
  const engine = new Engine(canvas);
  const scene = new Scene(engine);
  createEnvironment(scene);
  createCamera(canvas);
  createTitle();
  createLogo();
  createBlocks();
  const ground = createGround(); // used for WebXR teleportation

  var anchor = new TransformNode("");
  anchor.position = new Vector3(0, 1, 2);

  // Create the 3D UI manager
  var manager = new GUI3DManager(scene);

  var panel = new SpherePanel();
  panel.margin = 0.05;

  manager.addControl(panel);
  panel.linkToTransformNode(anchor);
  panel.position.z = -1.5;
  panel.rows = 3;

  // Let's add some buttons!
  var addButton = function () {
    var button = createCompactCard();
    panel.addControl(button);

    // button.text = "Button #" + panel.children.length;
  };

  panel.blockLayout = true;
  for (var index = 0; index < 12; index++) {
    addButton();
  }
  panel.blockLayout = false;

  // Placeholder card
  const sampleCard = createItemCard();
  sampleCard.position = new Vector3(-1, 1.4, 4);
  // const compactCard = createCompactCard();
  // compactCard.position = new Vector3(1, 1.4, 4);
  // console.log(sampleCard);
  // console.log(compactCard);

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

const createCompactCard = () => {
  const cardMat = new StandardMaterial("light2");
  cardMat.diffuseColor = new Color3.FromHexString(brand.dark3);
  cardMat.specularColor = new Color3(0.3, 0.3, 0.3);
  const card = MeshBuilder.CreateBox("detail-card", { height: 2.2, width: 2, depth: 0.2 });
  card.material = cardMat;

  const plane = MeshBuilder.CreatePlane("plane", { height: 2.2, width: 2 });
  plane.position.z = -0.11;
  plane.parent = card;

  const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, 2 * 512, 2.4 * 512);

  const panel = new StackPanel();
  panel.verticalAlignment = 0;
  advancedTexture.addControl(panel);

  const image = new Image("image", "https://extendedcollection.com/wp-content/uploads/2021/05/ec_logo_02.jpg");
  image.height = "1024px";
  image.width = "1024px";
  image.paddingTop = 40;
  image.paddingLeft = 40;
  image.paddingRight = 40;
  panel.addControl(image);

  const title = new TextBlock("title");
  title.text = "Title of a Library Item";
  title.color = "white";
  title.fontSize = 48;
  title.height = "120px";
  title.textHorizontalAlignment = 0;
  title.textVerticalAlignment = 1;
  title.paddingTop = 40;
  title.paddingLeft = 40;
  title.paddingRight = 40;
  panel.addControl(title);

  // Some hardcoded transform values – will be replaced
  card.scaling = new Vector3(0.2, 0.2, 0.2);
  // card.position = new Vector3(0, 1.4, 4);

  // card.scaling = new Vector3(0.8, 0.8, 0.8);
  // card.position = new Vector3(1, 1.8, 4);

  const returnButton = new MeshButton3D(card, "pushButton");
  // returnButton.scaling = new Vector3(0.8, 0.8, 0.8);
  // returnButton.position = new Vector3(1, 1.8, 4);

  return returnButton;
};

const createItemCard = () => {
  const cardMat = new StandardMaterial("light2");
  cardMat.diffuseColor = new Color3.FromHexString(brand.dark3);
  cardMat.specularColor = new Color3(0.3, 0.3, 0.3);
  const card = MeshBuilder.CreateBox("detail-card", { height: 3.4, width: 2, depth: 0.2 });
  card.material = cardMat;

  const plane = MeshBuilder.CreatePlane("plane", { height: 3.4, width: 2 });
  plane.position.z = -0.11;
  plane.parent = card;

  const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, 2 * 512, 3.4 * 512);

  const panel = new StackPanel();
  panel.verticalAlignment = 0;
  advancedTexture.addControl(panel);

  const image = new Image("image", "https://extendedcollection.com/wp-content/uploads/2021/05/ec_logo_02.jpg");
  image.height = "1024px";
  image.width = "1024px";
  image.paddingTop = 40;
  image.paddingLeft = 40;
  image.paddingRight = 40;
  panel.addControl(image);

  const title = new TextBlock("title");
  title.text = "Title of a Library Item";
  title.color = "white";
  title.fontSize = 48;
  title.height = "120px";
  title.textHorizontalAlignment = 0;
  title.textVerticalAlignment = 0;
  title.paddingTop = 40;
  title.paddingLeft = 40;
  title.paddingRight = 40;
  panel.addControl(title);

  const description = new TextBlock("description");
  description.fontFamily = "Tahoma, sans-serif";
  description.text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  description.textWrapping = true;
  description.color = "white";
  description.fontSize = 36;
  description.height = "440px";
  description.textHorizontalAlignment = 0;
  description.textVerticalAlignment = 0;
  description.paddingTop = 20;
  description.paddingLeft = 40;
  description.paddingRight = 40;
  panel.addControl(description);

  const button1 = Button.CreateSimpleButton("but1", "Toggle Favorite");
  button1.height = "120px";
  button1.color = "white";
  button1.background = brand.pink;
  button1.fontSize = 50;
  button1.paddingLeft = 40;
  button1.paddingRight = 40;
  button1.onPointerUpObservable.add(function () {
    console.log("button1 clicked");
  });
  button1.verticalAlignment = 1;
  panel.addControl(button1);

  // Some hardcoded transform values – will be replaced
  card.scaling = new Vector3(0.2, 0.2, 0.2);
  // card.position = new Vector3(0, 1.4, 4);

  // card.scaling = new Vector3(0.8, 0.8, 0.8);
  // card.position = new Vector3(-1, 1.8, 4);

  return card;
};

const createCamera = (canvas) => {
  // Add an ArcRotateCamera to the scene and attach it to the canvas
  // ArcRotateCamera is used to rotate the camera around the scene when not using WebXR
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0));
  camera.wheelDeltaPercentage = 0.01;
  camera.upperBetaLimit = Math.PI / 1.5;
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 50;
  camera.setPosition(new Vector3(0, 1.5, 0));
  camera.setTarget(new Vector3(0, 2, 4));
  camera.attachControl(canvas, true);
};

const createEnvironment = (scene) => {
  // Customize the scene lighting and background color
  const ambientLight1 = new HemisphericLight("light", new Vector3(5, 5, 5));
  ambientLight1.intensity = 0.7;
  const ambientLight2 = new HemisphericLight("light", new Vector3(-5, 5, -5));
  ambientLight2.intensity = 0.7;
  scene.clearColor = Color3.FromHexString(brand.light2);
};

const createGround = () => {
  // Add a ground plane to the scene. Used for WebXR teleportation
  const ground = MeshBuilder.CreateGround("ground", { height: 50, width: 60, subdivisions: 4 });
  const groundMat = new StandardMaterial("ground-material");
  groundMat.alpha = 1;
  groundMat.diffuseColor = new Color3.FromHexString(brand.dark4);
  groundMat.specularColor = new Color3(0.2, 0.2, 0.2);
  ground.material = groundMat;
  return ground;
};

const createTitle = () => {
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
  // Create a colored box from using a string to get the color from the Brand object
  const mat = new StandardMaterial(`${colorName}-material`);
  mat.diffuseColor = new Color3.FromHexString(brand[colorName]);
  mat.specularColor = new Color3(0.1, 0.1, 0.1);
  const mesh = MeshBuilder.CreateBox(`${colorName}-box`, { size: 0.5 });
  mesh.material = mat;
  mesh.parent = parent;
  return mesh;
};

export default createScene;
