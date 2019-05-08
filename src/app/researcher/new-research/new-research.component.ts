import { Component, OnInit } from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {ResearchService} from '../research.service';

@Component({
  selector: 'app-new-research',
  templateUrl: './new-research.component.html',
  styleUrls: ['./new-research.component.css']
})
export class NewResearchComponent implements OnInit {
  toppings = new FormControl();
  toppingList: string[] = ['Yona', 'David', 'Miriam', 'Lea', 'Stella'];
  constructor(public researchService: ResearchService) { }
  ngOnInit() {
  }

  onAddResearch(form: NgForm) {
    console.log('client');
    console.log(form.value);
    if (form.invalid) {
      console.log('invalid form');
      return;
    }
    // set the spinner loading to true
    // this.isLoading = true; not working
    this.researchService.createResearch(form.value.name,
                                        form.value.id,
                                        // form.value.participants,
                                        form.value.process,
                                        form.value.variables,
                                        form.value.startDate,
                                        form.value.endDate);
    console.log('server: createResearch()');
    // form.resetForm();
  }

}
