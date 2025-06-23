const container = document.getElementById("pokemon-container");
    const searchInput = document.getElementById("search");
    const pageSize = 20;
    
    let totalPokemon = 0;
    allPokemon = [];
    let allPokemonWithInfo = [];
    let currentIndex = 1;
    let isLoading = false;
  
    async function loadAllPokemon() {
      try {
        // 1️⃣ Primeiro busca o total
        const response = await fetch('https://pokeapi.co/api/v2/pokemon');
        if (!response.ok) {
          console.error('Não foi possível obter o total de Pokémon.');
          return null;
        }

        const responseJson = await response.json();
        totalPokemon = responseJson.count;

        const allDataResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=${totalPokemon}`);
        if (!allDataResponse.ok) {
          console.error('Não foi possível carregar todos os Pokémon.');
          return null;
        }

        const allData = await allDataResponse.json();
        allPokemon = allData.results;
        loadMorePokemon();
      } catch (error) {
        console.error("Erro ao buscar Pokémon:", error);
        return null;
      }
    }


    async function findPokemonByName(identifier) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
        if (!response.ok) return null;
        return await response.json();
      } catch (error) {
        console.error("Erro ao buscar Pokémon:", error);
        return null;
      }
    }
  
    async function loadMorePokemon() {
      if (isLoading) return;
  
      isLoading = true;
  
      const endIndex = Math.min(currentIndex + pageSize - 1, totalPokemon);
      for (let id = currentIndex; id <= endIndex; id++) {
        const data = await findPokemonByName(id);
        if (data) {
          allPokemonWithInfo.push(data);
          renderPokemon(data);
        }
      }
      currentIndex = endIndex + 1;
  
      isLoading = false;
    }
  
    function renderPokemon(data) {
      const card = document.createElement("div");
      card.className = "pokemon-card";
      card.innerHTML = `
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <div class="pokemon-name">${capitalize(data.name)}</div>
        <div class="pokemon-type">${data.types.map(t => capitalize(t.type.name)).join(", ")}</div>
      `;

      card.addEventListener("click", () => {
        window.location.href = `pokemon.html?id=${data.id}`;
      });

      container.appendChild(card);
    }
  
    function capitalize(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  
    async function handleSearch(pokemonName) {
      container.innerHTML = ""; 

      if (
        pokemonName == null
        || pokemonName == ''
      ) {
        allPokemonWithInfo.forEach(renderPokemon);
        return;
      }
  
      const data = await findPokemonByName(pokemonName);
      if(!data){
        container.innerHTML = "<p>Nenhum Pokémon encontrado para esta pesquisa.</p>";
        return;
      }

      renderPokemon(data);
    }
  
    async function onSearchInput(pokemonName) {
      const pokemonNameList = document.getElementById('pokemon-name-list');
      const search = document.getElementById('search');

      search.value = pokemonName;
      pokemonNameList.innerHTML = '';
      await handleSearch(pokemonName);
    }
  
    async function onScroll() {
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  
      if (scrolledToBottom && !searchInput.value) {
        await loadMorePokemon();
      }
    }

    function loadAllPokemonNameList(event) {
      const setTimeOutId = setTimeout(
          () => {
            const pokemonNameList = document.getElementById('pokemon-name-list');

            if(pokemonNameList == null){
              return null;
            }

            pokemonNameList.innerHTML = '';

            if(
              allPokemon.length == 0
              && allPokemon.name == null
            ){
              return;
            }

            if(
              event.target.value == null
              || event.target.value == ''
            ){
                handleSearch();
              return;
            }

            const filteredPokemonNames = allPokemon.filter((pokemonItem) =>
              pokemonItem.name.toLowerCase().includes(event.target.value)
            );

            if(filteredPokemonNames.length == 0){
              return;
            }

            filteredPokemonNames.forEach(pokemonItem => {
              pokemonNameList.innerHTML += `<li onclick="onSearchInput('${pokemonItem.name}')">${pokemonItem.name}</li>`;
            });
            clearTimeout(setTimeOutId);
        }, 
        500
      );
    }
  
    // Event Listeners
    searchInput.addEventListener("input", loadAllPokemonNameList);
    window.addEventListener("scroll", onScroll);
  
    // Inicialização
    loadAllPokemon();