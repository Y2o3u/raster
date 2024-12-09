import { RenderContext } from '../core/render-context';
import { Vertex } from '../core/data/vertex';
import Vec4 from '../math/vector/vec4';
import { Shader } from './shader';
import { VAO } from '../core/data/vao';
import { Vec2 } from '../math/vector/vec2';
import { Mat4 } from '../math/matrix/mat4';
import { Vec3 } from '../math/vector/vec3';
import { Mat3 } from '../math/matrix/mat3';
import { saturate } from '../math/utils/util';

export class BumpTextureShader extends Shader {
  /** 顶点着色器 */
  vert(context: RenderContext, inputVAO: VAO, vertexOut: Vertex): Vec4 {
    // 齐次坐标
    let coord = Vec4.fromArray([inputVAO.position[0], inputVAO.position[1], inputVAO.position[2], 1]);

    const matRotate = Mat4.rotationY(context.time * 40);
    coord = matRotate.mul(coord);
    // 应用节点的世界坐标变换矩阵、计算出世界坐标、uv等
    vertexOut.position = context.matWorld.mul(coord).xyz;

    // 法线变换、转世界坐标
    let normalVec4 = Vec4.fromArray([inputVAO.normal[0], inputVAO.normal[1], inputVAO.normal[2], 0]);
    const normal = normalVec4.xyz;
    vertexOut.normal = normal;
    const tangent = vertexOut.tangent;
    const bitangent = normal.cross(tangent.xyz).normalize();
    vertexOut.bitangent = bitangent;

    // TBN矩阵转到世界坐标
    vertexOut.tangent = context.matWorld.mul(matRotate).mul(Vec4.fromArray([tangent.x, tangent.y, tangent.z, 0]));
    vertexOut.bitangent = context.matWorld
      .mul(matRotate)
      .mul(Vec4.fromArray([bitangent.x, bitangent.y, bitangent.z, 0])).xyz;
    vertexOut.normal = context.matWorld
      .mul(matRotate)
      .mul(Vec4.fromArray([normal.x, normal.y, normal.z, 0]))
      .xyz.normalize();

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

    // 法线贴图
    const normalTexture = context.getTexture(1);
    let tangentNormal = new Vec3(0, 0, 1); // 默认法线
    if (normalTexture) {
      const sampledNormal = new Vec4(0, 0, 0, 1);
      normalTexture.getColorByUV(input.uv.x, input.uv.y, sampledNormal);
      tangentNormal = sampledNormal.xyz.mul(2).sub(1);

      // 凹凸程度控制、因为法线为单位向量 x^2 + y^2 + z^2 = 1
      // 所以z分量由x、y分量计算得到、saturate用于将结果限制在【0，1】内
      const bumpScale = 0;
      tangentNormal.x *= bumpScale;
      tangentNormal.y *= bumpScale;
      tangentNormal.z = Math.sqrt(1 - saturate(tangentNormal.x * tangentNormal.x + tangentNormal.y * tangentNormal.y));
    }

    // 将法线从切线空间转换到世界空间
    const T = input.tangent.xyz;
    const B = input.bitangent;
    const N = input.normal;
    const TBN = Mat3.fromColumns(T, B, N);
    const worldNormal = TBN.mul(tangentNormal).normalize();

    // 计算光照方向
    const lightPos = context.pointLightPos;
    const lightColor = context.pointLightColor;
    const lightDir = lightPos.sub(input.position).normalize();

    // 光源距物体表面的距离
    const r = lightPos.sub(input.position).length() / 2;
    // 视线方向
    const viewDir = context.cameraPos.sub(input.position).normalize();
    // 半程向量
    const halfVec = lightDir.add(viewDir).normalize();

    // 漫反射
    const diffuseColor = input.color;
    const diffuse = lightColor
      .mul(diffuseColor)
      .mul(1 / (r * r))
      // .mul(Math.max(worldNormal.dot(lightDir), 0));
      .mul(worldNormal.dot(lightDir) * 0.5 + 0.5);

    // 环境光
    const ambient = new Vec4(0.1, 0.1, 0.1, 1);

    // 高光项
    const specularColor = new Vec4(1, 1, 1, 1);
    const specular = lightColor
      .mul(specularColor)
      .mul(1 / (r * r))
      .mul(Math.pow(Math.max(worldNormal.dot(halfVec), 0), 200));

    return ambient.add(diffuse).add(specular);
  }
}
