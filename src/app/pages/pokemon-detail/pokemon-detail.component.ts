import { Component, ViewChild, ElementRef } from '@angular/core';
import { Pokemon } from "../../shared/interfaces/pokemon";
import { ApiService } from "../../shared/services/api.service";
import { ActivatedRoute } from "@angular/router";

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faVolumeLow } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss'
})
export class PokemonDetailComponent {

  pokemon!: Pokemon;

  fa = {
    faChevronLeft,
    faVolumeLow
  }

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
    // Récupération de l'identifiant du Pokémon dans l'URL
    this.route.params.subscribe(params => {
      if (params['pokemon_id']) {
        // Appel de l'API pour récupérer les informations du Pokémon
        this.apiService.requestApi(`/pokemon/${params['pokemon_id']}`)
          .then((response: Pokemon) => {
            this.pokemon = response;
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

}