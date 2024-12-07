import { RenderContext } from '../core/render-context';
import { Vertex } from '../core/data/vertex';
import Vec4 from '../math/vector/vec4';
import { Shader } from './shader';
import { VAO } from '../core/data/vao';
import { Vec2 } from '../math/vector/vec2';
import { Mat4 } from '../math/matrix/mat4';

export class LightModelRotateFragmentLevel extends Shader {
  /** 顶点着色器 */
  vert(context: RenderContext, inputVAO: VAO, vertexOut: Vertex): Vec4 {
    // 齐次坐标
    let coord = Vec4.fromArray([inputVAO.position[0], inputVAO.position[1], inputVAO.position[2], 1]);
    // 旋转
    const matRotate = Mat4.rotationY(context.time * 40);
    coord = matRotate.mul(coord);
    // 应用节点的世界坐标变换矩阵、计算出世界坐标、uv等
    vertexOut.position = context.matWorld.mul(coord).xyz;

    // 法线变换
    let normalVec4 = Vec4.fromArray([inputVAO.normal[0], inputVAO.normal[1], inputVAO.normal[2], 0]);
    const normal = context.matWorld.mul(matRotate).mul(normalVec4).xyz;
    vertexOut.normal = normal;

    vertexOut.uv = Vec2.fromArray([inputVAO.uv[0], inputVAO.uv[1]]);
    vertexOut.color = Vec4.fromArray([inputVAO.color[0], inputVAO.color[1], inputVAO.color[2], 1]);
    // 如果不存在颜色、则使用默认颜色
    if (isNaN(inputVAO.color[0])) {
      vertexOut.color = Vec4.fromArray([this.defaultColor.x, this.defaultColor.y, this.defaultColor.z, 1]);
    }
    // 如果存在纹理、采样纹理颜色
    if (context.getTexture(0)) {
      vertexOut.color = context.getTexture(0).getColorByUV(vertexOut.uv.x, vertexOut.uv.y, vertexOut.color);
    }
    //计算经过MVP变换后的坐标
    return context.matMVP.mul(coord);
  }

  /** 片元着色器 */
  frag(context: RenderContext, input: Vertex): Vec4 {
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
  }
}
