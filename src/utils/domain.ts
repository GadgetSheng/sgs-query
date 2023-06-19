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
    gender: keyof typeof GenderEnum;
    name?: string;
    nation: keyof typeof NationEnum;
    hp: number | string;
    skills?: Array<Skill>;
    from?: string;
}