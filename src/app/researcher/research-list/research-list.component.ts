import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { ResearchData } from '../research-data.model';
import { ResearchService } from '../research.service';
import { Subscription } from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-research-list',
  templateUrl: './research-list.component.html',
  styleUrls: ['./research-list.component.css']
})
export class ResearchListComponent implements OnInit , OnDestroy {
  @Output() myEvent = new EventEmitter();
  researches: ResearchData[] = [];
  private researchesSub: Subscription;
  // public: create a property researchesService, and store the incoming
  // researchesService into it
  constructor(public researchesService: ResearchService, private router: Router) {
  }

  ngOnInit(): void {
    this.researchesService.getResearches();
    this.researchesSub = this.researchesService.getResearchesUpdateListener()
      .subscribe((researches: ResearchData[]) => {
      this.researches = researches;
    });
  }

  /** -------------------------------------------------------------------------
   * Delete a research
   * @PARAM {String*} researchId: Given research id
   */

  onDelete(researchId: string) {
    this.researchesService.deleteResearch(researchId);

  }
  ngOnDestroy(): void {
    this.researchesSub.unsubscribe();
  }

  onEdit(researchId: string) {
    this.researchesService.editResearch(researchId);
  }
}
