import { Component, ViewChild, ElementRef } from '@angular/core';
import { Pokemon } from "../../shared/interfaces/pokemon";
import { ApiService } from "../../shared/services/api.service";
import { ActivatedRoute } from "@angular/router";

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faVolumeLow } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss']  // Attention au pluriel pour styles
})
export class PokemonDetailComponent {

  pokemon!: Pokemon;
  pokemonMoves: any[] = [];  // Pour stocker les moves du Pokémon
  pokemonEvolutionChain: any[] = []; // Pour stocker la chaîne d'évolution

  fa = {
    faChevronLeft,
    faVolumeLow
  }

  moveIcons: { [key: number]: string } = {
    1: 'https://img.pokemondb.net/images/icons/move-status.png',  // Icône pour les moves physiques
    2: 'https://img.pokemondb.net/images/icons/move-physical.png',   // Icône pour les moves spéciaux
    3: 'https://img.pokemondb.net/images/icons/move-special.png'     // Icône pour les moves de statut
  };

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      if (params['pokemon_id']) {
        // Charger les informations du Pokémon
        this.apiService.requestApi(`/pokemon/${params['pokemon_id']}`)
          .then((response: Pokemon) => {
            this.pokemon = response;
          });

        // Charger les moves du Pokémon
        this.apiService.requestApi(`/pokemon/${params['pokemon_id']}/moves`)
          .then((response: any) => {
            const moveIds = response.moves.map((move: any) => move.move_id);
            moveIds.forEach((moveId: number) => {
              this.apiService.requestApi(`/move/${moveId}/infos`)
                .then((moveInfo: any) => {
                  this.pokemonMoves.push(moveInfo);
                });
            });
          });

        // Charger la chaîne d'évolution du Pokémon
        this.apiService.requestApi(`/pokemon/${params['pokemon_id']}/chain`)
          .then((response: any) => {
            this.pokemonEvolutionChain = response.evolution_chain;
            console.log(this.pokemonEvolutionChain)
          });
      }
    });
  }


  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  playCry(cryUrl: string | undefined) {
    if (cryUrl) {
      const audio = this.audioPlayer.nativeElement;
      audio.src = cryUrl;
      audio.load();
      audio.play();
    } else {
      console.error('Aucun fichier audio disponible pour ce Pokémon.');
    }
  }

  getBackgroundStyle(pokemon: any): string {
    const types = pokemon.default_variety.types;

    if (types.length === 1) {
      const lighterColor = lightenColor(types[0].color, 30); // Éclaircir de 30%
      return `linear-gradient(135deg, ${types[0].color}, ${lighterColor})`;
    } else if (types.length >= 2) {
      return `linear-gradient(135deg, ${types[1].color}, ${types[0].color})`;
    }

    return 'linear-gradient(45deg, #FFFFFF, #FFFFFF)';
  }

  getTypeColor(pokemon: any): string {
    const types = pokemon.default_variety.types;
    return types.length > 1 ? types[1].color : types[0].color;
  }
}

function lightenColor(hex: string, percent: number): string {
  hex = hex.replace(/^#/, '');

  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 50)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 50)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 50)));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
