import { RenderContext } from '@/engine/core/render-context';
import { FragmentShader } from './fragment-shader';
import { Vertex } from '@/engine/core/data/vertex';
import Vec4 from '@/engine/math/vector/vec4';
import { Vec3 } from '@/engine/math/vector/vec3';

export class FragmentLightShader extends FragmentShader {
  main(context: RenderContext, input: Vertex): Vec4 {
    // 纹理采样
    const texture = context.getTexture(0);
    if (texture) {
      texture.getColorByUV(input.uv.x, input.uv.y, input.color);
    }

    // 计算光照方向
    const lightPos = context.pointLightPos;
    const lightColor = context.pointLightColor;
    const lightDir = lightPos.sub(input.position).normalize();
    const normal = input.normal.normalize();

    // 光源距物体表面的距离
    const r = lightPos.sub(input.position).length() / 2;
    // 视线方向
    const viewDir = context.cameraPos.sub(input.position).normalize();
    // 半程向量
    const halfVec = lightDir.add(viewDir).normalize();

    // 环境光
    const ambient = new Vec4(0.1, 0.1, 0.1, 1);

    // 漫反射
    const diffuseColor = input.color;
    const diffuse = lightColor
      .mul(diffuseColor)
      .mul(1 / (r * r))
      .mul(Math.max(normal.dot(lightDir), 0));

    // 高光
    const specularColor = new Vec4(1, 1, 1, 1);
    const specular = lightColor
      .mul(specularColor)
      .mul(1 / (r * r))
      .mul(Math.pow(Math.max(normal.dot(halfVec), 0), 200));

    return ambient.add(diffuse).add(specular);

    // // 漫反射 公式： Ld = Kd * I / (r * r) * max(cos(α), 0)
    // // 光源方向与物体表面法线的夹角余弦值
    // const cosAlpha = normal.dot(lightDir);
    // const Kd = input.color;
    // const color = Kd.mul(1 / (r * r)).mul(Math.max(cosAlpha, 0));

    // // 环境光 公式： La = Ka * I
    // const ambientStrength = 0.1; // 环境光强度
    // const Ka = new Vec4(ambientStrength, ambientStrength, ambientStrength, 1);
    // color.add(Ka, color);

    // // 高光项 公式： Ls = Ks * I / (r * r) * max(cos(β), 0)^n
    // // β为半程向量与法线的夹角、近似镜面反射与观察方向的夹角、但计算量大大下降。^n决定高光的衰减、即高光大小
    // const halfVec = lightDir.add(context.cameraPos.sub(input.position).normalize()).normalize();
    // const cosBeta = normal.dot(halfVec);
    // const specular = Math.pow(Math.max(cosBeta, 0), 10);
    // // 高光系数（颜色、通常为白色）
    // const Ks = new Vec4(1, 1, 1, 0);
    // color.add(Ks.mul(1 / (r * r)).mul(specular), color);

    // return color;
  }
}
