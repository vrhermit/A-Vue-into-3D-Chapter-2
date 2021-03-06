import { MeshBuilder, Vector3, Matrix, TmpVectors } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, TextBlock, Image, MeshButton3D, SpherePanel } from "@babylonjs/gui";

const createCompactCard = (index, cardMat) => {
  const card = MeshBuilder.CreateBox(`compact-card-${index}`, { height: 2.8, width: 2, depth: 0.2 });
  card.material = cardMat;

  const plane = MeshBuilder.CreatePlane("compact-plane", { height: 2.8, width: 2 });
  plane.position.z = -0.11;
  plane.parent = card;

  const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, 2 * 1024, 2.8 * 1024);
  advancedTexture.name = `compact-card-texture-${index}`;
  const panel = new StackPanel();
  panel.verticalAlignment = 0;
  advancedTexture.addControl(panel);

  const image = new Image("compact-image");
  image.height = "2048px";
  image.width = "2048px";
  image.paddingTop = 40;
  image.paddingLeft = 40;
  image.paddingRight = 40;
  panel.addControl(image);

  const title = new TextBlock("compact-title");
  title.text = "Title";
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

  const fav = new TextBlock("compact-fav");
  fav.text = " ★ ";
  fav.color = "white";
  fav.fontSize = 128;
  fav.fontStyle = "bold";
  fav.height = "256px";
  fav.textHorizontalAlignment = 2;
  fav.textVerticalAlignment = 0;
  fav.isVisible = false;
  panel.addControl(fav);

  // const tb = new TextBlock(`compact-fav-${index}`, " ☆ ");
  // tb.color = "white";
  // tb.fontSize = 64;
  // panel.addControl(tb);

  card.scaling = new Vector3(0.2, 0.2, 0.2);
  const button3D = new MeshButton3D(card, `compact-card-button-${index}`);
  return button3D;
};

const populateCompactCard = (items, toggleCallback, panel, scene) => {
  for (let i = 0; i < 12; i++) {
    const compactTexture = scene.getTextureByName(`compact-card-texture-${i}`);
    const button3D = panel.children[i];
    const item = items[i];
    if (item) {
      button3D.isVisible = true;
      compactTexture.getControlByName("compact-title").text = item.title;
      compactTexture.getControlByName("compact-image").source = item.image;
      // Save this as a function that we can pass into the detail card button
      const toggleFavCompact = (value) => {
        compactTexture.getControlByName("compact-fav").isVisible = value;
      };
      toggleFavCompact(item.isFavorite);

      button3D.onPointerDownObservable.add(() => {
        // The Advanced Dynamic Texture that that main detail card uses to draw UI
        const texture = scene.getTextureByName("detail-texture");

        // Get controls by name/string and update them with data from the item
        texture.getControlByName("detail-title").text = item.title;
        texture.getControlByName("detail-description").text = item.description;
        texture.getControlByName("detail-image").source = item.image;
        const toggle = texture.getControlByName("detail-fav-toggle");
        toggle.isVisible = true;
        toggle.isActive = item.isFavorite;
        toggle.background = item.isFavorite ? "#03c4a1" : "#718096";
        toggle.onPointerClickObservable.clear();
        toggle.onPointerClickObservable.add(() => {
          toggle.isActive = !toggle.isActive;
          toggle.background = toggle.isActive ? "#03c4a1" : "#718096";
          toggleCallback(item, toggle.isActive);
          toggleFavCompact(toggle.isActive);
        });
      });
    } else {
      button3D.isVisible = false;
    }
  }
};

const createSpherePanel = (manager, anchor, cardMat) => {
  const panel = new SpherePanel("compact-panel-container");
  manager.addControl(panel);
  panel.linkToTransformNode(anchor);
  panel.margin = 0.025;
  panel.columns = 6;
  panel.radius = 2.5;

  // Adapted from here: https://github.com/BabylonJS/Babylon.js/blob/master/gui/src/3D/controls/spherePanel.ts#L60-L69
  // TODO: Check to see if there is a new way to do this in 5.0
  panel._sphericalMapping = function (source) {
    let newPos = new Vector3(0, 0, this._radius);

    let xAngle = source.y / this._radius;
    let yAngle = source.x / this._radius;

    Matrix.RotationYawPitchRollToRef(yAngle, xAngle, 0, TmpVectors.Matrix[0]);

    return Vector3.TransformNormal(newPos, TmpVectors.Matrix[0]);
  };

  panel.blockLayout = true;
  for (let i = 0; i < 12; i++) {
    const card = createCompactCard(i, cardMat);
    panel.addControl(card);
  }
  panel.blockLayout = false;
  return panel;
};

export { createCompactCard, populateCompactCard, createSpherePanel };
