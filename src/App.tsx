import { useSentenceSimilarity } from '../lib';

const sentences = [
  'The quick brown fox jumps over the lazy dog',
  'A group of penguins waddled across the icy landscape',
  'She solved the complex puzzle in record time',
  'The ancient oak tree provided shade on hot summer days',
  'Scientists discovered a new species in the Amazon rainforest',
  'The chef prepared a delicious meal for the guests',
  'Students gathered in the auditorium for the annual ceremony',
  'The musician composed a beautiful symphony in just three days',
  'Astronauts reported spectacular views from the space station',
  'The detective carefully examined the evidence at the crime scene',
  'Children built sandcastles along the shoreline during vacation',
  'The historian uncovered documents dating back to the 16th century',
  'Firefighters rescued a cat trapped in a tall tree',
  "The artist's painting was displayed in the prestigious gallery",
  'Engineers designed a revolutionary bridge to span the wide river',
  'The marathon runner broke the previous world record',
  'Volunteers planted hundreds of trees in the community park',
  'The professor explained the complex theory to his students',
  'A flock of birds flew south for the winter migration',
  'The photographer captured stunning images of the sunset',
  'The old bookstore had shelves filled with rare first editions',
  'Tourists admired the ancient architecture of the cathedral',
  'The gardener carefully pruned the rose bushes in spring',
  "The chef's signature dish won the culinary competition",
  'The violinist practiced for hours before the concert',
  'The mountain climbers reached the summit after days of hiking',
  'The novelist completed her manuscript after years of writing',
  'The surgeon performed a life-saving operation on the patient',
  'The archaeologist discovered artifacts from an ancient civilization',
  "The comedian's jokes had the audience laughing uncontrollably",
  'The ballet dancer executed perfect pirouettes on stage',
  "The mechanic repaired the vintage car's engine with precision",
  'The librarian organized books according to the Dewey Decimal System',
  'The astronomer observed a new comet through the telescope',
  'The beekeeper harvested honey from the hives in late summer',
  'The tailor made adjustments to the wedding dress for the bride',
  'The pilot navigated through turbulence with steady hands',
  'The journalist interviewed the politician about current issues',
  'The carpenter crafted a beautiful wooden table from oak',
  'The fisherman caught a record-breaking trout in the lake',
  'The meteorologist predicted heavy rainfall for the weekend',
  'The botanist classified the newly discovered plant species',
  'The magician performed illusions that amazed the audience',
  'The coach developed a winning strategy for the championship game',
  'The veterinarian treated the injured wildlife with care',
  'The poet recited verses that moved listeners to tears',
  'The chocolatier created exquisite truffles for the gourmet shop',
  'The seamstress stitched intricate patterns on the quilt',
  'The sommelier recommended the perfect wine pairing for dinner',
  'The blacksmith forged a decorative iron gate for the garden',
  'The choreographer designed innovative dance sequences for the show',
  'The cartographer mapped unexplored territories with precision',
  'The glassblower created delicate vases with swirling colors',
  'The birdwatcher identified rare species in the nature reserve',
  'The calligrapher wrote wedding invitations with elegant script',
  'The puppeteer entertained children with colorful marionettes',
  'The watchmaker repaired antique timepieces with tiny tools',
  'The barista created latte art that impressed customers',
  'The florist arranged exotic blooms for the wedding ceremony',
  'The tattoo artist designed custom artwork for clients',
  'The skateboarder performed impressive tricks at the competition',
  'The pastry chef created a towering wedding cake with sugar flowers',
  'The bonsai artist shaped miniature trees with patience and skill',
  'The weaver created intricate tapestries on a traditional loom',
  'The perfumer blended essential oils to create signature scents',
  'The toy maker crafted wooden puzzles for children',
  'The silversmith created ornate jewelry with traditional techniques',
  'The falconer trained birds of prey for hunting expeditions',
  'The gondolier navigated narrow canals with expert precision',
  'The ice sculptor carved elaborate designs for the winter festival',
  'The origami artist folded paper into complex animal shapes',
  'The potter shaped clay vessels on a spinning wheel',
  'The quilter stitched together fabric pieces in colorful patterns',
  'The rope maker twisted fibers into strong nautical lines',
  'The saddle maker crafted leather equipment for equestrians',
  'The taxidermist preserved specimens for the natural history museum',
  'The umbrella maker designed waterproof canopies for rainy days',
  'The ventriloquist made puppets appear to speak on their own',
  'The whiskey distiller aged spirits in oak barrels for decades',
  'The xylophonist performed complex melodies on wooden bars',
  'The yoga instructor demonstrated advanced poses for the class',
  'The zoologist studied animal behavior in their natural habitats',
  'The acrobat performed daring feats high above the circus ring',
  'The baker kneaded dough for fresh bread before dawn',
  'The candlemaker dipped wicks into melted wax repeatedly',
  'The diver explored coral reefs teeming with marine life',
  'The electrician rewired the historic building to modern standards',
  'The firefighter rescued a child from the burning building',
  'The geologist collected rock samples from the mountain range',
  'The harpist plucked strings to create ethereal melodies',
  "The illustrator drew detailed images for the children's book",
  'The jeweler set precious gems in custom-designed settings',
  'The knitter created warm sweaters from hand-dyed wool',
  'The locksmith crafted keys for antique chests and cabinets',
  'The mathematician solved equations that had puzzled experts for years',
  "The narrator's voice captivated listeners throughout the audiobook",
  'The optician fitted glasses for patients with precision',
  'The paleontologist excavated dinosaur fossils from the desert',
  'The quarterback threw a perfect spiral to win the championship',
  'The radiologist analyzed medical images to diagnose conditions',
  'The sculptor chiseled marble to reveal the figure within',
  'The translator converted ancient texts into modern language',
  'The upholsterer restored antique furniture with period-appropriate fabric',
  'The violist performed a solo piece at the chamber music concert',
  'The winemaker harvested grapes at the peak of ripeness',
  'The X-ray technician positioned patients carefully for clear images',
  'The yachtsman navigated through stormy seas with skill',
  'The zookeeper ensured animals received proper nutrition and care',
];

function App() {
  const { isReady, isLoading, isError, data, search } = useSentenceSimilarity({
    items: sentences,
    limit: 5,
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
                  key={item.item}
                  style={{ marginBottom: '8px', wordBreak: 'break-word' }}
                >
                  {item.item}
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
