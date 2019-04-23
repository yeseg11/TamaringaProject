import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData} from './auth-data.model';

@Injectable({ providedIn: 'root'})
export class AuthService {

  constructor(private http: HttpClient) {
  }

//   createUser(id: string, password: string) {
//     const authData: AuthData = {id: id, password: password};
//     this.http.post('http://localhost:3200/api/user/signup', authData)
//       .subscribe(response => {
//         console.log(response);
//       });
//   }
// }


  createUser(fullName: string, id: string, password: string, country: string) {
    const authData: AuthData = {fullName: fullName, id: id, password: password, country: country};
    this.http.post('http://localhost:3200/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }
}
