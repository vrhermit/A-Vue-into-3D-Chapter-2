import { StandardMaterial, Color3, MeshBuilder, Vector3 } from "@babylonjs/core";
import { StackPanel3D, TextBlock, AdvancedDynamicTexture, MeshButton3D } from "@babylonjs/gui";
import { brand } from "@/helpers/brand";

const createControlPanelButton = (label, callbackAction, scene) => {
  const cardMat = new StandardMaterial("control-card-mat", scene);
  cardMat.diffuseColor = new Color3.FromHexString(brand.dark4);
  cardMat.specularColor = new Color3(0.3, 0.3, 0.3);
  const card = MeshBuilder.CreateBox(`control-card-${label}`, { height: 0.8, width: 1.2, depth: 0.2 });
  card.material = cardMat;
  card.isVisible = label == "" ? false : true;

  const plane = MeshBuilder.CreatePlane(`control-plane-${label}`, { height: 0.8, width: 1.2 }, scene);
  plane.position.z = -0.11;
  plane.parent = card;

  const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, 1.2 * 1024, 0.8 * 1024);

  const title = new TextBlock(`control-text-${label}`);
  title.text = label;
  title.color = "white";
  title.fontSize = 360;
  title.fontStyle = "bold";
  advancedTexture.addControl(title);

  const button = new MeshButton3D(card, `control-button-${label}`);
  button.onPointerDownObservable.add(() => {
    callbackAction();
  });

  return button;
};

const createStackPanel = () => {
  const panel = new StackPanel3D("control-panel-container");
  panel.isVertical = false;
  return panel;
};

const createBackdrop = (scene) => {
  const cardMat = new StandardMaterial("control-card-mat", scene);
  cardMat.diffuseColor = new Color3.FromHexString(brand.dark3);
  cardMat.specularColor = new Color3(0.3, 0.3, 0.3);
  const card = MeshBuilder.CreateBox("start-card", { height: 0.1, width: 0.93, depth: 0.05 });
  card.position = new Vector3(0, 1.1, 2.12);
  card.material = cardMat;
};

export { createBackdrop, createControlPanelButton, createStackPanel };
