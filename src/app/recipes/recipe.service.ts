import {Injectable, EventEmitter} from '@angular/core';
import {Recipe} from './recipe';
import {Ingredient} from "./shared/ingredient";
import {Headers, Http, Response} from "@angular/http";
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RecipeService {
  recipesChanged = new EventEmitter<Recipe[]>();
  private recipes: Recipe[] = [];

  private defaultRecipes: Recipe[] = [
    new Recipe('Parmesan Chicken', 'Fried breaded chicken topped with a white béchamel sauce and cheese', 'http://images.media-allrecipes.com/userphotos/250x250/618489.jpg', [
      new Ingredient('Eggs', 2),
      new Ingredient('Chicken Breast', 4),
      new Ingredient('Grated Parmesan cheese', 1)
    ]),
    new Recipe('Baby back ribs', 'Grilled pork ribs', 'http://www.amazingtaste.com/wp-content/uploads/2013/10/Margarita-Baby-Back-RIbs-iStock_000018367441Medium.jpg', [
      new Ingredient('Full rack of pork ribs', 2),
      new Ingredient('Tablespoons kosher salt', 3),
      new Ingredient('Tablespoons chili powder', 2)
    ]),
    new Recipe('Teriyaki Salmon', 'Salmon with teriyaki sauce', 'http://healthyrecipesblogs.com/wp-content/uploads/2014/07/teriyaki-salmon1.jpg', [
      new Ingredient('6 ounce salmon fillets', 4),
      new Ingredient('1/4 teaspoon garlic powder', 1)
    ])
  ];

  constructor(private http: Http) {
    this.fetchData();
   /* this.fetchData().then((response: Response) => {
      this.recipes = (this.recipes && this.recipes.length) ? this.recipes : this.defaultRecipes.slice();
    });*/
  }

  getRecipes() {
    return this.recipes;
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  deleteRecipe(recipe: Recipe) {
    this.recipes.splice(this.recipes.indexOf(recipe), 1)
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
  }

  editRecipe(oldRecipe: Recipe, newRecipe: Recipe) {
    this.recipes[this.recipes.indexOf(oldRecipe)] = newRecipe;
  }

  storeData() {
    const body = JSON.stringify(this.recipes);
    const headers = new Headers({
      'Content-type': 'application/json'
    });

    return this.http.put('https://recipe-book-c5960.firebaseio.com/recipes.json', body, {
      headers: headers
    })
  }

  fetchData() {
    const request = this.http.get('https://recipe-book-c5960.firebaseio.com/recipes.json');

    request.map((response: Response) => response.json())
      .subscribe((data: Recipe[]) => {
        /*this.recipes = data;*/
        this.recipes = (data && data.length) ? data : this.defaultRecipes.slice();
        this.recipesChanged.emit(this.recipes);
      });

    return request.toPromise();
  }
}
