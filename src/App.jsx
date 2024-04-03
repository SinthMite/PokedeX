import React, { useState, useEffect } from 'react';
import './App.css';
import pokemon from 'pokemontcgsdk';

function App() {
  const [dex, setDex] = useState([]);
  const [filteredDex, setFilteredDex] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        const apiKey = "8f969dc9-5b3a-4d1e-ad5f-6d6f4c0fdc6a";
        pokemon.configure({ apiKey });
        const cards = await pokemon.card.all({ q: `name:${searchTerm}` });
        console.log(cards);
        setDex(cards);
        setFilteredDex(cards);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    if (searchTerm !== '') {
      fetchData(); // Call fetchData function only if searchTerm is not empty
    }
  }, [searchTerm]);

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const submitSearchTerm = (e) => {
    e.preventDefault();
    setFilteredDex(dex.filter((card) => card.name.toLowerCase().includes(searchTerm.toLowerCase())));
    setSearchTerm('');
  };

  return (
    <>
      <form className="search-form" onSubmit={submitSearchTerm}>
  <div className="input-container">
    <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
    <button type="submit">Search</button>
  </div>
</form>
      {loading ? (
        <p className='loading'>Loading...</p>
      ) : (
        <ul>
          {filteredDex.map((card) => (
            <li key={card.id}>
              <div className='cardholder'>
                <h2>{card.name}</h2>
                <img src={card.images.small} alt={card.name} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;