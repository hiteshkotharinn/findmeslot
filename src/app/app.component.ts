import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AppService } from './app.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ubold',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('audioOption', { static: true }) audioPlayerRef: ElementRef;
  @ViewChild('sucess', { static: true }) sucess: ElementRef;

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
  stateList = [];
  districtList = [];
  selectedStateId: number;
  selectedDistrictId: number;
  modalReference: NgbModalRef;

  constructor(
    private appService: AppService,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    if (window.screen.width < 600) { // 768px portrait
      this.mobile = true;
    }
    this.openModal();
    // const today = new Date();
    // const tomorrow = new Date(today);
    // tomorrow.setDate(tomorrow.getDate() + 7);
    // this.nextWeekDate = tomorrow.toISOString().split('T')[0];
    // console.log(tomorrow)
    this.currentDate = new Date().toISOString().split('T')[0];

    this.getState();

    this.id = setInterval(() => {
      this.getSlotData();
    }, 5000);
  }

  setDistrictValue(event) {
    this.selectedDistrictId = event.target.value;
  }

  getSlotData() {
    if (this.selectedDistrictId != undefined && this.selectedDistrictId != null) {
      this.centerData = [];
      this.appService.getSlotService(this.currentDate, this.selectedDistrictId).subscribe(
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

  getState() {
    this.appService.getStateList().subscribe(
      response => {
        if (response) {
          this.stateList = response.states;
          //console.log(this.stateList)
        }
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

  getDistrict(event: any) {
    this.onAudioStop();
    this.districtList = [];
    this.selectedDistrictId = null;
    this.selectedStateId = event.target.value;
    this.availableSlot = [];
    this.appService.getDistrictList(this.selectedStateId).subscribe(
      response => {
        if (response) {
          this.districtList = response.districts;
          //console.log(this.districtList)
        }
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

  openModal() {
    this.modalReference = this.modalService.open(this.sucess, { centered: true });
  }

}
