/** 模型文件解析 */
export class ObjParse {
  /** 将模型文件转化成VAO对象 */
  static convertToVAO(content: string) {
    const split = content.split('\n');

    const vertex: number[] = [];
    const normal: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const v: string[] = [];
    const vt: string[] = [];
    const vn: string[] = [];
    const f: string[] = [];

    for (let i = 0; i < split.length; ++i) {
      let line = split[i];
      line.trim();
      if (line.startsWith('v ')) {
        v.push(line.substring(2).trim());
      } else if (line.startsWith('vt ')) {
        vt.push(line.substring(3).trim());
      } else if (line.startsWith('vn ')) {
        vn.push(line.substring(3).trim());
      } else if (line.startsWith('f ')) {
        f.push(line.substring(2).trim());
      }
    }

    const set: Set<string> = new Set<string>();

    let index = 0;

    for (let i = 0, len = f.length; i < len; i++) {
      const triangle = f[i].split(' ');
      if (this.applyVert(set, triangle[0], v, vn, vt, vertex, normal, uvs)) {
        indices.push(index);
        index++;
      }
      if (this.applyVert(set, triangle[1], v, vn, vt, vertex, normal, uvs)) {
        indices.push(index);
        index++;
      }
      if (this.applyVert(set, triangle[2], v, vn, vt, vertex, normal, uvs)) {
        indices.push(index);
        index++;
      }
    }

    return {
      position: vertex,
      color: [],
      uv: uvs,
      normal,
      tangent: [],
      indices,
    };
  }

  /** 应用顶点 */
  private static applyVert(
    set: Set<string>,
    triangle: string,
    v: string[],
    vn: string[],
    vt: string[],
    vertex: number[],
    normal: number[],
    uvs: number[]
  ): boolean {
    triangle = triangle.trim();
    if (set.has(triangle)) {
      return false;
    }
    const block = triangle.split('/');
    this.applyInfo(v[parseFloat(block[0].trim()) - 1], vertex, 3);
    this.applyInfo(vt[parseFloat(block[1].trim()) - 1], uvs, 2);
    this.applyInfo(vn[parseFloat(block[2].trim()) - 1], normal, 3);
    return true;
  }

  /** 查找到f对应顶点的 uv、normal、position 值记录到 对应的数组中 */
  private static applyInfo(line: string, info: number[], size: number): void {
    if (line == null) {
      console.log(line);
      return;
    }
    const block = line.split(' ');
    for (let i = 0, len = size; i < len; i++) {
      info.push(parseFloat(block[i]));
    }
  }
}
