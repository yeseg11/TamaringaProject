import {Component, OnInit} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {ResearchService} from '../research.service';
import {ResearchData} from '../research-data.model';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-new-research',
  templateUrl: './new-research.component.html',
  styleUrls: ['./new-research.component.css']
})
export class NewResearchComponent implements OnInit {
  toppings = new FormControl();
  toppingList: string[] = ['Yona', 'David', 'Miriam', 'Lea', 'Stella'];
  research: ResearchData;
  private mode = 'create';
  private researchId: string;


  constructor(public researchesService: ResearchService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('researchId)')) {
        this.mode = 'edit';
        this.researchId = paramMap.get('researchId');
        this.research = this.researchesService.getResearch(this.researchId);
      } else {
        this.mode = 'create';
        this.researchId = null;
      }
    });
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
