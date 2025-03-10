import { useState } from 'react';
import { useSentimentAnalysis } from '../lib';

export function SentimentAnalysis() {
  const { isLoading, output, classify } = useSentimentAnalysis({});

  const [text, setText] = useState('');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <textarea rows={2} onChange={(e) => setText(e.target.value)} />
      <button disabled={isLoading} onClick={() => classify(text)}>
        Classify
      </button>
      {isLoading ? <div>Loading...</div> : <div>{JSON.stringify(output)}</div>}
    </div>
  );
}
