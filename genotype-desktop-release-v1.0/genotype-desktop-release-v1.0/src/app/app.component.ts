import { Component, OnDestroy, OnInit } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,OnDestroy {
  deviceID: any;
  private unSubscribe$ : Subject<void>= new Subject();
  isOnline = navigator.onLine
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang('en');
    // const myId = uuid.v4();
    // localStorage.setItem('deviceId', myId);
    console.log('APP_CONFIG', APP_CONFIG);
    console.log('deviceId');
    // this.electronService.deviceId = "testdevice1"
    const deviceId = this.electronService.deviceId;
    console.log(deviceId);
    localStorage.setItem('deviceId',deviceId);


    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
      console.log('remote', this.electronService.deviceId);
    } else {
      console.log('Run in browser');
      localStorage.setItem('userList', JSON.stringify([]))
      JSON.parse(localStorage.getItem('userList'))
    }
  }

  ngOnInit(): void {
    this.addNetworkListener()
    localStorage.setItem('isOnline',this.isOnline ? 'true' : 'false')
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
  }

  addNetworkListener(){
    fromEvent(window,'online').pipe(takeUntil(this.unSubscribe$)).subscribe((event)=>{
      console.log('internet conn before ', this.isOnline)
      this.isOnline = true
      localStorage.setItem('isOnline','true')
    })
    fromEvent(window,'offline').pipe(takeUntil(this.unSubscribe$)).subscribe((event)=>{
      console.log('internet conn after ', this.isOnline)
      this.isOnline = false
      localStorage.setItem('isOnline','false')

    })
  }
}
