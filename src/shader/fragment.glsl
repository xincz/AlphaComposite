precision highp float;

// Varyings
varying vec2 vUV;

// Uniforms
uniform sampler2D u_frontTexture;
uniform sampler2D u_backTexture;
uniform sampler2D u_modelTexture;
uniform sampler2D u_armTexture;
uniform sampler2D u_neckTexture;
uniform sampler2D q1t;
uniform sampler2D q2t;


vec4 mask_create(vec4 mask_src) {
  vec4 mask = vec4(0.0);
  mask.xyz = mask_src.xyz;
  mask[3] = 1.0 - mask_src[2];
  if (mask_src[3] == 0.0) {
    mask = vec4(0.0);
    // mask[3] = 0.0;
  }
  return mask;
}


vec4 alpha_composite(vec4 mask, vec4 pattern) {
  vec4 color = vec4(0.0);
  float w_color = mask[3] / (mask[3] + pattern[3] * (1.0 - mask[3]));
  color.xyz = mask.xyz * w_color + pattern.xyz * (1.0 - w_color);
  color[3] = mask[3] + pattern[3] * (1.0 - mask[3]);
  return color;
}


void main() {
  vec2 uv = vUV;
  vec4 main = texture2D(u_frontTexture, uv).rgba;
  vec4 cloth = texture2D(u_backTexture, uv).rgba;
  vec4 model = texture2D(u_modelTexture, uv).rgba;
  vec4 arm = texture2D(u_armTexture, uv).rgba;
  vec4 neck = texture2D(u_neckTexture, uv).rgba;

  // Main
  vec4 mask = mask_create(main);
  vec4 main_color = alpha_composite(mask, cloth);
  main_color[3] = main[3];
  
  // Neck
  mask = mask_create(neck);
  vec4 neck_color = alpha_composite(mask, cloth);
  neck_color[3] = neck[3];

  // Shoulder
  mask = mask_create(arm);
  vec4 shoulder_color = alpha_composite(mask, cloth);
  shoulder_color[3] = arm[3];

  // Now shadowed cloth is completed
  vec4 n = vec4(0.0);
  n = alpha_composite(main_color, model);  // main
  n = alpha_composite(neck_color, n);  // neck
  n = alpha_composite(shoulder_color, n);  // neck

  gl_FragColor = n;
}