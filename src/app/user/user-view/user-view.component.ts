import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-user-view',
    templateUrl: './user-view.component.html',
    styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
    constructor(public authService: AuthService) {
    }

    public records: string[] = [];
    public userName: string;
    public userEntrance: number;

    ngOnInit() {
        this.userName = localStorage.getItem('userName');
        this.userEntrance = (Number(localStorage.getItem('entrance')));
    }
}
