import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-new-research',
  templateUrl: './new-research.component.html',
  styleUrls: ['./new-research.component.css']
})
export class NewResearchComponent implements OnInit {
  toppings = new FormControl();
  toppingList: string[] = ['Yona', 'David', 'Miriam', 'Lea', 'Stella'];
  constructor() { }

  ngOnInit() {
  }

}
