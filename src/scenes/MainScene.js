import { Engine, Scene, ArcRotateCamera, Vector3, Matrix, TmpVectors, MeshBuilder, StandardMaterial, Color3, HemisphericLight, TransformNode } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, TextBlock, Image, MeshButton3D, GUI3DManager, SpherePanel, ToggleButton } from "@babylonjs/gui";
import { brand } from "@/helpers/brand";
import createLogo from "@/scenes/SceneHelpers/CreateLogo";

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
    createCamera(canvas);
    createTitle();
    createLogo(scene);
    const ground = createGround(); // used for WebXR teleportation

    // Defail card
    const sampleCard = createDetailCard();
    sampleCard.position = new Vector3(0, 0.9, 2);
    sampleCard.rotation.x = Math.PI / 5;

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

  // Call these functions from Vue to pass in the data or setup the scene
  setCompactCards: function (items) {
    populateSpherePanel(myScene.spherePanel, items);
  },
  addStartMenu: function (startMenuSetup) {
    // Takes in a function from Vue to setup the scene when the start button is clicked
    createStartMenu(startMenuSetup);
  }
};

const populateSpherePanel = (panel, items) => {
  // Have to copy the array without reference to the original using the spread operator
  // Without doing this, foreach only iterates over half the array
  if (panel.children.length > 0) {
    const children = [...panel.children];
    children.forEach((child) => {
      panel.removeControl(child);
    });
  }
  panel.blockLayout = true;
  items.forEach((item) => {
    panel.addControl(createCompactCard(item));
  });
  panel.blockLayout = false;
};

const createStartMenu = (startMenuSetup) => {
  const cardMat = new StandardMaterial("light2");
  cardMat.diffuseColor = new Color3.FromHexString(brand.dark3);
  cardMat.specularColor = new Color3(0.3, 0.3, 0.3);
  const card = MeshBuilder.CreateBox("detail-card", { height: 0.8, width: 1.2, depth: 0.2 });
  card.material = cardMat;

  const plane = MeshBuilder.CreatePlane("plane", { height: 0.8, width: 1.2 });
  plane.position.z = -0.11;
  plane.parent = card;

  const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, 1.2 * 1024, 0.8 * 1024);

  const title = new TextBlock("StartText");
  title.text = "START";
  title.color = "white";
  title.fontSize = 96;
  title.fontStyle = "bold";
  title.height = "192px";
  advancedTexture.addControl(title);

  card.scaling = new Vector3(0.4, 0.4, 0.4);
  const returnButton = new MeshButton3D(card, `start-button`);
  myScene.manager.addControl(returnButton);
  returnButton.linkToTransformNode = myScene.anchor;
  returnButton.onPointerDownObservable.add(() => {
    startMenuSetup();
    returnButton.dispose();
  });
  returnButton.position = new Vector3(0, 1.3, 2.2);

  return returnButton;
};

const createCompactCard = (item) => {
  const cardMat = new StandardMaterial("light2");
  cardMat.diffuseColor = new Color3.FromHexString(brand.dark3);
  cardMat.specularColor = new Color3(0.3, 0.3, 0.3);
  const card = MeshBuilder.CreateBox(`compact-card-${item.id}`, { height: 2.6, width: 2, depth: 0.2 });
  card.material = cardMat;

  const plane = MeshBuilder.CreatePlane("plane", { height: 2.6, width: 2 });
  plane.position.z = -0.11;
  plane.parent = card;

  const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, 2 * 1024, 2.6 * 1024);
  const panel = new StackPanel();
  panel.verticalAlignment = 0;
  advancedTexture.addControl(panel);

  const image = new Image("CompactImage", item.image);
  image.height = "2048px";
  image.width = "2048px";
  image.paddingTop = 40;
  image.paddingLeft = 40;
  image.paddingRight = 40;
  panel.addControl(image);

  const title = new TextBlock("CompactTitle");
  title.text = item.title;
  title.color = "white";
  title.fontSize = 144;
  title.fontStyle = "bold";
  title.textWrapping = true;
  title.height = "512px";
  title.textHorizontalAlignment = 2;
  title.textVerticalAlignment = 0;
  title.paddingTop = 40;
  title.paddingLeft = 40;
  title.paddingRight = 40;
  panel.addControl(title);

  card.scaling = new Vector3(0.25, 0.24, 0.24);
  const returnButton = new MeshButton3D(card, `compact-card-button-${item.id}`);
  returnButton.onPointerDownObservable.add(() => {
    const texture = myScene.detailTexture;
    console.log(texture.getControlByName("DetailTitle"));
    myScene.detailTexture.getControlByName("DetailTitle").text = item.title;
    myScene.detailTexture.getControlByName("DetailDescription").text = item.description;
    myScene.detailTexture.getControlByName("DetailImage").source = item.image;
  });
  return returnButton;
};

