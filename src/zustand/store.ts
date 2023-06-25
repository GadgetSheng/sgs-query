import { create } from 'zustand';
import { Hero } from '../utils/domain';
import { queryCards, queryCardsByForm } from '../utils/task';

const DEFAULT_FORM={
  query: '',
  packages: [ 'sp', 'sp2', 'xinghuoliaoyuan', 'yijiang', 'yingbian', 'refresh', ] 
};

interface IState {
  form: Record<string, any>
  cardList: Array<Hero>
  query: string
  updateQuery: (value: string) => void
  resetForm: ()=>void
  onSearch: () => void
  onChangeNation: (nation: string) => void
  onChangePinyin: (pinyin: string) => void
  togglePackage: (pack: string) => void
}

const useQueryStore = create<IState>((set, get) => {
  const onSearch = async () => {
    const { form, query } = get();
    console.log('onSearch', form, query);
    if (query) {
      const results = await queryCards(query);
      set(() => ({ cardList: results }));
    } else {
      const results = await queryCardsByForm(form);
      set(() => ({ cardList: results }));
    }
  };
  const onChangeNation = (nation: string) => {
    console.log('onChangeNation(%s)', nation);
    set((state: IState) => {
      const newForm = { ...state.form, nation }
      return { form: newForm, query: '' }
    });
    onSearch();
  };
  const onChangePinyin = (pinyin: string) => {
    console.log('onChangePinyin(%s)', pinyin);
    set((state: IState) => {
      const newForm = { ...state.form, pinyin }
      return { form: newForm,query:'' }
    });
    onSearch();
  };

  const togglePackage = (pack: string) => {
    const { form } = get();
    const { packages = [] } = form;
    const newPackages = packages.includes(pack) ? packages.filter((p: string) => p !== pack) : [...packages, pack];
    const newForm = { ...form, packages: newPackages };
    set(() => ({ form: newForm, query: '' }));
    onSearch();
  }

  return {
    form: DEFAULT_FORM, 
    cardList: [],
    query: '',
    updateQuery: (value: string) => set(() => ({ query: value })),
    resetForm: ()=> set(()=>({query: '', form:DEFAULT_FORM, cardList:[]})),
    onSearch,
    onChangeNation,
    onChangePinyin,
    togglePackage
  };
})

export {
  useQueryStore
}