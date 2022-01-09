import { Vector3, MeshBuilder, StandardMaterial, Color3 } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, TextBlock, Image, ToggleButton } from "@babylonjs/gui";
import { brand } from "@/helpers/brand";

const createDetailCard = (scene) => {
  const cardMat = new StandardMaterial("detail-card-mat", scene);
  cardMat.diffuseColor = new Color3.FromHexString(brand.dark3);
  cardMat.specularColor = new Color3(0.3, 0.3, 0.3);
  const card = MeshBuilder.CreateBox("detail-card", { height: 1.1, width: 3.1, depth: 0.2 });
  card.material = cardMat;

  const plane = MeshBuilder.CreatePlane("detail-plane", { height: 1, width: 3 }, scene);
  plane.position.z = -0.11;
  plane.parent = card;

  const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, 3 * 1024, 1 * 1024);
  //   myScene.detailTexture = advancedTexture;

  const panel = new StackPanel("detail-panel");
  panel.top = 0;
  panel.left = 512;
  panel.height = "1024px";
  panel.width = "2048px";
  panel.verticalAlignment = 0;
  advancedTexture.addControl(panel);

  const image = new Image("detail-image", "https://extendedcollection.com/wp-content/uploads/2021/05/ec_logo_02.jpg");
  image.height = "1024px";
  image.width = "1024px";
  image.top = 0;
  image.left = -1024;
  image.paddingTop = 20;
  image.paddingBottom = 20;
  image.paddingLeft = 20;
  image.paddingRight = 20;
  advancedTexture.addControl(image);

  const title = new TextBlock("detail-title");
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

  const description = new TextBlock("detail-description");
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

  const toggle = new ToggleButton("detail-fav-toggle");
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

  const tb = new TextBlock("detail-fav-text", " ☆ ");
  tb.color = "white";
  tb.fontSize = 64;
  toggle.addControl(tb);

  card.scaling = new Vector3(0.4, 0.4, 0.4);
  card.position = new Vector3(0, 0.9, 2);
  card.rotation.x = Math.PI / 5;

  // Return the advanced texture for now. Will be removed later.
  return advancedTexture;
};

export default createDetailCard;
