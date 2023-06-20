import { PACKAGE_MAP } from '../utils/config';
import { NationEnum, NationMap } from '../utils/domain'
import { useQueryStore } from '../zustand/store';

function RadioButton(props: any) {
  const { name = '', onChange, checked, type = 'N' } = props;
  const value = (type === 'N' ? NationMap[name] : name.toUpperCase()) || '全部';
  const cls = ["b-1 b-solid b-#ccc rd-2px px-2"];
  if (checked) cls.push("bg-#fcc fw-bold");
  return (<div className={cls.join(' ')} onClick={() => onChange(name)} > {value} </div >)
}

function CheckboxButton(props: any) {
  const { name, onChange, checked } = props;
  const value = PACKAGE_MAP[name] || name;
  const cls = ["b-1 b-solid b-#ccc rd-2px px-2"];
  if (checked) cls.push("bg-#ffc fw-bold");
  return (<div className={cls.join(' ')} onClick={() => onChange(name)} > {value} </div >);
}

const NationOptions = [
  "",
  NationEnum.shu,
  NationEnum.wei,
  NationEnum.wu,
  NationEnum.qun,
  NationEnum.jin,
]
const LetterOptions = [""].concat("ABCDFGHJKLMNPQRSTWXYZ".toLowerCase().split(''));
const PackageOptions = Object.keys(PACKAGE_MAP);

function QueryForm() {
  const { form, onChangeNation, onChangePinyin, togglePackage } = useQueryStore(store => ({
    form: store.form,
    onChangeNation: store.onChangeNation,
    onChangePinyin: store.onChangePinyin,
    togglePackage: store.togglePackage
  }));
  const { nation = '', pinyin = '', packages = [] } = form;
  return (
    <div className="bg-#AAA3 mx-4 p-4">
      <div className="flex flex-wrap gap-4">
        {PackageOptions.map((name: string, i: number) => (
          <CheckboxButton
            key={i}
            name={name}
            checked={packages.includes(name)}
            onChange={() => togglePackage(name)}
          />
        ))}
      </div>
      <hr />
      <div className="flex gap-4">
        势力:
        {NationOptions.map((name: string, i: number) => (
          <RadioButton
            key={i}
            name={name}
            checked={name === nation}
            onChange={() => onChangeNation(name)}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mt-4">
        字母:
        {LetterOptions.map((letter: string, i: number) => (
          <RadioButton
            key={i}
            type="P" // pinyin
            name={letter}
            checked={letter === pinyin}
            onChange={() => onChangePinyin(letter)}
          />
        ))}
      </div>
    </div>
  );
}

export default QueryForm;