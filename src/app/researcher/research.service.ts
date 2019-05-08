import { Injectable } from '@angular/core';
import { ResearchData} from './research-data.model';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class ResearchService {

  constructor(private http: HttpClient, private router: Router) {
  }
  createResearch(name: string,
                 id: number,
                 // participants: string,
                 process: string,
                 variables: string,
                 startDate: Date,
                 endDate: Date) {
    const researchData: ResearchData = {name: name,
                                        id: id,
                                        // participants: participants,
                                        process: process,
                                        variables: variables,
                                        startDate: startDate,
                                        endDate: endDate};
    this.http.post('http://localhost:3000/api/researcher/new-research', researchData)
      .subscribe(response => {
        console.log('response from server: ');
        console.log(response);
        console.log('research created');
      });
  }
}
