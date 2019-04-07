import { Component, OnInit } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { ActivityService } from '../../app/activity.service'

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
  submitted: any;
  deadlineCourses: any;
  allCourses: any;

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

  courses: any;
  calendarData = {
    shipName: '',
    status: '',
    editing: false,
    beginDate: '',
    endDate: ''
  }

  nextDeadlinesActivities: any;
  allActivities: any;

  options = [
    { value: 'training', name: 'Treinamento' },
    { value: 'certification', name: 'Certificado' },
    { value: 'video', name: 'VideoAula' }
  ]

  calendarStatus = [
    { name: 'IN' },
    { name: 'OUT' }
  ]

  notifications = [
    {
      title: 'Previsão de tempo atualizada',
      subtitle: 'Tempo está nublado',
      message: 'Devido ao histórico, existe a possibilidade de 64% de operações atrasarem e/ou serem canceladas.',
      date: moment()
    }
  ]


  constructor(
    private activityService: ActivityService
  ) {
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

      ]),
      link: new FormControl(this.courseData.link, [

      ]),
      members: new FormControl(this.courseData.members, [
        Validators.required
      ]),
      shipName: new FormControl(this.calendarData.shipName, [
        Validators.required
      ]),
      status: new FormControl(this.calendarStatus, [
        Validators.required
      ]),
      dateBegin: new FormControl(this.calendarData.beginDate, [
        Validators.required
      ]),
      dateEnd: new FormControl(this.calendarData.endDate, [
        Validators.required
      ])
    })
  }

  ngOnInit() {
    this.todayDate = moment();
    this.month = this.months[moment().month()];
    this.showCalendar();
    this.getActivities();

  }

  filterNextDeadlines() {
    this.nextDeadlinesActivities = _.filter(this.courses, (course) => {
      return moment(course.date).isBetween(moment().format('YYYY-MM-DD'), moment().add(7, 'days').format('YYYY-MM-DD'));
    });
  }

  filterAllActivities() {
    this.allActivities = _.filter(this.courses, (course) => {
      return moment(course.date).isAfter(moment().add(7, 'days').format('YYYY-MM-DD'));
    })
  }


  isValid(field) {
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

    this.courseData = data;

    if (type == 'add-course') {
      this.reset();
      this.courseData.editing = true;
    }
  }

  editCourse(course) {
    course.editing ? course.editing = false : course.editing = true;
  }

  submit() {
    this.submitted = true;

    let activity = {
      title: this.courseData.title,
      description: this.courseData.description,
      category: this.courseData.category,
      duration: this.courseData.duration ? this.courseData.duration : null,
      date: this.courseData.date ? moment(this.courseData.date).toISOString() : null,
      pdf: this.courseData.pdf ? this.courseData.pdf : null,
      link: this.courseData.link ? this.courseData.link : null,
      members: this.courseData.members
    }

    this.activityService.saveActivity(activity);

    this.getActivities();
  }

  getActivities() {
    this.activityService.getActivities().subscribe((res) => {
      this.submitted = false;
      if (this.showSideModal) {
        this.close();
      }
      _.forEach(res, (course) => {
        let option = _.find(this.options, (option) => {
          return option.value == course.category
        });
        course.categoryName = option.name
      })
      this.courses = res;
      this.filterNextDeadlines();
      this.filterAllActivities();
    }, (err) => {
      console.log('err', err);
    })
  }

  reset() {
    this.courseData = {
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
    _.forEach(this.courses, (course) => {
      course.editing = false;
    })
  }

  close() {
    this.reset();
    this.showSideModal = false;
  }
}
