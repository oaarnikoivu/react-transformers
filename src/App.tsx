import { SentenceSimilarity } from './sentence-similarity';
import { SentimentAnalysis } from './sentiment-analysis';
import { Summarization } from './summarization';

function App() {
  return (
    <div>
      <Summarization />
      <SentenceSimilarity />
      <SentimentAnalysis />
    </div>
  );
}

export default App;
