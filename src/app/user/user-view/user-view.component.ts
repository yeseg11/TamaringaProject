import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  favoriteSeason: string;
  seasons: string[] = ['5', '4', '3', '2', '1'];
  constructor() { }

  ngOnInit() {
  }

}
