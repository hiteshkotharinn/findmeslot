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

  constructor(
    private http: HttpClient) {
  }

  ngOnInit() {
    this.currentDate =  new Date().toISOString().split('T')[0];
    this.getSlotData();
    this.id = setInterval(() => {
      this.getSlotData();
    }, 5000);
  }

  getSlotData() {
    this.centerData = [];
    this.getSlotService().subscribe(
      response => {
        if (response) {
          this.online = true;
          let res = response.centers;
          // this.toastService.showSuccess("Welcome");
          console.log(response.centers);
          for (let i = 0; i < res.length; i++) {
            this.centerData.push(res[i]);
          };
        }
        this.findSlot(this.centerData);
        console.log(this.centerData);
      },
      (error: HttpErrorResponse) => {
        this.online = false;
        if (error instanceof HttpErrorResponse) {
          console.log("Client-side error occured.");
        } else {
          // this.toastService.ShowError(error);
        }
      }
    );
  }

  findSlot(data: any) {
    this.availableSlot = data.filter(function (el) {
      return el.sessions[0].available_capacity > 0
      // &&
      //        el.sqft >= 500 &&
      //        el.num_of_beds >=2 &&
      //        el.num_of_baths >= 2.5;
    });
    console.log(this.availableSlot)
    if(this.availableSlot.length > 0 ){
      this.onAudioPlay()
    }else{
      this.onAudioStop();
    }
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  getSlotService() {
    let date = new DatePipe('en-US').transform(this.currentDate, 'dd-MM-yyyy')
    return this.http.get<any>("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=367&date=" + date);
  }

  date(ev:any){
    this.currentDate = ev.target.value;
    console.log(ev.target.value)
  }


onAudioPlay(){
  this.audioPlayerRef.nativeElement.play();
}

onAudioStop(){
  this.audioPlayerRef.nativeElement.pause();
}
  
}
