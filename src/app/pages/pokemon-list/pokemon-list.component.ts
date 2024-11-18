import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { Paginate } from "../../shared/interfaces/paginate";
import { Pokemon } from "../../shared/interfaces/pokemon";

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements AfterViewInit {
  pokemonList?: Paginate<Pokemon>; // Pagination des Pokémon
  filteredPokemon: Pokemon[] = []; // Liste des Pokémon affichés
  searchTerm: string = ''; // Terme de recherche
  currentPage: number = 1; // Commencer à la page 1
  isLoading = false; // Indicateur de chargement
  loadedPokemonIds: Set<number> = new Set(); // IDs des Pokémon déjà chargés pour éviter les doublons

  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;

  constructor(
    public apiService: ApiService,
  ) { }

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.isLoading) {
        this.loadNextPokemonPage(); // Charger les Pokémon suivants au défilement
      }
    }, {
      rootMargin: '200px', // Seuil avant de charger plus de Pokémon
    });

    if (this.scrollAnchor) {
      observer.observe(this.scrollAnchor.nativeElement);
    }
  }

  // Charger les pages suivantes de Pokémon
  loadNextPokemonPage() {
    // Bloquer le chargement si une recherche est en cours
    if (this.searchTerm.trim().length > 0 || this.isLoading || (this.pokemonList && this.currentPage > this.pokemonList.last_page)) {
      return;
    }

    this.isLoading = true;

    this.apiService.requestApi('/pokemon', 'GET', { page: this.currentPage }).then((pokemons: Paginate<Pokemon>) => {
      if (!this.pokemonList) {
        this.pokemonList = pokemons; // Initialiser la liste de Pokémon
      } else {
        // Ajouter uniquement les Pokémon uniques (éviter les doublons)
        const uniquePokemons = pokemons.data.filter(pokemon => !this.loadedPokemonIds.has(pokemon.id));
        this.pokemonList.data = [...this.pokemonList.data, ...uniquePokemons];
        uniquePokemons.forEach(pokemon => this.loadedPokemonIds.add(pokemon.id));
      }

      this.currentPage++; // Passer à la page suivante
      this.applySearchFilter(); // Appliquer le filtre de recherche
      this.isLoading = false;
    }).catch(error => {
      console.error('Erreur lors du chargement des Pokémon :', error);
      this.isLoading = false;
    });
  }


  // Mise à jour de la recherche
  onSearchChange() {
    this.applySearchFilter(); // Filtrer les Pokémon en fonction de la recherche
  }

  // Applique le filtre de recherche sur la liste complète
  applySearchFilter() {
    if (this.searchTerm.length > 0 && this.pokemonList?.data) {
      const term = this.searchTerm.toLowerCase();
      this.filteredPokemon = this.pokemonList.data.filter(pokemon =>
        pokemon.name.toLowerCase().includes(term)
      );
    } else {
      this.filteredPokemon = this.pokemonList?.data || []; // Afficher tous les Pokémon si pas de recherche
    }
  }
}
