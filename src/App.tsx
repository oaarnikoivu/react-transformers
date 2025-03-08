import { useSentenceSimilarity } from '../lib';

const sentences = [
  'The quick brown fox jumps over the lazy dog',
  'A group of penguins waddled across the icy landscape',
  'She solved the complex puzzle in record time',
  'The ancient oak tree provided shade on hot summer days',
  'Scientists discovered a new species in the Amazon rainforest',
  'The chef prepared a delicious meal for the guests',
  'Students gathered in the auditorium for the annual ceremony',
];

function App() {
  const { isReady, isLoading, isError, data, search } = useSentenceSimilarity({
    items: sentences,
  });

  if (!isReady) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {isError}</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '100%',
          maxWidth: '600px',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <h2 style={{ margin: '0 0 10px 0' }}>Sentence Similarity Search</h2>
        <input
          type="text"
          style={{
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box',
            marginBottom: '10px',
          }}
          onChange={(e) => search(e.target.value)}
          placeholder="Search for similar sentences..."
        />
        <div
          style={{
            flex: 1,
            overflow: 'auto',
          }}
        >
          <ul
            style={{
              width: '100%',
              padding: '0',
              margin: 0,
              listStylePosition: 'inside',
            }}
          >
            {isLoading ? (
              <li>Loading...</li>
            ) : (
              data.map((item) => (
                <li
                  key={item.index}
                  style={{ marginBottom: '8px', wordBreak: 'break-word' }}
                >
                  {sentences[item.index]} | {item.similarity}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
