import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ubold',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('audioOption', { static: true }) audioPlayerRef: ElementRef;

  id: any;
  centerData = [];
  availableSlot = [];
  currentDate: any;
  online: boolean = false;
  lastUpdateOn: any;
  mobile: boolean = false;
  allSessions = [];
  allSessionsDetails = [];
  nextWeekDate: any;

  constructor(
    private http: HttpClient) {
  }

  ngOnInit() {
    if (window.screen.width < 600) { // 768px portrait
      this.mobile = true;
    }
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 7);
    this.nextWeekDate = tomorrow.toISOString().split('T')[0];
    // console.log(tomorrow)
    this.currentDate = new Date().toISOString().split('T')[0];
    this.getSlotData(this.currentDate);
    this.getSlotData(this.nextWeekDate);
    this.id = setInterval(() => {
      this.getSlotData(this.currentDate);
      this.getSlotData(this.nextWeekDate);
    }, 5000);
  }

  getSlotData(dt: any) {
    this.centerData = [];
    this.getSlotService(dt).subscribe(
      response => {
        if (response) {
          this.online = true;
          this.lastUpdateOn = new Date();
          let res = response.centers;
          // this.toastService.showSuccess("Welcome");
          //console.log(response.centers);
          for (let i = 0; i < res.length; i++) {
            this.centerData.push(res[i]);
          };
        }
        this.findSlot(this.centerData);
        //console.log(this.centerData);
      },
      (error: HttpErrorResponse) => {
        this.online = false;
        this.onAudioStop();
        if (error instanceof HttpErrorResponse) {
          console.log("Client-side error occured.");
        } else {
          // this.toastService.ShowError(error);
        }
      }
    );
  }

  findSlot(data: any) {
    this.allSessions = [];
    this.allSessionsDetails = [];
    this.availableSlot = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].sessions.length; j++) {
        // console.log(data[i].sessions[j])
        this.allSessions.push(data[i].sessions[j])
        this.allSessionsDetails.push(data[i]);
      }
    }
    //console.log(this.allSessionsDetails);

    this.availableSlot = this.allSessionsDetails.filter(function (el) {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].sessions.length; j++) {
          return el.sessions[j].available_capacity > 0
        }
      }
    });

    //console.log(this.availableSlot)

    if (this.availableSlot.length > 0) {
      this.onAudioPlay()
    } else {
      this.onAudioStop();
    }
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  getSlotService(dt: any) {
    let date = new DatePipe('en-US').transform(dt, 'dd-MM-yyyy')
    return this.http.get<any>("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=367&date=" + date);
  }

  date(ev: any) {
    this.currentDate = ev.target.value;
    console.log(ev.target.value)
  }


  onAudioPlay() {
    this.audioPlayerRef.nativeElement.play();
  }

  onAudioStop() {
    this.audioPlayerRef.nativeElement.pause();
  }

}
