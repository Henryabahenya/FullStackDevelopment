import useStore from "./store";

const App = () => {
  const good = useStore((s) => s.good);
  const neutral = useStore((s) => s.neutral);
  const bad = useStore((s) => s.bad);
  const incrementGood = useStore((s) => s.incrementGood);
  const incrementNeutral = useStore((s) => s.incrementNeutral);
  const incrementBad = useStore((s) => s.incrementBad);

  const all = good + neutral + bad;
  const average = all === 0 ? 0 : (good - bad) / all;
  const positive = all === 0 ? "0 %" : `${((good / all) * 100).toFixed(1)} %`;

  return (
    <>
      <h1>Unicafe</h1>

      <h2>give feedback</h2>
      <button onClick={incrementGood}>good</button>
      <button onClick={incrementNeutral}>neutral</button>
      <button onClick={incrementBad}>bad</button>

      <h2>statistics</h2>
      {all === 0 ? (
        <p>No feedback given</p>
      ) : (
        <table>
          <tbody>
            <tr>
              <td>good</td>
              <td>{good}</td>
            </tr>
            <tr>
              <td>neutral</td>
              <td>{neutral}</td>
            </tr>
            <tr>
              <td>bad</td>
              <td>{bad}</td>
            </tr>
            <tr>
              <td>all</td>
              <td>{all}</td>
            </tr>
            <tr>
              <td>average</td>
              <td>{average}</td>
            </tr>
            <tr>
              <td>positive</td>
              <td>{positive}</td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};

export default App;
