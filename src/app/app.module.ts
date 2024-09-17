import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {provideHttpClient} from "@angular/common/http";
import { PokemonListComponent } from './pages/pokemon-list/pokemon-list.component'; // Import du provider

@NgModule({
  declarations: [
    AppComponent,
    PokemonListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(), // Ajout du provider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }