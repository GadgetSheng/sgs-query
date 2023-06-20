export enum NationEnum {
  wei = 'wei',
  shu = 'shu',
  wu = 'wu',
  qun = 'qun',
  jin = 'jin',
}
export enum GenderEnum {
  male = 'male',
  female = 'female'
}

export interface Skill {
  key: string;
  name?: string;
  desc?: string;
}

export interface Hero {
  key: string;
  pinyin?: string;
  gender: keyof typeof GenderEnum;
  name?: string;
  nation: keyof typeof NationEnum;
  hp: number | string;
  skills?: Array<Skill>;
  from?: string;
}

export const GenderMap: any = {
  [GenderEnum.male]: '男',
  [GenderEnum.female]: '女'
}
export const NationMap: any = {
  [NationEnum.wei]: '魏',
  [NationEnum.shu]: '蜀',
  [NationEnum.wu]: '吴',
  [NationEnum.qun]: '群',
  [NationEnum.jin]: '晋'
}