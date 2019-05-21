import { Component, OnInit } from '@angular/core';
import {ResearchData} from '../research-data.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-researcher-view',
  templateUrl: './researcher-view.component.html',
  styleUrls: ['./researcher-view.component.css']
})

export class ResearcherViewComponent implements OnInit {
  storedResearches: ResearchData[] = [];

  constructor() { }

  ngOnInit() {
  }
}
