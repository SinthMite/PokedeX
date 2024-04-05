import React, { useState, useEffect } from "react";
import pokemon from 'pokemontcgsdk';
import './advanced.css';

export default function Advanced({ setFilteredDex }) {
    const [loading, setLoading] = useState(false);
    const [supertypes, setSupertypes] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [error, setError] = useState(null);
    const [supertype, setSupertype] = useState('Energy');

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const apiKey = "8f969dc9-5b3a-4d1e-ad5f-6d6f4c0fdc6a";
                pokemon.configure({ apiKey });
                
                const supertypesData = await pokemon.supertype.all();

                setSupertypes(supertypesData);
                
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError("Error fetching data. Please try again later.");
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const fetchCards = async () => {
        try {
            setLoading(true);
            const cards = await pokemon.card.all({ 
                q: `supertype:${supertype}` 
            });
            console.log(cards)
            setSelectedCards(cards);
            setFilteredDex(cards);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError("Error fetching cards. Please try again later.");
            setSelectedCards([]);
            setLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchCards();
    };

    const handleSupertypeChange = (event) => {
        setSupertype(event.target.value);
    };

    return (
        <div className="container">
            <h1>Advanced Search</h1>
            <form onSubmit={handleSubmit}>
                <section id="supertypes" name='supertypes'>
                    <h2>Supertypes</h2>
                    <select name="supertype" onChange={handleSupertypeChange}>
                        <option value="">Select One</option>
                        {supertypes.map((supertype, index) => (
                            <option key={index} value={supertype}>{supertype}</option>
                        ))}
                    </select>
                </section>
                <button type="submit">Search</button>
            </form>
            {loading && <p className='loading'>Loading...</p>}
            {error && <p className='error'>{error}</p>}
            <div>
    <select>
        <option value="">Select a card</option>
        {Array.isArray(selectedCards) && selectedCards.map((card, index) => (
            <option key={index}>{card.name}</option>
        ))}
    </select>
</div>
        </div>
    );
}