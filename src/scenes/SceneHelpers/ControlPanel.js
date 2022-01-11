// import { Vector3 } from "@babylonjs/core";
import { StackPanel3D, TextBlock, Button3D } from "@babylonjs/gui";
// import { brand } from "@/helpers/brand";

const createControlPanelButton = (label, callbackAction) => {
  var button = new Button3D("reset");
  //   button.scaling = new Vector3(0.4, 0.4, 0.4);

  var text = new TextBlock();
  text.text = label;
  text.color = "white";
  text.fontSize = 24;
  button.content = text;
  button.onPointerDownObservable.add(() => {
    callbackAction();
  });
  return button;
};

const createStackPanel = () => {
  const panel = new StackPanel3D("control-panel-container");
  panel.isVertical = false;
  //   panel.margin = 0.05;
  //   panel.columns = 6;
  // Adapted from here: https://github.com/BabylonJS/Babylon.js/blob/master/gui/src/3D/controls/spherePanel.ts#L60-L69
  // TODO: Check to see if there is a new way to do this in 5.0
  //   panel._sphericalMapping = function (source) {
  //     let newPos = new Vector3(0, 0, this._radius);

  //     let xAngle = source.y / this._radius;
  //     let yAngle = source.x / this._radius;

  //     Matrix.RotationYawPitchRollToRef(yAngle, xAngle, 0, TmpVectors.Matrix[0]);

  //     return Vector3.TransformNormal(newPos, TmpVectors.Matrix[0]);
  //   };

  return panel;
};

export { createControlPanelButton, createStackPanel };
