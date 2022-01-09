import { Vector3, MeshBuilder, StandardMaterial, Color3 } from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock, MeshButton3D } from "@babylonjs/gui";
import { brand } from "@/helpers/brand";

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
  returnButton.onPointerDownObservable.add(() => {
    startMenuSetup();
    returnButton.dispose();
  });
  //   returnButton.position = new Vector3(0, 1.3, 2.2);

  return returnButton;
};

export default createStartMenu;
