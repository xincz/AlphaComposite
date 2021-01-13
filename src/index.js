import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial";
import { Effect } from "@babylonjs/core/Materials/effect";
import { PlaneBuilder } from "@babylonjs/core/Meshes/Builders/planeBuilder";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
// import { ImageFilter } from "@babylonjs/controls/imageFilter";

class App {
  constructor() {
    this.canvas = null;
    this.engine = null;
    this.scene = null;
    this.time = 0;
  }

  init() {
    this.setup();
    this.addListeners();
  }

  setup() {
    this.canvas = document.querySelector("#app");
    this.engine = new Engine(this.canvas, true, null, true);
    this.scene = new Scene(this.engine);

    // Adding the vertex and fragment shaders to the Babylon's ShaderStore
    Effect.ShadersStore["customVertexShader"] = require("./shader/vertex.glsl");
    Effect.ShadersStore[
      "customFragmentShader"
    ] = require("./shader/fragment.glsl");

    // Creating the shader material using the `custom` shaders we added to the ShaderStore
    const planeMaterial = new ShaderMaterial("PlaneMaterial", this.scene, {
      vertex: "custom",
      fragment: "custom",
      attributes: ["position", "normal", "uv"],
      uniforms: ["worldViewProjection"]
    });
    planeMaterial.backFaceCulling = false;

    // Creating a basic plane and adding the shader material to it
    const plane = new PlaneBuilder.CreatePlane(
      "Plane",
      { width: 1, height: 1 },
      this.scene
    );
    plane.scaling = new Vector3(10, (3 / 2) * 10, 1); // ratio
    plane.material = planeMaterial;

    // Passing the images to the fragment shader as a `Texture`
    // const frontTexture = new Texture("src/images/zz.png");
    // const backTexture = new Texture("src/images/xx.png");
    const frontTexture = new Texture("src/images/piece_9.png");
    const armTexture = new Texture("src/images/piece_5.png");
    const neckTexture = new Texture("src/images/piece_0.png");
    const backTexture = new Texture("src/images/rrr.png");
    // const backTexture = new Texture("src/images/03.png");
    const modelTexture = new Texture("src/images/xx.png");
    const q1t = new Texture("qq1.png");
    const q2t = new Texture("qq2.png");
    plane.material.setTexture("u_frontTexture", frontTexture);
    plane.material.setTexture("u_backTexture", backTexture);
    plane.material.setTexture("u_modelTexture", modelTexture);
    plane.material.setTexture("u_armTexture", armTexture);
    plane.material.setTexture("u_neckTexture", neckTexture);
    plane.material.setTexture("q1t", q1t);
    plane.material.setTexture("q2t", q2t);

    // Camera
    const camera = new ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      Math.PI / 2,
      10,
      Vector3.Zero(),
      this.scene
    );
    // camera.attachControl(this.canvas);

    this.engine.runRenderLoop(() => this.scene.render());

    this.scene.registerBeforeRender(() => {
      plane.material.setFloat("uPlaneRatio", plane.scaling.x / plane.scaling.y);
      plane.material.setFloat("uStepH", 900);
      plane.material.setFloat("uStepW", 600);

      this.time++;
      plane.material.setFloat("u_time", this.time);
    });
  }

  addListeners() {
    window.addEventListener("resize", () => this.engine.resize());
  }
}

const app = new App();
app.init();
