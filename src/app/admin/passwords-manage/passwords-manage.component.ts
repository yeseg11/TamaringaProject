import { Component, OnInit } from '@angular/core';
import {AuthData} from '../../auth/auth-data.model';
import {ResearchService} from '../../researcher/research.service';
import {AuthService} from '../../auth/auth.service';
import {combineAll} from 'rxjs/operators';


@Component({
  selector: 'app-passwords-manage',
  templateUrl: './passwords-manage.component.html',
  styleUrls: ['./passwords-manage.component.css']
})
export class PasswordsManageComponent implements OnInit {
  userNames: string[] = [];
  private userAuth;
  map = new Map();
  headElements = ['ID', 'Password'];

  constructor(public researchesService: ResearchService, public authService: AuthService) { }

  ngOnInit() {
    this.researchesService.getPasswords();
    this.userAuth = this.researchesService.usersAuth;
    // this.userAuth = this.researchesService.usersAuth;
    // console.log('user auth', this.userAuth);

    for (const user of this.userAuth) {
      this.map.set(user.id, user.password);
    }
    // console.log(this.map);
   }

}
