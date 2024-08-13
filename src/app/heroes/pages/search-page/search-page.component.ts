import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: [
  ]
})
export class SearchPageComponent {

  public searchInput = new FormControl('');
  public filteredHeroes: Observable<Hero[]> = new Observable();
  public selectedHero?: Hero;

  constructor(private heroesService: HeroesService) {}

  ngOnInit() {
    this.filteredHeroes = this.searchInput.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.heroesService.getSuggestions(value || '')),
      map(heroes => heroes.filter(hero => hero.superhero.toLowerCase().includes((this.searchInput.value || '').toLowerCase())))
    );
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent): void {
    this.selectedHero = event.option.value;
    
    if (this.selectedHero) {
      this.searchInput.setValue(this.selectedHero.superhero);
    }
  }

  onDeselectHero() {
    this.selectedHero = undefined;
    this.searchInput.setValue('');
  }
}
