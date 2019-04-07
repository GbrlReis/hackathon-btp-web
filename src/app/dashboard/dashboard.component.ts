import { Component, OnInit } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  todayDate : any;
  months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  month : any;
  showLineUP : boolean = false;
  courseDetails: boolean = true;
  constructor() { }

  ngOnInit() {
    this.todayDate = moment();
    this.month = this.months[moment().month()];
    this.showCalendar();
  }

  showCalendar(){
    let calendarEl = document.getElementById('line-up');

    let calendar = new Calendar(calendarEl, {
      plugins: [timeGridPlugin],
      defaultView: 'timeGridWeek',
      timeZone: 'UTC',
      editable: true,
      locale: 'pt',
      height: 10,
      header: {
        left: 'today prev next',
        right: ''
      },
      buttonText: {
        today: 'Hoje'
      }
      
    });
    calendar.render();
  }

  toggleLineUp(){
    this.showLineUP ? this.showLineUP = false : this.showLineUP = true;
  }

  toggleCourses(){
    this.courseDetails ? this.courseDetails = false : this.courseDetails = true;
  }
  

}
