import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { NavController, AlertController, Platform, LoadingController, MenuController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	username: string = ""
	password: string = ""
	// formErr: string = "";
	btn: boolean = false;

	validations_form:FormGroup;
	errorMessage: string = '';
	
	CopyTextAreaText:string = "Sample text to copy!";
	PasteTextAreaText:string = "Paste here!";
	constructor(
	//   private service: AuthService, 
	  private formBuilder: FormBuilder,
	  private navCtrl: NavController,
	  public alertCtrl:AlertController,
	  public af: AngularFireAuth,
	  public afAuth: AngularFireAuth, 
	  public user: UserService, 
	  public router: Router,
	  private platform: Platform, 
	  public loadingController: LoadingController,
	  private splashScreen: SplashScreen,
	   private menuCtrl: MenuController,
	   private clipboard: Clipboard

	  ) { }
  
	
  
	ngOnInit() {
	//   this.validations_form = this.formBuilder.group({
	// 	email: new FormControl('', Validators.compose([
	// 	  Validators.required,
	// 	//   Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
	// 	])),
	// 	password: new FormControl('', Validators.compose([
	// 	  Validators.minLength(5),
	// 	  Validators.required
	// 	])),
	//   });
	}
	//Copy Event
	copyText(){
		this.clipboard.copy(this.CopyTextAreaText);
	  }
	 
	  //Paste Event
	  pasteText(){
		this.clipboard.paste().then(
		  (resolve: string) => {
			 this.PasteTextAreaText = resolve;
			 console.log(resolve);
		   },
		   (reject: string) => {
			 console.error('Error: ' + reject);
		   }
		 );
	  }
	 
	  //Clear Event
	  clearClipboard(){
		this.clipboard.clear();
	  }
	 
  
   
	validation_messages = {
	  'email': [
		{ type: 'required', message: 'Email is required.' },
		{ type: 'pattern', message: 'Please enter a valid email.' }
	  ],
	  'password': [
		{ type: 'required', message: 'Password is required.' },
		{ type: 'minlength', message: 'Password must be at least 5 characters long.' }
	  ]
	};
	
	async login() {
		const { username, password } = this
		try {
			// kind of a hack. 
			const res = await this.afAuth.auth.signInWithEmailAndPassword(username + '@codedamn.com', password)
			
			if(res.user) {
				this.user.setUser({
					username,
					uid: res.user.uid
				})
				this.router.navigate(['/tabs'])
				this.errorMessage = "";
			}
		
		} catch(err) {
			this.errorMessage = err.message;
			console.dir(err)
			if(err.code === "auth/user-not-found") {
				console.log("User not found")
			}
		}
	}
	goToRegisterPage(){
		this.navCtrl.navigateForward('/register');
	  }
	  wantsToLoginWithCredentials: boolean = false;
	  email: string = '';
	//   password: string = '';
	  error: string = '';
	 
	  ionViewDidEnter() {
		this.menuCtrl.enable(false, 'start');
		this.menuCtrl.enable(false, 'end');
		this.platform.ready().then(() => {
		  this.splashScreen.hide();
		});
	  }
	 
	   signInAnonymously() {
		return new Promise<any>((resolve, reject) => {
		  this.afAuth.auth.signInAnonymously().then((data) => {
			resolve(data);
			this.router.navigate(['/tabs'])
		  }).catch((error) => {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
	
			reject(`login failed ${error.message}`)
			// ...
		  });
		  this.router.navigate(['/tabs'])
		});
	  }
	  async openLoader() {
		const loading = await this.loadingController.create({
		  message: 'Please Wait ...',
		  duration: 2000
		});
		await loading.present();
	  }
	  async closeLoading() {
		return await this.loadingController.dismiss();
	  }
	}

