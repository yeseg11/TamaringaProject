import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// import of Angular Material Components that used for project
import { MatInputModule,
         MatCardModule,
         MatRadioModule,
         MatButtonModule,
         MatTabsModule,
         MatDialogModule,
         MatSelectModule,
         MatToolbarModule,
         MatProgressSpinnerModule,
         MatNativeDateModule
       } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Components in project
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { UserViewComponent } from './user/user-view/user-view.component';
import { AdminViewComponent } from './admin/admin-view/admin-view.component';
import { NewUserComponent } from './admin/new-user/new-user.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { HeaderComponent } from './header/header.component';
import { AuthGuard } from './auth/auth.guard';
import { NewResearchComponent } from './researcher/new-research/new-research.component';
import { ResearcherViewComponent } from './researcher/researcher-view/researcher-view.component';
import { AddMusicComponent } from './music/add-music/add-music.component';

// create routing
// we use canActivate that we have implemented in auth.guard service for routes we want to protect
const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'user', component: UserViewComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminViewComponent, canActivate: [AuthGuard] },
  { path: 'admin/new-user', component: NewUserComponent, canActivate: [AuthGuard] },
  { path: 'researcher', component: ResearcherViewComponent },
  { path: 'researcher/new-research', component: NewResearchComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserViewComponent,
    AdminViewComponent,
    NewUserComponent,
    HeaderComponent,
    NewResearchComponent,
    ResearcherViewComponent,
    AddMusicComponent
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
    FormsModule,
    MatSelectModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  providers: [
    // we dont overwrite existing interceptors, adds it as an additional one. allow multiple interceptors in an app
    MatDatepickerModule,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
