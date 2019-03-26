import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { Validators} from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';

// import of Angular Material Components that used for project
import { MatInputModule,
         MatCardModule,
         MatRadioModule,
         MatButtonModule,
         MatTabsModule,
         MatDialogModule
       } from '@angular/material';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Components in project
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserViewComponent } from './user/user-view/user-view.component';
import { AdminViewComponent } from './admin/admin-view/admin-view.component';
import { NewUserComponent } from './admin/new-user/new-user.component';

// create routing
const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'user', component: UserViewComponent },
  { path: 'admin', component: AdminViewComponent },
  { path: 'admin/new-user', component: NewUserComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserViewComponent,
    AdminViewComponent,
    NewUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    MatRadioModule,
    MatTabsModule,
    MatDialogModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
