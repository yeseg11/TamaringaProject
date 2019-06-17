import {Component, OnInit} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {ResearchService} from '../research.service';
import {ResearchData} from '../research-data.model';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {AuthData} from '../../auth/auth-data.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-new-research',
  templateUrl: './new-research.component.html',
  styleUrls: ['./new-research.component.css']
})
export class NewResearchComponent implements OnInit {
  // usersList = new FormControl();
  research: ResearchData;
  private mode = 'create';
  private researchId: string;
  private usersSub: Subscription;
  public participants: any;
  public variables: any;
  private sDate: string;
  private eDate: string;
  userNames: string[] = [];
  users: AuthData[] = [];


  constructor(public researchesService: ResearchService, public route: ActivatedRoute) {
  }

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

    this.userNames = this.researchesService.getUsers();
    this.usersSub = this.researchesService.getUsersUpdateListener()
      .subscribe((users: AuthData[]) => {
        this.users = users;
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
    this.sDate = form.value.startDate.getDay() + '/' + form.value.startDate.getMonth() + '/' + form.value.startDate.getFullYear();
    this.eDate = form.value.endDate.getDay() + '/' + form.value.endDate.getMonth() + '/' + form.value.endDate.getFullYear();
    this.researchesService.createResearch(form.value.id,
                                          form.value.name,
                                          form.value.participants,
                                          form.value.process,
                                          form.value.variables,
                                          this.sDate,
                                          this.eDate);
    console.log('server: createResearch()');
    form.resetForm();
  }



}
