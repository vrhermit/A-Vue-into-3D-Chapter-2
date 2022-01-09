import { MeshBuilder, StandardMaterial, Color3 } from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock, MeshButton3D } from "@babylonjs/gui";
import { brand } from "@/helpers/brand";

const createStartMenu = (startButtonCallback, scene) => {
  const cardMat = new StandardMaterial("start-card-mat", scene);
  cardMat.diffuseColor = new Color3.FromHexString(brand.dark3);
  cardMat.specularColor = new Color3(0.3, 0.3, 0.3);
  const card = MeshBuilder.CreateBox("start-card", { height: 0.8, width: 1.2, depth: 0.2 });
  card.material = cardMat;

  const plane = MeshBuilder.CreatePlane("start-plane", { height: 0.8, width: 1.2 }, scene);
  plane.position.z = -0.11;
  plane.parent = card;

  const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, 1.2 * 1024, 0.8 * 1024);

  const title = new TextBlock("start-text");
  title.text = "START";
  title.color = "white";
  title.fontSize = 96;
  title.fontStyle = "bold";
  title.height = "192px";
  advancedTexture.addControl(title);

  const startButton = new MeshButton3D(card, `start-button`);
  startButton.onPointerDownObservable.add(() => {
    startButtonCallback();
    startButton.dispose();
  });

  return startButton;
};

export default createStartMenu;
