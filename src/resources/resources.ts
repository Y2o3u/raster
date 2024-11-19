import spot from '../resources/model/spot/spot_texture.png';
import africanHead from '../resources/model/african/african_head_diffuse.png';
import box from '../resources/texture/container_diffuse.png';

/** 奶牛模型 */
const spotObjPath = new URL('../resources/model/spot/spot_triangulated_good.obj', import.meta.url).pathname;
/** 非洲人头像 */
const africanHeadObjPath = new URL('../resources/model/african/african_head.obj', import.meta.url).pathname;
/**
 * 纹理图片资源
 */
export const Png = {
  /** 点光源模型 */
  Spot: spot,
  /** 非洲人头像 */
  AfricanHead: africanHead,
  /** 容器 */
  Box: box,
};

/**
 * obj模型资源
 */
export const Obj = {
  /** 奶牛模型 */
  Spot: spotObjPath,
  /** 非洲人头像 */
  AfricanHead: africanHeadObjPath,
};
