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
                        const lighterColor = lightenColor(types[0].color, 30); // Éclaircir de 30%
                        return `linear-gradient(135deg, ${types[0].color}, ${lighterColor})`;
                } else if (types.length >= 2) {
                        // Si le Pokémon a deux types, on fait un dégradé entre ces deux couleurs
                        return `linear-gradient(135deg, ${types[1].color}, ${types[0].color})`;
                }

                // Si pas de types (dans le cas improbable), retour à une couleur par défaut
                return 'linear-gradient(45deg, #FFFFFF, #FFFFFF)';
        }

        getShadowStyle(pokemon: any): string {
                const types = pokemon.default_variety.types;

                const primaryColor = types[0].color;
                return `0 4px 6px -1px ${primaryColor}, 0 2px 4px -1px ${primaryColor}`;
        }
}

function lightenColor(hex: string, percent: number): string {
        // Retire le # au début si présent
        hex = hex.replace(/^#/, '');

        // Convertit en valeurs RGB
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        // Applique la formule pour éclaircir
        r = Math.min(255, Math.floor(r + (255 - r) * (percent / 50)));
        g = Math.min(255, Math.floor(g + (255 - g) * (percent / 50)));
        b = Math.min(255, Math.floor(b + (255 - b) * (percent / 50)));

        // Convertit les valeurs RGB éclaircies en hexadécimal
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}