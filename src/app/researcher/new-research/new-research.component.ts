import { Component, OnInit } from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {ResearchService} from '../research.service';
import {ResearchData} from '../research-data.model';

@Component({
  selector: 'app-new-research',
  templateUrl: './new-research.component.html',
  styleUrls: ['./new-research.component.css']
})
export class NewResearchComponent implements OnInit {
  toppings = new FormControl();
  toppingList: string[] = ['Yona', 'David', 'Miriam', 'Lea', 'Stella'];

  constructor(public researchesService: ResearchService) { }
  ngOnInit() {
  }
  /** -------------------------------------------------------------------------
   * Add research with the user inout
   * @PARAM {NgForm*} form: user input
   */
  onAddResearch(form: NgForm) {
    if (form.invalid) {
      console.log('invalid form');
      return;
    }
    this.researchesService.createResearch(form.value.id,
                                          form.value.name,
                                          // form.value.participants,
                                          form.value.process,
                                          form.value.variables,
                                          form.value.startDate,
                                          form.value.endDate);
    console.log('server: createResearch()');
    form.resetForm();
  }



}
