import { OnInit, Component } from "@angular/core";
import { BackendService, Route } from "../../services/backend.service";
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  providers: [BackendService],
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  tableData: Array<Route>;
  /* pagination Info */
  pageSize: number;
  pageNumber: number;
  averageDuration: number;
  averageDistance: number;
  todaysRoute: Route;
  sortDate: boolean;
  sortDuration: boolean;
  sortDistance: boolean;

  backendService: BackendService;

  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  calendar: NgbCalendar;

  constructor(_calendar: NgbCalendar, _backendService: BackendService) {
    this.calendar = _calendar;
    this.backendService = _backendService;
    this.tableData = Array<Route>();
    this.pageNumber = 1;
    this.pageSize = 10;
    this.todaysRoute = new Route();
    this.averageDuration = 0;
    this.averageDistance = 0;
    this.sortDate = false;
    this.sortDuration = false;
    this.sortDistance = false;

    this.fromDate = _calendar.getPrev(_calendar.getToday(), 'd', 7)
    this.toDate = _calendar.getNext(_calendar.getToday(), 'd', 7);
  }

  /**
   *
   * @param $event
   * @param criteria
   */
  sortTable($event, criteria) {
    if(criteria === "date") {
      this.sortDate = !this.sortDate;
      if(this.sortDate) {
        this.tableData.sort((e1: Route, e2: Route) => e2.date.getDate() - e1.date.getDate());
        return;
      }
      this.tableData.sort((e1: Route, e2: Route) => e1.date.getDate() - e2.date.getDate());
    } if(criteria === "distance") {
      this.sortDistance = !this.sortDistance;
      if(this.sortDistance) {
        this.tableData.sort((e1: Route, e2: Route) => e2.distance - e1.distance);
        return;
      }
      this.tableData.sort((e1: Route, e2: Route) => e1.distance - e2.distance);
    } if(criteria === "duration") {
      this.sortDuration = !this.sortDuration;
      if(this.sortDuration) {
        this.tableData.sort((e1: Route, e2: Route) => e2.duration - e1.duration);
        return;
      }
      this.tableData.sort((e1: Route, e2: Route) => e1.duration - e2.duration);
    }
  }

  /**
   *
   */
  getFromMonth() {
    if (this.fromDate && this.fromDate.month) {
      return this.fromDate.month;
    }

    return '';
  }

  getTodaysRoute() {
    let today: NgbDate = this.calendar.getToday();
    return this.backendService.getTodaysRoute(new Date(today.year, today.month - 1, today.day)).subscribe(route => { this.todaysRoute = route });;
  }

  getAverageDuration() {
    this.backendService.getAverageDuration(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day)).subscribe(res => { this.averageDuration = res });
  }

  getAverageDistance() {
    return this.backendService.getAverageDistance(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day)).subscribe(res => { this.averageDistance = res });;
  }

  getFromDay() {
    if (this.fromDate && this.fromDate.day) {
      return this.fromDate.day;
    }

    return '';
  }

  getFromYear() {
    if (this.fromDate && this.fromDate.year) {
      return this.fromDate.year;
    }

    return '';
  }

  getToMonth() {
    if (this.toDate && this.toDate.month) {
      return this.toDate.month;
    }

    return '';
  }

  getToDay() {
    if (this.toDate && this.toDate.day) {
      return this.toDate.day;
    }

    return '';
  }

  getToYear() {
    if (this.toDate && this.toDate.year) {
      return this.toDate.year;
    }

    return '';
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.backendService.getRoutes().subscribe(res => { this.tableData = res });
    this.getAverageDuration();
    this.getAverageDistance();
    this.getTodaysRoute();
  }

  pageChanged(pN: number): void {
    this.pageNumber = pN;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.getAverageDistance();
      this.getAverageDuration();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }
}
