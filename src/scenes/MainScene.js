import { Engine, Scene, Vector3, Matrix, TmpVectors, MeshBuilder, StandardMaterial, Color3, TransformNode } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, TextBlock, Image, GUI3DManager, SpherePanel, ToggleButton } from "@babylonjs/gui";
import { brand } from "@/helpers/brand";
import { createCamera, createEnvironment, createLogo, createTitle, createGround } from "@/scenes/SceneHelpers/Housekeeping";
import createStartMenu from "@/scenes/SceneHelpers/StartMenu";
import createCompactCard from "@/scenes/SceneHelpers/CompactCard";

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

export default myScene;
