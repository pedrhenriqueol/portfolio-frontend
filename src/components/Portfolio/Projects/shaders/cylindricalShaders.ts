/**
 * GLSL Shaders para o Showcase Cilíndrico WebGL (Jesper Landberg / Lusion)
 */

export const cylindricalVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

uniform float uVelocity;
uniform float uProgress;
uniform float uIndex;

void main() {
    vUv = uv;
    vec3 pos = position;

    // 1. Deformação Elástica nos vértices no eixo Z vinculada à velocidade instantânea
    float wave = sin(uv.x * 3.14159265);
    pos.z += wave * uVelocity * 0.45;

    // 2. Curvatura côncava contínua da malha (arco cilíndrico aberto)
    float curve = pow(uv.x - 0.5, 2.0) * 0.32;
    pos.z -= curve;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vec4 viewPos = viewMatrix * worldPos;
    vec4 projectedPos = projectionMatrix * viewPos;

    vWorldPosition = worldPos.xyz;
    vPosition = viewPos.xyz;
    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectedPos;
}
`;

export const cylindricalFragmentShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uVelocity;
uniform float uOpacity;

void main() {
    vec2 uv = vUv;

    // 1. Aberração Cromática ativada estritamente durante picos de velocidade de rotação
    float speed = abs(uVelocity);
    float aberration = clamp(speed * 0.025, 0.0, 0.012);

    vec4 colorR = texture2D(uTexture, uv + vec2(aberration, 0.0));
    vec4 colorG = texture2D(uTexture, uv);
    vec4 colorB = texture2D(uTexture, uv - vec2(aberration, 0.0));
    vec4 baseColor = vec4(colorR.r, colorG.g, colorB.b, (colorR.a + colorG.a + colorB.a) / 3.0);

    // 2. Reflexo Especular em tempo real baseado nas coordenadas uMouse (sensação de vidro tátil)
    vec3 lightPos = vec3(uMouse.x * 2.5, uMouse.y * 2.5, 2.0);
    vec3 lightDir = normalize(lightPos - vPosition);
    vec3 viewDir = normalize(-vPosition);
    vec3 halfVector = normalize(lightDir + viewDir);

    float NdotH = max(dot(vNormal, halfVector), 0.0);
    float specular = pow(NdotH, 32.0) * 0.22;

    // 3. Fade suave de saída nas bordas do canvas (elimina cortes retos na curvatura 3D)
    float fadeX = smoothstep(0.0, 0.06, uv.x) * (1.0 - smoothstep(0.94, 1.0, uv.x));
    float fadeY = smoothstep(0.0, 0.06, uv.y) * (1.0 - smoothstep(0.94, 1.0, uv.y));
    float edgeMask = fadeX * fadeY;

    // Brilho sutil de vidro
    vec3 finalRgb = baseColor.rgb + vec3(specular);

    gl_FragColor = vec4(finalRgb, baseColor.a * edgeMask * uOpacity);
}
`;
