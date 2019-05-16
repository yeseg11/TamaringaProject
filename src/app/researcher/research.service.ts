import { Injectable } from '@angular/core';
import { ResearchData } from './research-data.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ResearchService {
  private researches: ResearchData[] = [];
  private researchesUpdated = new Subject<ResearchData[]>();

  constructor(private http: HttpClient, private router: Router) {
  }

  /** -------------------------------------------------------------------------
   * Return the researches from the DB
   * the map method change the object we get to an array and we put this array to "researches" array.
   */
// get research from the server
  getResearches() {
    this.http
      .get<{message: string, researches: any }>(
        'http://localhost:3000/api/researcher/new-research')
      // map - change an object to a string array ( change all the researches to an array)
      .pipe(map((researchData) => {
        // get all the researches from the server
        return researchData.researches.map(research => {
          return {
            name: research.name,
            // participants: string,
            process: research.process,
            variables: research.variables,
            startDate: research.startDate,
            endDate: research.endDate,
            id: research._id,
          };
        });
      }))
      .subscribe(transformedResearch => {
        // put the transformed object to an array to the researches array
        this.researches = transformedResearch;
        this.researchesUpdated.next([...this.researches]);
        console.log('type from client: ' + this.researches);
      });
  }
  getResearchesUpdateListener() {
    return this.researchesUpdated.asObservable();
  }

  /** -------------------------------------------------------------------------
   * Add a new research to the database
   * @PARAM {String*} id: Given research id
   * @PARAM {String*} name: Given research name
   * @PARAM {String*} process: Given research process
   * @PARAM {String*} variables: Given research variables
   * @PARAM {Date*} startDate: Given research startDate
   * @PARAM {Date*} endDate: Given research endDate
   */
  createResearch(id: null,
                 name: string,
                 // participants: string,
                 process: string,
                 variables: string,
                 startDate: Date,
                 endDate: Date) {
    // create a const that save the user input
    const researchData: ResearchData = {id: id,
                                        name: name,
                                        // participants: participants,
                                        process: process,
                                        variables: variables,
                                        startDate: startDate,
                                        endDate: endDate};
    // add the new research to the researches array
    this.researches.push(researchData);
    // update the array
    this.researchesUpdated.next([...this.researches]);
    // send the data to the database
    this.http.post('http://localhost:3000/api/researcher/new-research', researchData)
      .subscribe(response => {
        console.log('response from server: ');
        console.log(response);
        console.log('type:' + typeof(response));
        console.log('research created');
      });
    // add the research to an array of researches like in Maximillian video
  }

  /** -------------------------------------------------------------------------
   * Delete a research definitely from the database
   * @PARAM {String*} researchId: Given research id
   * maybe need to add a popup window to ask the user if he's sure to want to delete the research
   */
  deleteResearch(researchId: string) {
    // delete from the url with a specific id
    this.http.delete('http://localhost:3000/api/researcher/new-research/' + researchId)
      .subscribe(() => {
        // the updated research stays will all the researches that has not the specific id
        // ( that means that the research with the specific id will be removed)
        const updatedResearches = this.researches.filter(research => research.id !== researchId);
        // update the researches array
        this.researches = updatedResearches;
        this.researchesUpdated .next([...this.researches]);
        console.log('deleted');
      });
  }
}
