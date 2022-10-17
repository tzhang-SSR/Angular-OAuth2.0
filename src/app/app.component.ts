import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular-OAuth2';
  GoogleAuth: any;
  isAuthorized: boolean = false;
  user: any;
  username: string = 'username';

  DISCOVERY_DOCS: Array<string> = [
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
  ];
  SCOPES: string = "https://www.googleapis.com/auth/drive.metadata.readonly";
  API_KEY: string = "YOUR_API_KEY";
  CLIENT_ID: string = "YOUR_CLIENT_ID";


  constructor(private ngZone: NgZone) { }

  ngOnInit(): void {
    gapi.load("client:auth2", this.initClient);
  }

  initClient = () => {
    gapi.client
      .init({
        apiKey: this.API_KEY,
        discoveryDocs: this.DISCOVERY_DOCS,
        clientId: this.CLIENT_ID,
        scope: this.SCOPES,
      })
      .then(() => {
        this.ngZone.run(() => {
          this.GoogleAuth = gapi.auth2.getAuthInstance();
          this.GoogleAuth.isSignedIn.listen(this.updateSigninStatus);
          this.setSigninStatus();
        })
      });
  }

  setSigninStatus = () => {
    this.ngZone.run(() => {
      this.user = this.GoogleAuth.currentUser.get();
      this.isAuthorized = this.user.hasGrantedScopes(this.SCOPES);
      this.getUserName();
    })
  }

  updateSigninStatus = () => {
    this.ngZone.run(() => {
      this.setSigninStatus();
    });
  }

  getUserName = () => {
    const profile = this.user.getBasicProfile();
    this.username = profile?.zf;
  }

  handleAuthClick = () => {
    if (this.GoogleAuth.isSignedIn.get()) {
      this.GoogleAuth.signOut();
    } else {
      this.GoogleAuth.signIn();
    }
  }
}
