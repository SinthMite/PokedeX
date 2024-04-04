import React, { useState, useEffect } from "react";
import pokemon from 'pokemontcgsdk';
import './advanced.css';

export default function Advanced() {
    const [loading, setLoading] = useState(false);
    const [supertypes, setSupertypes] = useState([]);
    const [subtypes, setSubtypes] = useState([]);
    const [types, setTypes] = useState([]);
    const [rarities, setRarities] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [error, setError] = useState(null);

    const fetchCards = async (criteria) => {
        try {
            setLoading(true);
            const apiKey = "8f969dc9-5b3a-4d1e-ad5f-6d6f4c0fdc6a";
            pokemon.configure({ apiKey });
    
            const cards = await pokemon.card.where(criteria);
            console.log("Fetched cards:", cards); // Log the fetched cards
            if (Array.isArray(cards)) {
                setSelectedCards(cards);
                setError(null);
            } else {
                throw new Error("Invalid data returned from API");
            }
        } catch (error) {
            console.error(error);
            setSelectedCards([]);
            setError("Error fetching cards. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const criteria = {
            supertype: event.target.supertype.value,
            subtype: event.target.subtype.value,
            type: event.target.type.value,
            rarity: event.target.rarity.value
        };
        fetchCards(criteria);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const supertypesData = await pokemon.supertype.all();
                const subtypesData = await pokemon.subtype.all();
                const typesData = await pokemon.type.all();
                const raritiesData = await pokemon.rarity.all();

                setSupertypes(supertypesData);
                setSubtypes(subtypesData);
                setTypes(typesData);
                setRarities(raritiesData);
            } catch (error) {
                console.error(error);
                setError("Error fetching data. Please try again later.");
            }
        }

        fetchData();
    }, []);

    return (
        <div className="container">
            <h1>Advanced Search</h1>
            <form onSubmit={handleSubmit}>
                <section id="supertypes" name='supertypes'>
                    <h2>Supertypes</h2>
                    <select name="supertype">
                        <option value="">Select One</option>
                        {supertypes.map((supertype, index) => (
                            <option key={index} value={supertype}>{supertype}</option>
                        ))}
                    </select>
                </section>
                <section id="subtypes" name='subtypes'>
                    <h2>Subtypes</h2>
                    <select name="subtype">
                        <option value="">Select One</option>
                        {subtypes.map((subtype, index) => (
                            <option key={index} value={subtype}>{subtype}</option>
                        ))}
                    </select>
                </section>
                <section id="types" name='types'>
                    <h2>Types</h2>
                    <select name="type">
                        <option value="">Select One</option>
                        {types.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </section>
                <section id="rarity" name='rarity'>
                    <h2>Rarity</h2>
                    <select name="rarity">
                        <option value="">Select One</option>
                        {rarities.map((rarity, index) => (
                            <option key={index} value={rarity}>{rarity}</option>
                        ))}
                    </select>
                </section>
                <button type="submit">Search</button>
            </form>
            {loading && <p className='loading'>Loading...</p>}
            {error && <p className='error'>{error}</p>}
            <div>
                {Array.isArray(selectedCards) && selectedCards.map((card, index) => (
                    <div key={index}>
                        <h3>{card}</h3>
                        <p>{card}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}