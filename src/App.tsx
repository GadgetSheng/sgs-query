import { useCallback, useState } from 'react'
import ReactJson from 'react-json-view';
import { resetData } from './utils/store';
import CardList from './components/CardList';
import { initAll, simpleTest } from './utils/task';
import QueryForm from './components/QueryForm';
import { useQueryStore } from './zustand/store';

function App() {
  const { query, cardList, updateQuery, onSearch } = useQueryStore(store => ({
    cardList: store.cardList,
    query: store.query,
    onSearch: store.onSearch,
    updateQuery: store.updateQuery
  }));
  const [fetching, setFetching] = useState(false)
  const [checked,setChecked]=useState(false);
  const [data, setData] = useState({});
  const onToggle = useCallback(() => {
    const useCDN=!checked;
    localStorage.setItem('useCDN',Number(useCDN).toString());
    setChecked(useCDN);
  },[checked]);
  const onInitAll = useCallback(async () => {
    setFetching(true);
    const result = await initAll();
    setData(result);
    setFetching(false);
  }, [])
  const onTest = useCallback(async () => {
    const result = await simpleTest();
    setData(result as any);
  }, [])
  const onClearAll = useCallback(() => {
    const confirm = window.confirm("确定要清空数据库吗？");
    if (confirm) resetData();
  }, [])
  const onResetQuery = () => updateQuery('');

  return (
    <div className="h-screen w-screen">
      <h1 className="w-full bg-gray-100">SGS-QUERY</h1>
      <button className="ml-4" onClick={() => onTest()}>TEST</button>
      <button onClick={onInitAll}>新初始化</button>
      <button onClick={onClearAll}>清空数据库</button>
      <div className="inline-block h-8 b-2 b-#ccc b-dashed v-mid">
        <label htmlFor="toggle" className="v-mid text-4">CDN:</label>
        <input 
          id="toggle"
          type="checkbox"
          className="h-6 w-6 bg-green-100"
          onChange={onToggle}
          checked={checked}
        ></input>
      </div>
      <div className="px-4">
        {fetching ? "fetching..." : (
          <ReactJson
            style={{margin:4}}
            src={data}
            enableClipboard={false}
            displayDataTypes={false}
            theme="mocha"
          />
        )}
      </div>
      <div className="xQuery1 px-4">
        <span>武将名/拼音</span>
        <input
          type="text"
          className="relative mx-2 h-8 w-50"
          value={query}
          onChange={(e) => updateQuery(e.currentTarget.value)}
          placeholder='按<名字/拼音>模糊搜索'
        >
        </input>
        <div 
          className="i-carbon-close-filled mx-3 inline-block v-mid"
          onClick={onResetQuery}
        />
        <button onClick={onSearch}>查询</button>
      </div>
      <QueryForm />
      <hr className="mx-4"/>
      <CardList heros={cardList} />
    </div>
  )
}

export default App
