const container = document.getElementById("pokemon-details");
const getPokemonIdFromUrl = () => new URLSearchParams(window.location.search).get("id");
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const fetchPokemonDetails = async id => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    container.innerHTML = `
      <div class="image-panel">
        <img src="${data.sprites.other.dream_world.front_default || data.sprites.front_default}" alt="${data.name}">
      </div>
      <div class="details-panel">
        <h1>${capitalize(data.name)}</h1>
        <div><strong>Tipos:</strong> ${data.types.map(t => `<span class="badge type">${capitalize(t.type.name)}</span>`).join(" ")}</div>
        <div><strong>Habilidades:</strong> ${data.abilities.map(a => `<span class="badge ability">${capitalize(a.ability.name)}</span>`).join(" ")}</div>
        <div class="metrics"><strong>Peso:</strong> ${data.weight / 10} kg</div>
        <div class="metrics"><strong>Altura:</strong> ${data.height / 10} m</div>
      </div>`;
  } catch (error) {
    container.innerHTML = "<p>Erro ao carregar dados do Pokémon.</p>";
  }
};

const pokemonId = getPokemonIdFromUrl();
if (pokemonId) fetchPokemonDetails(pokemonId);
else container.innerHTML = "<p>Pokémon não encontrado.</p>";