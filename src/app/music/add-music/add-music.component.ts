import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-add-music',
  templateUrl: './add-music.component.html',
  styleUrls: ['./add-music.component.css']
})
export class AddMusicComponent implements OnInit {
  country: any;

  constructor() { }

  onAddMusic(form: NgForm) {

  }

  ngOnInit() {
  }

}
