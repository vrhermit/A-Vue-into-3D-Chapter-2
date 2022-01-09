import { Vector3, MeshBuilder, Mesh, StandardMaterial, Color3 } from "@babylonjs/core";
import { brand } from "@/helpers/brand";

// A temporary function to create a logo
// TODO: Replace this with a real 3D logo
const createLogo = (scene) => {
  // Placeholder logo - need to put something together in Blender
  const group = new Mesh("logo-group");
  group.position = new Vector3(-1.5, 3.5, 6);
  group.rotation = new Vector3(0, 2, 0);
  group.scaling = new Vector3(0.5, 0.5, 0.5);
  makeBox("light2", group, scene).position = new Vector3(0, 0, 0);
  makeBox("pink", group, scene).position = new Vector3(0.5, 0, 0);
  makeBox("blue", group, scene).position = new Vector3(0, 0.5, 0);
  makeBox("green", group, scene).position = new Vector3(0, 0, 0.5);
};

const makeBox = (colorName, parent, scene) => {
  // Create a colored box from using a string to get the color from the Brand object
  const mat = new StandardMaterial(`${colorName}-material`, scene);
  mat.diffuseColor = new Color3.FromHexString(brand[colorName]);
  mat.specularColor = new Color3(0.1, 0.1, 0.1);
  const mesh = MeshBuilder.CreateBox(`${colorName}-box`, { size: 0.5 }, scene);
  mesh.material = mat;
  mesh.parent = parent;
  return mesh;
};

export default createLogo;
