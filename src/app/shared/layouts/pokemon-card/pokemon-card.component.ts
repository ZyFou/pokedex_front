import { Component, Input } from '@angular/core';
import { Pokemon } from "../../interfaces/pokemon";

@Component({
        selector: 'app-pokemon-card',
        templateUrl: './pokemon-card.component.html',
        styleUrl: './pokemon-card.component.scss'
})
export class PokemonCardComponent {
        @Input() pokemon!: Pokemon;
        getBackgroundStyle(pokemon: any): string {
                const types = pokemon.default_variety.types;

                if (types.length === 1) {
                        // Si le Pokémon n'a qu'un type, on fait un dégradé vers du blanc
                        return `linear-gradient(120deg, ${types[0].color}, #FFFFFF)`;
                } else if (types.length >= 2) {
                        // Si le Pokémon a deux types, on fait un dégradé entre ces deux couleurs
                        return `linear-gradient(120deg, ${types[1].color}, ${types[0].color})`;
                }

                // Si pas de types (dans le cas improbable), retour à une couleur par défaut
                return 'linear-gradient(45deg, #FFFFFF, #FFFFFF)';
        }
}