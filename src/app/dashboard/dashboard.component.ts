import { Component, OnInit } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { ActivitiesService } from '../activities.service';
import { LineupsService } from '../lineups.service';
import { WatsonService } from '../watson.service';

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
    id : null,
    title: '',
    description: '',
    category: '',
    duration: '',
    date: '',
    validate: '',
    editing: false,
    pdf: '',
    link: '',
    members: '',
  }

  lineups: any;

  courses: any;

  calendarData = {
    nomeNavio: "",
    armador: "",
    berco: "",
    dtPrevistaBarra: "",
    dtPrevisaoAtracacao: "",
    dtPrevistaDesatracacao: "",
    dtBerthWindow: "",
    servico: "",
    editing: false
  }

  nextDeadlinesActivities: any;
  allActivities: any;

  options = [
    { value: 'training', name: 'Treinamento' },
    { value: 'certification', name: 'Certificado' },
    { value: 'video', name: 'Video Aula' }
  ]

  calendarStatus = [
    { name: 'IN' },
    { name: 'OUT' }
  ]

  notifications = [
    
  ]


  constructor(
    private activityService: ActivitiesService,
    private lineupsService: LineupsService,
    private watsonService: WatsonService
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
      validate: new FormControl(this.courseData.validate, []),
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
      nomeNavio: new FormControl(this.calendarData.nomeNavio, [
        Validators.required
      ]),
      armador: new FormControl(this.calendarData.armador, [
        Validators.required
      ]),
      berco: new FormControl(this.calendarData.berco , [
        Validators.required
      ]),
      dtPrevistaBarra: new FormControl(this.calendarData.dtPrevistaBarra , [
        Validators.required
      ]),
      dtPrevisaoAtracacao: new FormControl(this.calendarData.dtPrevisaoAtracacao , [
        Validators.required
      ]),
      dtPrevistaDesatracacao: new FormControl(this.calendarData.dtPrevistaDesatracacao , [
        Validators.required
      ]),
      dtBerthWindow: new FormControl(this.calendarData.dtBerthWindow , [
        Validators.required
      ]),
      servico: new FormControl(this.calendarData.servico , [
        Validators.required
      ])
    })
  }

  ngOnInit() {
    this.todayDate = moment();
    this.month = this.months[moment().month()];
    
    this.getActivities();
    this.lineupsService.getLineUps().subscribe((has) => {
      this.lineups = [
        ...this.lineupsService.getJsonLineups().map((lineup) => {
          return {
            dtBerthWindow : lineup.dtBerthWindow,
            dtPrevistaBarra : lineup.dtPrevistaBarra,
            dtPrevisaoAtracacao : lineup.dtPrevisaoAtracacao,
            dtPrevistaDesatracacao : lineup.dtPrevistaDesatracacao,
            nomeNavio : lineup.nomeNavio,
            armador : lineup.armador,
            berco : lineup.berco,
            servico : lineup.servico
          }
        }),
        ...has
      ];
      this.showCalendar();
    });

    this.watsonNotifications();

  }

  filterNextDeadlines() {this
    this.nextDeadlinesActivities = _.filter(this.courses, (course) => {
      return moment(course.validate).isBetween(moment().endOf('day').subtract(1, 'day').format('YYYY-MM-DD'), moment().endOf('day').add(7, 'days').format('YYYY-MM-DD')) && course.validate;
    });
  }

  filterAllActivities() {
    this.allActivities = _.filter(this.courses, (course) => {
      return moment(course.date).isAfter(moment().add(7, 'days').format('YYYY-MM-DD')) || !course.date;
    })
  }


  isValid(field) {
    return !this.courseFormGroup.controls[field].valid && (this.courseFormGroup.controls[field].dirty || this.submitted)
  }

  showCalendar() {
    let calendarEl = document.getElementById('line-up');

    let addEvents = this.lineups.map(data =>({title: data.nomeNavio, start: data.dtPrevisaoAtracacao, end: data.dtPrevistaDesatracacao}));

    let calendar = new Calendar(calendarEl, {
      plugins: [timeGridPlugin],
      defaultView: 'timeGridWeek',
      timeZone: 'UTC',
      editable: true,
      events: addEvents,
      locale: 'pt',
      height: 10,
      header: {
        left: 'today prev next',
        right: 'addDate'
      },
      /* customButtons: {
        addDate: {
          text: 'Adicionar',
          click: () => {
            this.viewDetails('calendar');
          }
        }
      }, */
      buttonText: {
        today: 'Hoje'
      }
    });
    calendar.render();
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

    if(data)
      this.courseData = _.clone(data);
    this.courseData.date = moment(this.courseData.date).format('YYYY-MM-DD');

    if (type == 'add-course') {
      this.reset();
      this.courseData.editing = true;
    }
  }

  editCourse(course) {
    course.editing ? course.editing = false : course.editing = true;
  }


  submitEventOnCalendar(){
    this.submitted = true;

    let calendarEVent = {
      nomeNavio: this.calendarData.nomeNavio,
      armador: this.calendarData.armador,
      berco: this.calendarData.berco,
      dtPrevistaBarra: this.calendarData.dtPrevistaBarra,
      dtPrevisaoAtracacao: this.calendarData.dtPrevisaoAtracacao,
      dtPrevistaDesatracacao: this.calendarData.dtPrevistaDesatracacao,
      dtBerthWindow: this.calendarData.dtBerthWindow,
      servico: this.calendarData.servico
    }

    this.lineupsService.saveLineup(calendarEVent)
    this.getActivities();

  }

  submit() {
    this.submitted = true;

    let activity = {
      id: this.courseData.id ? this.courseData.id : null,
      title: this.courseData.title,
      description: this.courseData.description,
      validate: this.courseData.validate,
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
      id : null,
      title: '',
      description: '',
      category: '',
      duration: '',
      date: '',
      editing: false,
      pdf: '',
      link: '',
      members: '',
      validate: ''
    }
    _.forEach(this.courses, (course) => {
      course.editing = false;
    })
  }

  close() {
    this.reset();
    this.showSideModal = false;
  }

  watsonNotifications(){
    let linesups = this.lineupsService.getJsonLineups();

    linesups.filter((lineup) => {
      return moment(lineup.dtPrevistaBarra).isBefore(moment().endOf('day'))
    })
    .forEach((lineup) => {
      this.watsonService.getProbability(
        lineup.dtBerthWindow,
        lineup.dtPrevistaBarra,
        lineup.dtPrevisaoAtracacao,
        lineup.dtPrevistaDesatracacao,
        lineup.nomeNavio,
        lineup.armador,
        lineup.berco,
        lineup.servico,
      )
      .then((result:any) => {
        this.notifications.push({
          title: 'Navio ' + lineup.nomeNavio,
          subtitle: lineup.armador,
          message: 'Devido ao histórico, existe a possibilidade de ' + (result.OUT*100).toFixed(2) + '% de operações atrasarem e/ou serem canceladas.',
          date: moment()
        });
      })
    })
  }
}
