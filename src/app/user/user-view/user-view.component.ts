import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  constructor() { }
  favoriteSeason: string;
  seasons: string[] = ['5', '4', '3', '2', '1'];

  // player: YT.Player;
  // private id = 'qDuKsiwS5xw';

  ngOnInit() {
  }

  // savePlayer(player) {
  //   this.player = player;
  //   console.log('player instance', player);
  // }
  // onStateChange(event) {
  //   console.log('player state', event.data);
  // }

}
