import { VAO } from '@/engine/core/data/vao';
import { Vertex } from '@/engine/core/data/vertex';
import { RenderContext } from '@/engine/core/render-context';
import Vec4 from '@/engine/math/vector/vec4';
import { VertexShader } from './vertex-shader';
import { Vec3 } from '@/engine/math/vector/vec3';
import { Vec2 } from '@/engine/math/vector/vec2';
import { Mat4 } from '@/engine/math/matrix/mat4';

/**
 * 顶点光照着色器
 */
export default class VertexLightShader extends VertexShader {
  /**
   * 主函数
   * @param context
   * @param inputVAO
   * @param vertexOut
   */
  main(context: RenderContext, inputVAO: VAO, vertexOut: Vertex): Vec4 {
    // 计算光照方向
    const lightPos = context.pointLightPos;
    let coord = new Vec4(inputVAO.position[0], inputVAO.position[1], inputVAO.position[2], 1);
    const lightDir = lightPos.sub(coord.xyz).normalize();

    // 旋转
    const matRotate = Mat4.rotationY(context.time * 40);
    coord = matRotate.mul(coord);

    // 旋转法线
    let normal = matRotate
      .mul(Vec4.fromArray([inputVAO.normal[0], inputVAO.normal[1], inputVAO.normal[2], 0]))
      .xyz.normalize();

    // 如果存在纹理、采样纹理颜色
    let color = new Vec4(inputVAO.color[0], inputVAO.color[1], inputVAO.color[2], 1);

    // 如果不存在颜色、则使用默认颜色
    if (isNaN(inputVAO.color[0])) {
      vertexOut.color = Vec4.fromArray([this.defaultColor.x, this.defaultColor.y, this.defaultColor.z, 1]);
    }

    if (context.getTexture(0)) {
      color = context.getTexture(0).getColorByUV(inputVAO.uv[0], inputVAO.uv[1], color);
    }

    // 漫反射 公式： Ld = Kd * I * max(cos(α), 0)
    const diffuse = Math.max(normal.dot(lightDir), 0);
    color = color.mul(diffuse);

    // 环境光 公式： La = Ka * I
    const ambientStrength = 0.1;
    const Ka = new Vec4(ambientStrength, ambientStrength, ambientStrength, 1);
    color.add(Ka, color);

    // 高光项 公式： Ls = Ks * I * max(cos(β), 0)^n
    const halfVec = lightDir.add(context.cameraPos.sub(coord.xyz)).normalize();
    const cosBeta = normal.dot(halfVec);
    const specular = Math.pow(Math.max(cosBeta, 0), 200);
    const Ks = 1;
    const specularColor = new Vec4(1, 1, 1, 0);
    color.add(specularColor.mul(Ks).mul(specular), color);

    vertexOut.color = color;
    vertexOut.normal = normal;
    vertexOut.position = coord.xyz;
    vertexOut.uv = new Vec2(inputVAO.uv[0], inputVAO.uv[1]);

    //计算经过MVP变换后的坐标
    const position = context.matMVP.mul(coord);
    return position;
  }
}
