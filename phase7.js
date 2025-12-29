/**
 * Phase 7: API calls in code (Node.js)
 * 200 - success, 404 - HTTP error, DNS - network error
 * Uses built-in fetch (Node 18+)
 */

async function safeFetchJson(url) {
    try {
        const res = await fetch(url);

        // HTTP error
        if (!res.ok){
            const text = await res.text(); // don't assume JSON on errors
            return {
                ok: false,
                kind: "http_error",
                status: res.status,
                statusText: res.statusText,
                url: res.url,
                bodySnippet: text.slice(0, 120),
            };
        }

        const data = await res.json();
        return {
            ok: true,
            kind: "success",
            status: res.status,
            url: res.url,
            data
        };
    }   catch (err) {
        // Network error: DNS, offline, etc.
        return {
            ok: false,
            kind: "network_error",
            message: err?.message ?? String(err),
            url,
        };
    }
}

async function getPokemonSpeed(pokemonName){
    const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemonName)}`;
    const result = await safeFetchJson(url);
    
    if (!result.ok){
        return { ...result, message: `Request failed for "${pokemonName}"`};
    }

    const pokemon = result.data;
    const speedObj = pokemon.stats.find((s) => s.stat.name === "speed");

    return {
        ok: true,
        kind: "success",
        name: pokemon.name,
        speed: speedObj?.base_stat ?? null,
    };
}

async function main() {
    console.log(await getPokemonSpeed("pikachu"));
    console.log(await getPokemonSpeed("pikachoo"));

    // network/DNS failure test
    console.log(
        await safeFetchJson("https://pokeapi.coo/api/v2/pokemon/pikachu")
    );
}

main();