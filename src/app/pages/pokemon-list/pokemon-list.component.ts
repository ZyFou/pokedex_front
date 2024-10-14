import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { Paginate } from "../../shared/interfaces/paginate";
import { Pokemon } from "../../shared/interfaces/pokemon";

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'], // Correction de "styleUrl" en "styleUrls"
})
export class PokemonListComponent implements AfterViewInit {

  pokemonList?: Paginate<Pokemon>;
  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef; // Référence à l'ancre de scroll
  isLoading = false; // Indicateur pour éviter les requêtes simultanées

  constructor(
    public apiService: ApiService,
  ) {
    this.loadNextPokemonPage(); // Charge initialement la première page
  }

  ngAfterViewInit() {
    // Créer l'observer pour détecter le bas de la page
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.isLoading) {
        this.loadNextPokemonPage(); // Charge plus de Pokémon si on est en bas
      }
    }, {
      rootMargin: '200px', // Seuil de détection pour activer le chargement plus tôt
    });

    // Observer l'élément d'ancre
    if (this.scrollAnchor) {
      observer.observe(this.scrollAnchor.nativeElement);
    }
  }

  // Fonction pour charger la page suivante des pokémons
  loadNextPokemonPage() {
    // On crée le numéro de la page à charger
    let page = this.pokemonList ? this.pokemonList.current_page + 1 : 1;

    // Charger la page suivante si on n'a pas atteint la dernière page
    if (!this.pokemonList || this.pokemonList.current_page < this.pokemonList.last_page) {
      this.isLoading = true; // Indique que le chargement est en cours
      this.apiService.requestApi('/pokemon', 'GET', { page }).then((pokemons: Paginate<Pokemon>) => {
        // On ajoute les pokémons à la liste existante
        if (!this.pokemonList) {
          this.pokemonList = pokemons;
        } else {
          // Concatène les nouvelles données
          let datas = this.pokemonList.data.concat(pokemons.data);
          this.pokemonList = { ...pokemons, data: datas };
        }
        this.isLoading = false; // Réinitialise l'état de chargement
      }).catch(error => {
        console.error("Erreur lors du chargement des Pokémon : ", error);
        this.isLoading = false; // Réinitialise l'état de chargement même en cas d'erreur
      });
    }
  }
}
