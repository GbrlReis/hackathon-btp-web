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
  showSideModal:boolean = false;
  sideModalType : any;

  courses = [
    { 
      title: 'Lorem Ipsum',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim id nunc eget pulvinar. In maximus a mauris ac varius. Curabitur eget imperdiet ipsum. Phasellus id odio orci. Suspendisse lacus lacus, tincidunt ac congue et, pulvinar quis eros. Vivamus vehicula erat commodo mi tincidunt tristique. Cras sodales nec enim quis blandit. Praesent pulvinar congue lorem a placerat.',
      category: 'Certificado',
      duration: '2 horas',
      date: moment().add(3,'days'),
      attachments: {
        pdf: null,
        ppt: null,
        video: null,
        link: null
      }
    }
  ]
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
        right: 'addDate'
      },
      customButtons: {
        addDate: {
          text: 'Adicionar',
          click: () => {
            this.viewDetails('calendar');
          }
        }
      },
      buttonText: {
        today: 'Hoje'
      }      
    });
    calendar.render();
  }

  addEvent(){
    console.log('xddd');
  }

  toggleLineUp(){    
    this.showLineUP ? this.showLineUP = false : this.showLineUP = true;
  }

  toggleCourses(){
    this.showSideModal ? this.showSideModal = false : this.showSideModal = true;
  }
  
  viewDetails(type, data = null){
    this.sideModalType = type;
    this.showSideModal ? this.showSideModal = false : this.showSideModal = true;
  }

}
