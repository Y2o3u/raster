import { RenderContext } from '@/engine/core/render-context';
import { FragmentShader } from './fragment-shader';
import { Vertex } from '@/engine/core/data/vertex';
import Vec4 from '@/engine/math/vector/vec4';
import { Vec3 } from '@/engine/math/vector/vec3';
import { Mat4 } from '@/engine/math/matrix/mat4';

export class FragmentLightShader extends FragmentShader {
  main(context: RenderContext, input: Vertex): Vec4 {
    // 环境光强度
    const ambientStrength = 0.1;

    // 纹理采样
    const texture = context.getTexture(0);
    if (texture) {
      texture.getColorByUV(input.uv.x, input.uv.y, input.color);
    }

    // 计算光照方向
    const lightPos = context.sphereLightPos;
    const lightDir = lightPos.sub(input.position).normalize();
    const normal = Vec3.fromArray([input.normal.x, input.normal.y, input.normal.z]).normalize();

    // 漫反射 公式： Ld = Kd * I * max(cos(α), 0)
    const r = lightPos.sub(input.position).length() / 2; // 光源距物体表面的距离
    // 光源方向与物体表面法线的夹角余弦值
    const cosAlpha = normal.dot(lightDir);
    const diffuse = Math.max(cosAlpha, 0);
    const color = input.color.multiply(1 / (r * r)).multiply(diffuse);

    // 环境光 公式： La = Ka * I
    const ambient = new Vec4(ambientStrength, ambientStrength, ambientStrength, 1);
    color.add(ambient, color);

    // 高光项 公式： Ls = Ks * I * max(cos(β), 0)^n
    // β为半程向量与法线的夹角、近似镜面反射与观察方向的夹角、但计算量大大下降。^n决定高光的衰减、即高光大小
    const halfVec = lightDir.add(context.cameraPos.sub(input.position)).normalize();
    const cosBeta = normal.dot(halfVec);
    const specular = Math.pow(Math.max(cosBeta, 0), 200);
    // 镜面反射系数
    const Ks = 0.5;
    // 高光颜色
    const specularColor = new Vec4(1, 1, 1, 0);
    color.add(
      specularColor
        .multiply(Ks)
        .multiply(1 / (r * r))
        .multiply(specular),
      color
    );

    return color;
  }
}
