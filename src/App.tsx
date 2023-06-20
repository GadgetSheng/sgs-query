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
  const [data, setData] = useState({});
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
    <div className="w-screen h-screen">
      <h1>SGS-QUERY</h1>
      <button onClick={() => onTest()}>TEST</button>
      <button onClick={onInitAll}>新初始化</button>
      <button onClick={onClearAll}>清空数据库</button>
      <div>
        {fetching ? "fetching..." : (
          <ReactJson
            src={data}
            enableClipboard={false}
            displayDataTypes={false}
            theme="hopscotch"
          />
        )}
      </div>
      武将名称/拼音
      <input
        type="text"
        className="h-9 w-50"
        value={query}
        onChange={(e) => updateQuery(e.currentTarget.value)}
        placeholder='至少一字符'
      />
      <button onClick={onSearch}>查询</button>
      <button onClick={onResetQuery}>x</button>
      <QueryForm />
      <hr />
      <CardList heros={cardList} />
    </div>
  )
}

export default App
