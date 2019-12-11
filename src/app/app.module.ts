import 'reflect-metadata';
import '../polyfills';

// angular core
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { environment } from '../environments/environment';
import { FireBaseConfig } from '../environments/firebaseConfig';

// firebase modules
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

//modules
import { AppRoutingModule } from './app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgAisModule } from 'angular-instantsearch';
// import { NgxEditorModule } from 'ngx-editor';

// components
import { UploadFormComponent } from './uploads/upload-form/upload-form.component';
import { LandingPersonalComponent } from './components/landing/landing-personal/landing-personal.component';
import { ToolkitMainComponent } from './components/toolkit/toolkit-main/toolkit-main.component';
import { NewCanvasComponent } from './components/toolkit/new-canvas/new-canvas.component';
import { NotesComponent } from './components/toolkit/notes/notes.component';
import { OverviewComponent } from './components/toolkit/overview/overview.component';
import { PgaComponent } from './components/toolkit/pga/pga.component';
import { GainpainratioComponent } from './components/toolkit/gainpainratio/gainpainratio.component';
import { CompetitorComponent } from './components/toolkit/competitor/competitor.component';
import { CanvasCollaborateComponent } from './components/toolkit/canvas-collaborate/canvas-collaborate.component';
import { LandingAboutComponent } from './components/landing/landing-about/landing-about.component';
import { NewsfeedComponent } from './components/toolkit/newsfeed/newsfeed.component';
import { LandingBizComponent } from './components/landing/landing-biz/landing-biz.component';
// import { MainComponent } from './components/main/main/main.component';
// import { NavbarComponent } from './components/navbar/navbar.component';
// import { FooterComponent } from './components/footer/footer.component';
// import { SignupComponent } from './components/signup/signup.component';
// import { ViewPitchPageComponent } from './components/pitch/view-pitch-page/view-pitch-page.component';
// import { PostPitchComponent } from './components/pitch/post-pitch/post-pitch.component';
import { InboxComponent } from './components/user/inbox/inbox.component';
import { ChatroomComponent } from './components/user/inbox/chatroom/chatroom.component';
// import { PitchesComponent } from './components/main/pitches/pitches.component';
// import { ChallengesComponent } from './components/main/challenges/challenges.component';
import { UserImgComponent } from './components/user/user-img/user-img.component';
import { UserNameComponent } from './components/user/user-name/user-name.component';
import { EditProfilePageComponent } from './components/user/edit-profile-page/edit-profile-page.component';
import { UserProfilePageComponent } from './components/user/user-profile-page/user-profile-page.component';
// import { PostChallengeComponent } from './components/challenge/post-challenge/post-challenge.component';
// import { ViewChallengePageComponent } from './components/challenge/view-challenge-page/view-challenge-page.component';
// import { OpenChatComponent } from './components/challenge/open-chat/open-chat.component';
// import { TrackerComponent } from './components/tracker/tracker.component';
// import { TrackerdataComponent } from './components/tracker/trackerdata/trackerdata.component';
// import { SubmitPitchToHackathonComponent } from './components/challenge/submit-pitch-to-hackathon/submit-pitch-to-hackathon.component';
// import { EachSubmissionComponent } from './components/challenge/view-challenge-page/each-submission/each-submission.component';
// import { EachsubmissionComponent } from './components/user/eachsubmission/eachsubmission.component';
// import { LandingBusinessComponent } from './components/landing/landing-business/landing-business.component';
// import { PaasTrialSignupComponent } from './components/landing/paas-trial-signup/paas-trial-signup.component';
// import { NavLandingBusinessComponent } from './components/landing/nav-landing-business/nav-landing-business.component';
import { ToolkitLoginComponent } from './components/toolkit/toolkit-login/toolkit-login.component';
import { PdpaComponent } from './components/toolkit/pdpa/pdpa.component';
import { LandingEmailCardComponent } from './components/landing/landing-email-card/landing-email-card.component';
import { BmcComponent } from './components/toolkit/bmc/bmc.component';
import { BmcChartsComponent } from './components/toolkit/bmc/bmc-charts/bmc-charts.component';
import { EvidenceComponent } from './components/toolkit/evidence/evidence.component';
import { LinkBmcComponent } from './components/toolkit/evidence/link-bmc/link-bmc.component';
import { AddEvidenceComponent } from './components/toolkit/evidence/add-evidence/add-evidence.component';
import { EvidenceCardComponent } from './components/toolkit/evidence/evidence-card/evidence-card.component';
import { ViewCanvasComponent } from './components/toolkit/view-canvas/view-canvas.component';

// guards
import {AuthGuard} from './guards/auth.guard';

// animation
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


// services
import { SeoService } from '../app/service/seo/seo.service';
import { AuthService } from '../app/service/auth.service';
import { ChallengeService } from '../app/service/challenge/challenge.service';
import { TrackerService } from '../app/service/tracker/tracker.service';
import { NotificationService } from '../app/service/notification/notification.service';
import { UserDataService } from './service/user-data.service';
import { IdeaDataService } from './service/idea-data.service';
import { ToolkitService } from './service/toolkit//toolkit.service';
import { UploadService } from '../app/uploads/shared/upload.service';
import { PitchService } from '../app/service/pitch/pitch.service';
import { ChatService } from './service/chat/chat.service';
import { PaasService } from './service/paas/paas.service';
import { NotesService } from './service/notes/notes.service';



// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HomeModule } from './home/home.module';

import { AppComponent } from './app.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    UploadFormComponent,
    LandingPersonalComponent,
    ToolkitMainComponent,
    NewCanvasComponent,
    OverviewComponent,
    PgaComponent,
    GainpainratioComponent,
    NotesComponent,
    CompetitorComponent,
    CanvasCollaborateComponent,
    LandingAboutComponent,
    NewsfeedComponent,
    LandingBizComponent,
    // MainComponent,
    // NavbarComponent,
    // FooterComponent,
    // SignupComponent,
    EditProfilePageComponent,
    UserProfilePageComponent,
    // ViewPitchPageComponent,
    // PostPitchComponent,
    InboxComponent,
    ChatroomComponent,
    // PitchesComponent,
    // ChallengesComponent,
    UserImgComponent,
    UserNameComponent,
    ToolkitLoginComponent,
    PdpaComponent,
    LandingEmailCardComponent,
    BmcComponent,
    EvidenceComponent,
    LinkBmcComponent,
    AddEvidenceComponent,
    BmcChartsComponent,
    EvidenceCardComponent,
    ViewCanvasComponent,
    // PostChallengeComponent,
    // ViewChallengePageComponent,
    // OpenChatComponent,
    // TrackerComponent,
    // TrackerdataComponent,
    // SubmitPitchToHackathonComponent,
    // EachSubmissionComponent,
    // EachsubmissionComponent,
    // LandingBusinessComponent,
    // PaasTrialSignupComponent,
    // NavLandingBusinessComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    HomeModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AngularFireModule.initializeApp(FireBaseConfig),
    AngularFirestoreModule.enablePersistence(), // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireDatabaseModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    // NgAisModule.forRoot(),
    // NgxEditorModule
  ],
  providers: [
    SeoService,
    ChallengeService,
    AuthService,
    UserDataService,
    IdeaDataService,
    UploadService,
    PitchService,
    ChatService,
    PaasService,
    NotificationService,
    TrackerService,
    ToolkitService,
    NotesService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
