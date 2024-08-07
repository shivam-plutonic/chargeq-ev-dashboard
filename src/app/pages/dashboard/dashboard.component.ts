import {Component} from '@angular/core';
import {Chart} from 'chart.js';
import {Router} from '@angular/router';
import {SpinnerService} from '../../services/spinner.service';
import {LocaleService} from '../../services/locale.service';
import {CentralServerService} from '../../services/central-server.service';
import {Utils} from '../../utils/Utils';
import {MessageService} from '../../services/message.service';
import {DashboardResult} from '../../types/DataResult';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent {
  public dashboardData?: DashboardResult;
  private language!: string;
  private userChart: Chart;
  private energyChart: Chart;
  private revenueChart: Chart;

  public constructor(
    private spinnerService: SpinnerService,
    private localeService: LocaleService,
    private centralServerService: CentralServerService,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.localeService.getCurrentLocaleSubject().subscribe((locale) => {
      this.language = locale.language;
    });
  }

  public formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  public formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amOrPm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes} ${amOrPm}`;
  }

  public redirectToRoute(route) {
    void this.router.navigateByUrl(route);
  }
  public calculateTotalWatts(connectors): number {
    let sum = 0;
    connectors.forEach((connector) => {
      sum += connector.currentInstantWatts;
    });
    return parseFloat((sum / 100).toFixed()) / 10;
  }

  // eslint-disable-next-line @angular-eslint/contextual-lifecycle,@angular-eslint/use-lifecycle-interface
  public ngOnInit(): void {
    this.centralServerService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.userChart = new Chart('user_canvas', {
          type: 'doughnut',
          data: {
            labels: ['Active Users', 'Pending Users'],
            datasets: [
              {
                data: [data.active_users, data.pending_users],
                backgroundColor: ['#2E8B57', '#D3FFE6']
              },
            ]
          },
          options: {
            rotation: -90,
            circumference: 180,
            cutout: 98,
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
        this.spinnerService.hide();
        console.log(this.dashboardData, 'dashboard data');
      },
      error: (error) => {
        this.spinnerService.hide();
        Utils.handleHttpError(error, this.router, this.messageService, this.centralServerService, 'dashboard.load_error');
      }
    });

    this.energyChart = new Chart('energy', {
      type: 'line',
      data: {
        labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Energy Consumed',
          data: [],
          fill: false,
          borderColor: '#2E8B57',
          tension: 0.1
        }]
      }
    });
    this.revenueChart = new Chart('revenue', {
      type: 'line',
      data: {
        labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Monthly Revenue',
          data: [],
          fill: false,
          borderColor: '#1976d2',
          tension: 0.1
        }]
      }
    });
  }
}
