import React, { useState, useEffect } from "react";
import "./App.css";

const themes = {
  pokemon: [
    {
      name: "pikachu",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    },
    {
      name: "bulbasaur",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    },
    {
      name: "charmander",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    },
    {
      name: "squirtle",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    },
    {
      name: "jigglypuff",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
    },
    {
      name: "meowth",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png",
    },
  ],
  flags: [
    { name: "usa", image: "https://flagcdn.com/w80/us.png" },
    { name: "canada", image: "https://flagcdn.com/w80/ca.png" },
    { name: "japan", image: "https://flagcdn.com/w80/jp.png" },
    { name: "france", image: "https://flagcdn.com/w80/fr.png" },
    { name: "brazil", image: "https://flagcdn.com/w80/br.png" },
    { name: "germany", image: "https://flagcdn.com/w80/de.png" },
  ],
  emoji: [
    { name: "smile", value: "😀" },
    { name: "dog", value: "🐶" },
    { name: "pizza", value: "🍕" },
    { name: "soccer", value: "⚽" },
    { name: "guitar", value: "🎸" },
    { name: "rocket", value: "🚀" },
  ],
};

function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [theme, setTheme] = useState("pokemon");
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    initializeGame();
  }, [theme]);

  const initializeGame = () => {
    // Get pairs for current theme
    const themeItems = themes[theme];
    const items = [...themeItems, ...themeItems];

    // Shuffle cards
    const shuffled = items
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        name: item.name,
        value: item.value || null,
        image: item.image || null,
        flipped: false,
        solved: false,
      }));

    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setDisabled(false);
  };

  const handleCardClick = (id) => {
    if (
      disabled ||
      flipped.includes(id) ||
      solved.includes(id) ||
      flipped.length === 2
    ) {
      return;
    }

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      setDisabled(true);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);

      // Compare either by name (for images) or value (for emojis)
      const isMatch =
        theme === "emoji"
          ? firstCard.value === secondCard.value
          : firstCard.name === secondCard.name;

      if (isMatch) {
        setSolved([...solved, firstId, secondId]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const isGameComplete = solved.length === cards.length && cards.length > 0;

  return (
    <div className={`app ${theme}`}>
      <h1>Memory Card Game</h1>

      <div className="theme-selector">
        <button
          className={theme === "pokemon" ? "active" : ""}
          onClick={() => changeTheme("pokemon")}
        >
          Pokémon
        </button>
        <button
          className={theme === "flags" ? "active" : ""}
          onClick={() => changeTheme("flags")}
        >
          Flags
        </button>
        <button
          className={theme === "emoji" ? "active" : ""}
          onClick={() => changeTheme("emoji")}
        >
          Emoji
        </button>
      </div>

      {isGameComplete && (
        <div className="win-message">
          You won in {moves} moves!
          <button onClick={initializeGame}>Play Again</button>
        </div>
      )}

      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            name={card.name}
            value={card.value}
            image={card.image}
            theme={theme}
            flipped={flipped.includes(card.id) || solved.includes(card.id)}
            onClick={handleCardClick}
          />
        ))}
      </div>

      <div className="moves">Moves: {moves}</div>
    </div>
  );
}

const Card = ({ id, name, value, image, theme, flipped, onClick }) => {
  const getCardContent = () => {
    if (theme === "emoji") {
      return value;
    } else {
      return (
        <img
          src={image}
          alt={name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/100?text=Image+Missing";
          }}
        />
      );
    }
  };

  return (
    <div
      className={`card ${flipped ? "flipped" : ""}`}
      onClick={() => onClick(id)}
    >
      <div className="card-inner">
        <div className="card-front"></div>
        <div className="card-back">{getCardContent()}</div>
      </div>
    </div>
  );
};

export default App;
