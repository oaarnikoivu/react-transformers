import { useState } from 'react';
import { useSummarization } from '../lib/summarization/use-summarization';

export function Summarization() {
  const [text, setText] = useState('');
  const { isLoading, output, summarize } = useSummarization({
    generatorConfig: {
      min_length: 50,
      max_length: 200,
    },
  });

  const summary =
    output && output[0] && 'summary_text' in output[0]
      ? output[0]['summary_text']
      : '';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
      }}
    >
      <textarea
        value={text}
        rows={10}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to summarize"
        style={{
          width: '100%',
        }}
      />
      <button disabled={isLoading} onClick={() => summarize(text)}>
        Summarize
      </button>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h3>Summary</h3>
          <div>{summary}</div>
        </div>
      )}
    </div>
  );
}
