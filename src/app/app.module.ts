import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserViewComponent } from './user/user-view/user-view.component';

// create routing
const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'user', component: UserViewComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
