import { Component, OnInit } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  todayDate: any;
  months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  month: any;
  showLineUP: boolean = false;
  courseDetails: boolean = true;
  showSideModal: boolean = false;
  sideModalType: any;
  courseFormGroup: FormGroup;
  submitted:any;
  deadlineCourses:any;
  allCourses:any;

  courseData = {
    title: '',
    description: '',
    category: '',
    duration: '',
    date: '',
    editing: false,
    pdf: '',
    link: '',
    members: '',
  }

  nextDeadlinesActivities:any;
  allActivities:any;

  options = [
    { name: 'Treinamento' },
    { name: 'Certificado' },
    { name: 'Mentoria interna' },
    { name: 'Ciclos do diálogo e Town Hall Meeting' },
    { name: 'Exame periódico dos colaboradores'}, 
    { name: 'Trabalho voluntário da comunidade'},
    { name: 'Melhoria no ambiente de trabalho'}
  ]

  notifications = [
    {
      title: 'Previsão de tempo atualizada',
      subtitle: 'Tempo está nublado',
      message: 'Devido ao histórico, existe a possibilidade de 64% de operações atrasarem e/ou serem canceladas.',
      date: moment()
    }
  ]

  courses = [
    {
      id: 0,
      title: 'Lorem Ipsum',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim id nunc eget pulvinar. In maximus a mauris ac varius. Curabitur eget imperdiet ipsum. Phasellus id odio orci. Suspendisse lacus lacus, tincidunt ac congue et, pulvinar quis eros. Vivamus vehicula erat commodo mi tincidunt tristique. Cras sodales nec enim quis blandit. Praesent pulvinar congue lorem a placerat.',
      category: 'Certificado',
      duration: '2 horas',
      date: moment().add(3, 'days'),
      editing: false,
        pdf: 'http://www.africau.edu/images/default/sample.pdf',
        link: 'https://www.youtube.com/embed/gsjy1hbyF_8'
    },
    {
      id: 1,
      title: 'Lorem Ipsum',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim id nunc eget pulvinar. In maximus a mauris ac varius. Curabitur eget imperdiet ipsum. Phasellus id odio orci. Suspendisse lacus lacus, tincidunt ac congue et, pulvinar quis eros. Vivamus vehicula erat commodo mi tincidunt tristique. Cras sodales nec enim quis blandit. Praesent pulvinar congue lorem a placerat.',
      category: 'Certificado',
      duration: '2 horas',
      date: moment().add(3, 'days'),
      editing: false,
        pdf: null,
        link: 'https://www.youtube.com/embed/gsjy1hbyF_8'
    },
    {
      id: 2,
      title: 'Lorem Ipsum',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim id nunc eget pulvinar. In maximus a mauris ac varius. Curabitur eget imperdiet ipsum. Phasellus id odio orci. Suspendisse lacus lacus, tincidunt ac congue et, pulvinar quis eros. Vivamus vehicula erat commodo mi tincidunt tristique. Cras sodales nec enim quis blandit. Praesent pulvinar congue lorem a placerat.',
      category: 'Certificado',
      duration: '2 horas',
      date: moment().add(10, 'days'),
      editing: false,
        pdf: null,
        link: 'https://www.youtube.com/embed/gsjy1hbyF_8'
    },
  ]
  constructor() {
    this.courseFormGroup = new FormGroup({
      title: new FormControl(this.courseData.title, [
        Validators.required
      ]),
      description: new FormControl(this.courseData.description, [
        Validators.required
      ]),
      category: new FormControl(this.courseData.category, [
        Validators.required
      ]),
      duration: new FormControl(this.courseData.duration, [
      ]),
      date: new FormControl(this.courseData.date, []),
      pdf: new FormControl(this.courseData.pdf, [
        Validators.required
      ]),
      link: new FormControl(this.courseData.link, [
        Validators.required
      ]),
      members: new FormControl(this.courseData.members, [
        Validators.required
      ])
    })
  }

  ngOnInit() {
    this.todayDate = moment();
    this.month = this.months[moment().month()];
    this.showCalendar();

    this.filterNextDeadlines();
    this.filterAllActivities();
  }

  filterNextDeadlines(){
    this.nextDeadlinesActivities = _.filter(this.courses, (course) => {
      return moment(course.date).isBetween(moment(), moment().add(7, 'days'));
    });
  }

  filterAllActivities(){
    this.allActivities = _.filter(this.courses, (course) => {
      return moment(course.date).isAfter(moment().add(7, 'days')); 
    })
  }


  isValid(field){
    return !this.courseFormGroup.controls[field].valid && (this.courseFormGroup.controls[field].dirty || this.submitted)
  }

  showCalendar() {
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

  addEvent() {
    console.log('xddd');
  }

  toggleLineUp() {
    this.showLineUP ? this.showLineUP = false : this.showLineUP = true;
  }

  toggleCourses() {
    this.showSideModal ? this.showSideModal = false : this.showSideModal = true;
  }

  viewDetails(type, data = null) {
    this.sideModalType = type;
    this.showSideModal ? this.showSideModal = false : this.showSideModal = true;
    if (this.sideModalType == 'course') {
      this.courseData = data;
    }
  }

  editCourse(course) {
    course.editing ? course.editing = false : course.editing = true;
  }

  submit(){
    this.submitted = true;


  }
}
