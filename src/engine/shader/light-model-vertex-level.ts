import { VAO } from '../core/data/vao';
import { Vertex } from '../core/data/vertex';
import { RenderContext } from '../core/render-context';
import { Mat4 } from '../math/matrix/mat4';
import { Vec2 } from '../math/vector/vec2';
import Vec4 from '../math/vector/vec4';
import { Shader } from './shader';

export class LightModelVertexLevel extends Shader {
  /** 顶点着色器 */
  vert(context: RenderContext, inputVAO: VAO, vertexOut: Vertex): Vec4 {
    let coord = new Vec4(inputVAO.position[0], inputVAO.position[1], inputVAO.position[2], 1);
    // 旋转
    const matRotate = Mat4.rotationY(context.time * 40);
    coord = matRotate.mul(coord);

    // 旋转法线
    let normal = matRotate
      .mul(Vec4.fromArray([inputVAO.normal[0], inputVAO.normal[1], inputVAO.normal[2], 0]))
      .xyz.normalize();

    // 如果存在纹理、采样纹理颜色
    let color = new Vec4(
      inputVAO.color[0] || this.defaultColor.x,
      inputVAO.color[1] || this.defaultColor.y,
      inputVAO.color[2] || this.defaultColor.z,
      1
    );

    // 如果不存在颜色、则使用默认颜色
    if (isNaN(inputVAO.color[0])) {
      vertexOut.color = Vec4.fromArray([this.defaultColor.x, this.defaultColor.y, this.defaultColor.z, 1]);
    }

    if (context.getTexture(0)) {
      color = context.getTexture(0).getColorByUV(inputVAO.uv[0], inputVAO.uv[1], color);
    }

    // 计算光照方向
    const lightPos = context.pointLightPos;
    const lightColor = context.pointLightColor;
    const lightDir = lightPos.sub(coord.xyz).normalize();
    normal = normal.normalize();

    // 光源距物体表面的距离
    const r = lightPos.sub(coord.xyz).length() / 2;
    // 视线方向
    const viewDir = context.cameraPos.sub(coord.xyz).normalize();
    // 半程向量
    const halfVec = lightDir.add(viewDir).normalize();
    // 环境光
    const ambient = new Vec4(0.1, 0.1, 0.1, 1);

    // 漫反射
    const diffuseColor = vertexOut.color;
    const diffuse = lightColor
      .mul(diffuseColor)
      .mul(1 / (r * r))
      .mul(Math.max(normal.dot(lightDir), 0));

    // 高光
    const specularColor = new Vec4(1, 1, 1, 1);
    const specular = lightColor
      .mul(specularColor)
      .mul(1 / (r * r))
      .mul(Math.pow(Math.max(normal.dot(halfVec), 0), 100));

    vertexOut.color = ambient.add(diffuse).add(specular);
    vertexOut.normal = normal;
    vertexOut.position = coord.xyz;
    vertexOut.uv = new Vec2(inputVAO.uv[0], inputVAO.uv[1]);

    //计算经过MVP变换后的坐标
    const position = context.matMVP.mul(coord);
    return position;
  }

  /** 片元着色器 */
  frag(context: RenderContext, input: Vertex): Vec4 {
    return input.color;
  }
}
