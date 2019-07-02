import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import {LoginComponent} from './auth/login/login.component';
import {UserViewComponent} from './user/user-view/user-view.component';
import {AdminViewComponent} from './admin/admin-view/admin-view.component';
import {NewUserComponent} from './admin/new-user/new-user.component';
import {ResearcherViewComponent} from './researcher/researcher-view/researcher-view.component';
import {NewResearchComponent} from './researcher/new-research/new-research.component';
import {AddMusicComponent} from './music/add-music/add-music.component';
import {NewAdminComponent} from './admin/new-admin/new-admin.component';
import {ResearchEditComponent} from './researcher/research-edit/research-edit.component';

// create routing
// we use canActivate that we have implemented in auth.guard service for routes we want to protect
const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'user', component: UserViewComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminViewComponent, canActivate: [AuthGuard] },
  { path: 'admin/new-user', component: NewUserComponent, canActivate: [AuthGuard] },
  { path: 'admin/new-admin', component: NewAdminComponent },
  { path: 'researcher', component: ResearcherViewComponent },
  { path: 'researcher/new-research', component: NewResearchComponent },
  { path: 'add-music', component: AddMusicComponent },
  { path: 'edit/:researchId', component: ResearchEditComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
