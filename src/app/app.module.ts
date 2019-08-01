import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';

// import of Angular Material Components that used for project
import {
  MatInputModule,
  MatCardModule,
  MatRadioModule,
  MatButtonModule,
  MatTabsModule,
  MatDialogModule,
  MatSelectModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatNativeDateModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatPaginatorModule,
  MatSortModule,
} from '@angular/material';

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
import {ErrorInterceptor} from './error-interceptor';
import {ErrorComponent} from './error/error.component';
import {ResearchListComponent} from './researcher/research-list/research-list.component';
import {CommonModule} from '@angular/common';
import { MusicListComponent } from './user/music-list/music-list.component';
import {MatIconModule} from '@angular/material/icon';
import { NewAdminComponent } from './admin/new-admin/new-admin.component';
import { NewResearcherComponent } from './admin/new-researcher/new-researcher.component';
// import { ResearchEditComponent } from './researcher/research-edit/research-edit.component';
import { PasswordsManageComponent } from './admin/passwords-manage/passwords-manage.component';

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
    AddMusicComponent,
    ErrorComponent,
    ResearchListComponent,
    MusicListComponent,
    NewAdminComponent,
    NewResearcherComponent,
    // ResearchEditComponent,
    PasswordsManageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    MatRadioModule,
    MatTabsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatExpansionModule,
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
],
  providers: [
    // we dont overwrite existing interceptors, adds it as an additional one. allow multiple interceptors in an app
    MatDatepickerModule,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  // simply informs Angular that this component is going to get used, even through Angular cant't see it
  entryComponents: [ErrorComponent]
})
export class AppModule { }
