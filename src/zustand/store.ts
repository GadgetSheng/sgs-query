import { create } from 'zustand';
import { Hero } from '../utils/domain';
import { queryCards, queryCardsByForm } from '../utils/task';
import { PACKAGE_MAP } from '../utils/config';

interface IState {
  form: Record<string, any>
  cardList: Array<Hero>
  query: string
  updateQuery: (value: string) => void
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
      return { form: newForm }
    });
    onSearch();
  };
  const onChangePinyin = (pinyin: string) => {
    console.log('onChangePinyin(%s)', pinyin);
    set((state: IState) => {
      const newForm = { ...state.form, pinyin }
      return { form: newForm }
    });
    onSearch();
  };

  const togglePackage = (pack: string) => {
    const { form } = get();
    const { packages = [] } = form;
    const newPackages = packages.includes(pack) ? packages.filter((p: string) => p !== pack) : [...packages, pack];
    const newForm = { ...form, packages: newPackages };
    set(() => ({ form: newForm }));
    onSearch();
  }

  return {
    form: { packages: Object.keys(PACKAGE_MAP) },
    cardList: [],
    query: '',
    updateQuery: (value: string) => set(() => ({ query: value })),
    onSearch,
    onChangeNation,
    onChangePinyin,
    togglePackage
  }
})

export {
  useQueryStore
}