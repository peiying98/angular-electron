//Angular Core modules
import { NgModule } from '@angular/core';
import { PreloadAllModules, Routes, RouterModule } from '@angular/router';

//Components
import { PageNotFoundComponent } from './shared/components';

// import {MainComponent} from './components/main/main/main.component';
import {EditProfilePageComponent} from './components/user/edit-profile-page/edit-profile-page.component';
import {UserProfilePageComponent} from './components/user/user-profile-page/user-profile-page.component';
// import {ViewPitchPageComponent} from './components/pitch/view-pitch-page/view-pitch-page.component';
// import {PostPitchComponent} from './components/pitch/post-pitch/post-pitch.component';
// import {ViewChallengePageComponent} from './components/challenge/view-challenge-page/view-challenge-page.component';
// import {PostChallengeComponent} from './components/challenge/post-challenge/post-challenge.component';
import {InboxComponent} from './components/user/inbox/inbox.component';
import {ChatroomComponent} from '../app/components/user/inbox/chatroom/chatroom.component';
// import {TrackerComponent} from '../app/components/tracker/tracker.component';
// import {LandingBusinessComponent} from '../app/components/landing/landing-business/landing-business.component';
// import {PaasTrialSignupComponent} from '../app/components/landing/paas-trial-signup/paas-trial-signup.component';
import { LandingPersonalComponent } from './components/landing/landing-personal/landing-personal.component';
import {ToolkitMainComponent} from '../app/components/toolkit/toolkit-main/toolkit-main.component';
import { LandingAboutComponent } from './components/landing/landing-about/landing-about.component';
import { LandingBizComponent } from './components/landing/landing-biz/landing-biz.component';
import { ToolkitLoginComponent } from './components/toolkit/toolkit-login/toolkit-login.component';
import { PdpaComponent } from './components/toolkit/pdpa/pdpa.component';
import { ViewCanvasComponent } from './components/toolkit/view-canvas/view-canvas.component';

// Guards
import {AuthGuard} from '../app/guards/auth.guard';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
  {
    path: '**',
    component: PageNotFoundComponent
  },
  { path: '', component: LandingPersonalComponent},
  // { path: 'test-toolkit', component: LandingAboutComponent},
  { path: 'business',  redirectTo: '/enterprise'},
  { path: 'enterprise', component: LandingBizComponent},
  { path: 'login', component: ToolkitLoginComponent},
  { path: 'pdpa', component: PdpaComponent},
  { path: 'canvas/view/:id', component: ViewCanvasComponent},
  { path: 'canvas/edit/:id', component: ToolkitMainComponent, canActivate: [AuthGuard]},
  { path: 'toolkit', component: ToolkitMainComponent, canActivate: [AuthGuard]},
  { path: 'edit-profile', component: EditProfilePageComponent, canActivate: [AuthGuard]},
  { path: 'user/:id', component: UserProfilePageComponent, canActivate: [AuthGuard]},
  // { path: 'pitch/view/:id', component: ViewPitchPageComponent},
  // { path: 'pitch/post', component: PostPitchComponent},
  // { path: 'business', component: LandingBusinessComponent},
  // { path: 'business/trial-signup', component: PaasTrialSignupComponent},
  // { path: 'challenge/view/:id', component: ViewChallengePageComponent},
  // { path: 'challenge/postRyanisAwesome93', component: PostChallengeComponent},
  { path: 'inbox', component: InboxComponent ,canActivate: [AuthGuard]},
  { path: 'inbox/:id', component: ChatroomComponent ,canActivate: [AuthGuard]},
  // { path: 'tracker11264b', component: TrackerComponent ,canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
      useHash: true ,    
      preloadingStrategy: PreloadAllModules
    })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
