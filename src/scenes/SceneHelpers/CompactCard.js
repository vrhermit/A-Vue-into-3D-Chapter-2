import { MeshBuilder, StandardMaterial, Color3, Vector3 } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, TextBlock, Image, MeshButton3D } from "@babylonjs/gui";
import { brand } from "@/helpers/brand";

const createCompactCard = (item, detailTexture, scene) => {
  // TODO: No need to create a material for every card.
  const cardMat = new StandardMaterial("compact-card-mat", scene);
  cardMat.diffuseColor = new Color3.FromHexString(brand.dark3);
  cardMat.specularColor = new Color3(0.3, 0.3, 0.3);
  const card = MeshBuilder.CreateBox(`compact-card-${item.id}`, { height: 2.6, width: 2, depth: 0.2 }, scene);
  card.material = cardMat;

  const plane = MeshBuilder.CreatePlane("compact-plane", { height: 2.6, width: 2 }, scene);
  plane.position.z = -0.11;
  plane.parent = card;

  const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, 2 * 1024, 2.6 * 1024);
  const panel = new StackPanel();
  panel.verticalAlignment = 0;
  advancedTexture.addControl(panel);

  const image = new Image("compact-image", item.image);
  image.height = "2048px";
  image.width = "2048px";
  image.paddingTop = 40;
  image.paddingLeft = 40;
  image.paddingRight = 40;
  panel.addControl(image);

  const title = new TextBlock("compact-title");
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

  card.scaling = new Vector3(0.25, 0.25, 0.25);
  const returnButton = new MeshButton3D(card, `compact-card-button-${item.id}`);
  returnButton.onPointerDownObservable.add(() => {
    // The Advanced Dynamic Texture that that main detail card uses to draw UI
    const texture = detailTexture;
    // Get controls by name/string and update them with data from the item
    texture.getControlByName("detail-title").text = item.title;
    texture.getControlByName("detail-description").text = item.description;
    texture.getControlByName("detail-image").source = item.image;
  });
  return returnButton;
};

export default createCompactCard;
