import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  getSlotService(dt: any, selectedDistrictId:number) {
    let date = new DatePipe('en-US').transform(dt, 'dd-MM-yyyy')
    return this.http.get<any>("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=" + selectedDistrictId + "&date=" + date);
  }

  getStateList() {
    return this.http.get<any>("https://cdn-api.co-vin.in/api/v2/admin/location/states");
  }

  getDistrictList(selectedStateId:number) {
    return this.http.get<any>("https://cdn-api.co-vin.in/api/v2/admin/location/districts/" + selectedStateId);
  }
}
