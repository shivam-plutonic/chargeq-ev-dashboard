import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AbstractTabComponent } from '../../../shared/component/abstract-tab/abstract-tab.component';
import {ActivatedRoute} from "@angular/router";
import {WindowService} from "../../../services/window.service";
import { SpinnerService } from '../../../services/spinner.service';
import { CentralServerService } from '../../../services/central-server.service';

@Component({
  selector: 'wallet',
  templateUrl: './wallet.component.html',
  // styleUrls: ['./wallet.component.css']
})
export class WalletComponent extends AbstractTabComponent  implements OnInit {
  @Input() public currentUserID!: string;
  formGroup: FormGroup;
  activeTabIndex = 0;
  dialogRef = false; // Change this based on your dialog condition
  wallet = {
    balance: 10, // Fetch actual balance
    transactions: [] // Fetch actual transactions
  };

  constructor(private fb: FormBuilder,
              protected activatedRoute: ActivatedRoute,
              private centralServerService: CentralServerService,
              private spinnerService: SpinnerService,
              protected windowService: WindowService) {
    super(activatedRoute, windowService, ['balance', 'transaction'], false);
    this.setHashArray(['balance', 'transaction']);
    this.formGroup = this.fb.group({
      // balance: [this.wallet.balance],
      // transactions: [this.wallet.transactions]
    });
  }

  public updateRoute(event: number) {
    if (!this.dialogRef) {
      super.updateRoute(event);
    }
  }
  public ngOnInit(): void {
    if (this.activatedRoute.snapshot.url[0]?.path === 'wallet') {
      this.currentUserID = this.centralServerService.getLoggedUser().id;
    }
    if (!this.dialogRef) {
      super.enableRoutingSynchronization();
    }
    this.currentUserID = this.centralServerService.getLoggedUser().id;
    // Fetch wallet balance and transactions here if needed
  }

  close() {
    // Handle closing the dialog
    console.log('Dialog closed');
  }
}
