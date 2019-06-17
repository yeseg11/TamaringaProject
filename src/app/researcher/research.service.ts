import { Injectable } from '@angular/core';
import { ResearchData } from './research-data.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {AuthData} from '../auth/auth-data.model';

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class ResearchService {
  private researches: ResearchData[] = [];
  private users: AuthData [] = [];
  private researchesUpdated = new Subject<ResearchData[]>();
  private usersUpdated = new Subject<AuthData[]>();
  private userNames: string[] = [];
  private flag = true;
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
          BACKEND_URL + '/researcher/new-research')
      // map - change an object to a string array ( change all the researches to an array)
      .pipe(map((researchData) => {
        // get all the researches from the server
        return researchData.researches.map(research => {
          return {
            name: research.name,
            participants: research.participants,
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
        // console.log('type from client: ' + this.researches);
      });
  }
  getResearchesUpdateListener() {
    return this.researchesUpdated.asObservable();
  }

  getResearch(id: string) {
    return {...this.researches.find(r => r.id === id)};
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
  createResearch(id: null, name: string, participants: string[], process: string, variables: string, startDate: string, endDate: string) {
    // create a const that save the user input
    const researchData: ResearchData = {id, name, participants,  process, variables, startDate, endDate};
    this.http.post<{ message: string, researchId: string}>(BACKEND_URL + '/researcher/new-research', researchData)
      .subscribe(response => {
        const researchId = response.researchId;
        researchData.id = researchId;
        // add the new research to the researches array
        this.researches.push(researchData);
        // update the array
        this.researchesUpdated.next([...this.researches]);
        console.log('new research: ', researchData);
      });
    // add the research to an array of researches
  }

  /** -------------------------------------------------------------------------
   * Delete a research definitely from the database
   * @PARAM {String*} researchId: Given research id
   * maybe need to add a popup window to ask the user if he's sure to want to delete the research
   */
  deleteResearch(researchId: string) {
    // delete from the url with a specific id
    this.http.delete(BACKEND_URL + '/researcher/new-research/' + researchId)
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

  getUsers() {
    this.http
      .get<{message: string, users: any }>(
        BACKEND_URL + '/user/users')
      .subscribe(response => {
        const userRes = response.users;
        for ( const user of userRes ) {
          for ( const userExist of this.userNames ) {
            if ( user.fullName === userExist ) {
              this.flag = false;
            } else {
              this.flag = true;
            }
          }
          if ( this.flag === true ) {
            this.userNames.push(user.fullName);
          }
        }
        this.flag = true;
      });
    console.log('users names: ', this.userNames);
    return this.userNames;
  }

  getUsersUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  getUser(id: number) {
    return {...this.users.find(r => r.id === id)};
  }
}