const createDetailCard = () => {
  const cardMat = new StandardMaterial("light2");
  cardMat.diffuseColor = new Color3.FromHexString(brand.dark3);
  cardMat.specularColor = new Color3(0.3, 0.3, 0.3);
  const card = MeshBuilder.CreateBox("detail-card", { height: 1.1, width: 3.1, depth: 0.2 });
  card.material = cardMat;

  const plane = MeshBuilder.CreatePlane("plane", { height: 1, width: 3 });
  plane.position.z = -0.11;
  plane.parent = card;

  const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, 3 * 1024, 1 * 1024);
  myScene.detailTexture = advancedTexture;

  const panel = new StackPanel("DetailPanel");
  panel.top = 0;
  panel.left = 512;
  panel.height = "1024px";
  panel.width = "2048px";
  panel.verticalAlignment = 0;
  advancedTexture.addControl(panel);

  const image = new Image("DetailImage", "https://extendedcollection.com/wp-content/uploads/2021/05/ec_logo_02.jpg");
  image.height = "1024px";
  image.width = "1024px";
  image.top = 0;
  image.left = -1024;
  image.paddingTop = 20;
  image.paddingBottom = 20;
  image.paddingLeft = 20;
  image.paddingRight = 20;
  advancedTexture.addControl(image);

  const title = new TextBlock("DetailTitle");
  title.text = "The Extended Collection Lab";
  title.textWrapping = 2;
  title.color = "white";
  title.fontSize = 96;
  title.fontStyle = "bold";
  title.height = "192px";
  title.textHorizontalAlignment = 0;
  title.textVerticalAlignment = 2;
  title.paddingLeft = 40;
  title.paddingRight = 40;
  panel.addControl(title);

  const description = new TextBlock("DetailDescription");
  description.fontFamily = "Tahoma, sans-serif";
  description.text = "Welcome to the Extended Collection Lab. Click on the start button to begin.";
  description.textWrapping = true;
  description.color = "white";
  description.fontSize = 64;
  description.height = "640px";
  description.textHorizontalAlignment = 0;
  description.textVerticalAlignment = 0;
  description.paddingTop = 40;
  description.paddingLeft = 40;
  description.paddingRight = 40;
  panel.addControl(description);

  const toggle = new ToggleButton("DetailToggle");
  console.log(toggle);
  toggle.height = "152px";
  toggle.width = "152px";
  toggle.left = -924;
  toggle.background = "#718096";
  toggle.isActive = false;
  toggle.onPointerClickObservable.add(() => {
    toggle.isActive = !toggle.isActive;
    toggle.background = toggle.isActive ? "#03c4a1" : "#718096";
  });
  panel.addControl(toggle);

  const tb = new TextBlock("FavToggleText", " ☆ ");
  tb.color = "white";
  tb.fontSize = 64;
  toggle.addControl(tb);

  card.scaling = new Vector3(0.4, 0.4, 0.4);
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

export default myScene;
