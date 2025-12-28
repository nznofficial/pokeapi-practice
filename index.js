import fetch from "node-fetch";

async function getPokemon(name){
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await res.json();
    console.log(data);
}

getPokemon("pikachu");