// import {Component, Input, OnChanges, OnInit} from '@angular/core';
// import {FormBuilder, FormGroup} from '@angular/forms';
// import { User} from 'types/User';
// import { CentralServerService } from '../../../services/central-server.service';
// import {TableDataSource} from '../../../shared/table/table-data-source';
// import {ChargingStationTemplate} from '../../../types/ChargingStationTemplate';
// import { WindowService } from '../../../services/window.service';
// // import { FilterParams } from '../types/GlobalType';
//
// @Component({
//   selector: 'app-wallet-balance',
//   templateUrl: './wallet-balance.component.html',
//   // styleUrls: ['./wallet-balance.component.css']
// })
// export class WalletBalanceComponent implements OnInit{
//   @Input() formGroup!: FormGroup;
//   @Input() wallet: any;
//   @Input() userId!: string;
//
//   public user!: User;
//   constructor(private centralServerService: CentralServerService, private windowService: WindowService,) {}
//
//
//   ngOnInit() {
//     this.fetchWalletBalance();
//   }
//
//   fetchWalletBalance() {
//     // const filterValues = this.buildFilterValues();
//     this.centralServerService.getWalletBalance(this.userId).subscribe(
//       (data) => {
//         this.wallet.balance = data.balance; // Adjust based on your API response
//         this.formGroup.patchValue({ amount: this.wallet.balance });
//       },
//       (error) => {
//         console.error('Error fetching wallet balance:', error);
//       }
//     );
//   }
//   rechargeWallet() {
//     // const rechargeAmount = this.formGroup.get('rechargeAmount')?.value;
//     // const mobileNumber = 'user_mobile_number'; // Replace with actual mobile number if needed
//
//     this.centralServerService.rechargeWallet(this.userId).subscribe(
//       (response) => {
//         const sessionId = response;
//         console.log(response);
//         const redirectUrl = `https://sandbox.cashfree.com/pg/orders/${sessionId}/pay`;
//         console.log(redirectUrl);
//         window.location.href = redirectUrl;
//       },
//       (error) => {
//         console.error('Error initiating wallet recharge:', error);
//       }
//     );
//   }
// }

//
// import { Component, Input, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { User } from 'types/User';
// import { CentralServerService } from '../../../services/central-server.service';
//
// @Component({
//   selector: 'app-wallet-balance',
//   templateUrl: './wallet-balance.component.html',
//   // styleUrls: ['./wallet-balance.component.css']
// })
// export class WalletBalanceComponent implements OnInit {
//   @Input() formGroup!: FormGroup;
//   @Input() wallet: any;
//   @Input() userId!: string;
//
//   public user!: User;
//
//   constructor(
//     private centralServerService: CentralServerService,
//   ) {}
//
//   ngOnInit() {
//     this.fetchWalletBalance();
//   }
//
//   fetchWalletBalance() {
//     this.centralServerService.getWalletBalance(this.userId).subscribe(
//       (data) => {
//         this.wallet.balance = data.balance; // Adjust based on your API response
//         this.formGroup.patchValue({ amount: this.wallet.balance });
//       },
//       (error) => {
//         console.error('Error fetching wallet balance:', error);
//       }
//     );
//   }
//
//   rechargeWallet() {
//     // const rechargeAmount = this.formGroup.get('rechargeAmount')?.value;
//     // const mobileNumber = 'user_mobile_number'; // Replace with actual mobile number if needed
//
//     this.centralServerService.rechargeWallet(this.userId).subscribe(
//       (response) => {
//         const sessionId = response.sessionId;
//         const returnUrl = window.location.origin + '/payment-callback'; // Adjust based on your app
//
//         this.initiatePayment(sessionId, returnUrl);
//       },
//       (error) => {
//         console.error('Error initiating wallet recharge:', error);
//       }
//     );
//   }
//
//   initiatePayment(sessionId: string, returnUrl: string) {
//     const paymentMessage = document.getElementById("paymentMessage");
//     paymentMessage.innerText = "";
//     paymentMessage.classList.remove("alert-danger");
//     paymentMessage.classList.remove("alert-success");
//
//     const cashfree = new Cashfree({ mode: 'sandbox' });
//     cashfree
//       .checkout({
//         paymentSessionId: sessionId,
//         returnUrl: returnUrl,
//         redirectTarget: "_self" // Use _self to open in the same tab, adjust as needed
//       })
//       .then(function () {
//         console.log("Redirecting to payment gateway...");
//       })
//       .catch(function (error) {
//         console.error("Error during payment initiation:", error);
//         paymentMessage.innerText = "Failed to initiate payment.";
//         paymentMessage.classList.add("alert-danger");
//       });
//   }
// }



//
// import { Component, Input, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CentralServerService } from '../../../services/central-server.service';
// import { User } from 'types/User';
// import {WindowService} from "../../../services/window.service";
// import { ActivatedRoute } from '@angular/router';
// import {SpinnerService} from "../../../services/spinner.service";
//
//
// declare var Cashfree: any;  // Declare Cashfree as a global variable
//
// @Component({
//   selector: 'app-wallet-balance',
//   templateUrl: './wallet-balance.component.html',
//   // styleUrls: ['./wallet-balance.component.css']
// })
// export class WalletBalanceComponent implements OnInit {
//   @Input() formGroup!: FormGroup;
//   @Input() wallet: any;
//   @Input() userId!: string;
//
//   public user!: User;
//   public rechargeForm: FormGroup;
//   public showRechargeInput: boolean = false;
//
//   constructor(private centralServerService: CentralServerService, private formBuilder: FormBuilder,  private route: ActivatedRoute,
//               private spinnerService: SpinnerService,) {
//     this.rechargeForm = this.formBuilder.group({
//       rechargeAmount: ['', [Validators.required, Validators.min(1)]]
//     });
//   }
//   ngOnInit() {
//     this.fetchWalletBalance();
//     this.checkOrderStatus();
//   }
//
//   toggleRechargeInput() {
//     this.showRechargeInput = true;
//   }
//
//   fetchWalletBalance() {
//     // const filterValues = this.buildFilterValues();
//     this.centralServerService.getWalletBalance(this.userId).subscribe(
//       (data) => {
//         this.spinnerService.hide();
//         this.wallet.balance = data.balance; // Adjust based on your API response
//         this.formGroup.patchValue({ amount: this.wallet.balance });
//       },
//       (error) => {
//         console.error('Error fetching wallet balance:', error);
//       }
//     );
//   }
//
//   rechargeWallet() {
//     if (this.rechargeForm.invalid) {
//       return;
//     }
//
//     const rechargeAmount = this.rechargeForm.get('rechargeAmount')?.value;
//     // const rechargeAmount = this.formGroup.get('rechargeAmount')?.value;
//     // const mobileNumber = 'user_mobile_number'; // Replace with actual mobile number if needed
//
//     this.centralServerService.rechargeWallet(this.userId, rechargeAmount).subscribe(
//       (response) => {
//         const sessionId = response;
//         // const returnUrl = window.location.origin + '/users'; // Adjust based on your app
//         this.initiatePayment(sessionId);
//       },
//       (error) => {
//         console.error('Error initiating wallet recharge:', error);
//       }
//     );
//   }
//
//   initiatePayment(sessionId: string) {
//     // const paymentMessage = document.getElementById('paymentMessage');
//     // paymentMessage.innerText = '';
//     // paymentMessage.classList.remove('alert-danger');
//     // paymentMessage.classList.remove('alert-success');
//
//     const cashfree = new Cashfree({ mode: 'sandbox' });
//     cashfree
//       .checkout({
//         paymentSessionId: sessionId,
//         redirectTarget: '_self' // Use _self to open in the same tab, adjust as needed
//       })
//       .then(() => {
//         console.log('Redirecting to payment gateway...');
//       })
//       .catch((error: any) => {
//         console.error('Error during payment initiation:', error);
//         // paymentMessage.innerText = "Failed to initiate payment.";
//         // paymentMessage.classList.add("alert-danger");
//       });
//   }
//
//   checkOrderStatus() {
//     const fragment = this.route.snapshot.fragment;
//     console.log('URL fragment:', fragment);
//     if (fragment) {
//       const matches = fragment.match(/balance\/(.+)/); // Match the order ID from the fragment
//       if (matches && matches[1]) {
//         const orderId = matches[1];
//         console.log(orderId);
//         this.centralServerService.checkTransactionStatus(orderId).subscribe(
//           (response) => {
//             this.fetchWalletBalance();
//             console.log('Transaction status:', response);
//             // Handle the response (e.g., update UI, show success message)
//           },
//           (error) => {
//             console.error('Error checking transaction status:', error);
//           }
//         );
//       }
//     }
//   }
// }
//
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CentralServerService } from '../../../services/central-server.service';
import { User } from 'types/User';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from "../../../services/spinner.service";

declare var Cashfree: any;  // Declare Cashfree as a global variable

@Component({
  selector: 'app-wallet-balance',
  templateUrl: './wallet-balance.component.html',
  // styleUrls: ['./wallet-balance.component.css']
})
export class WalletBalanceComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() wallet: any;
  @Input() userId!: string;

  public user!: User;
  public rechargeForm: FormGroup;
  public showRechargeInput: boolean = false;
  public calculatedGST: number | null = null;
  public adjustedAmount: number | null = null;

  constructor(
    private centralServerService: CentralServerService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService
  ) {
    this.rechargeForm = this.formBuilder.group({
      rechargeAmount: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]] // Ensure positive integers
    });
  }

  ngOnInit() {
    this.fetchWalletBalance();
    this.checkOrderStatus();
  }

  toggleRechargeInput() {
    this.showRechargeInput = true;
  }

  fetchWalletBalance() {
    this.centralServerService.getWalletBalance(this.userId).subscribe(
      (data) => {
        if (this.spinnerService) {
          this.spinnerService.hide();
        }
        this.wallet.balance =  Math.round(data.balance); // Adjust based on your API response
        this.formGroup.patchValue({ amount: this.wallet.balance });
      },
      (error) => {
        console.error('Error fetching wallet balance:', error);
      }
    );
  }

  onAmountChange(amount: string) {
    const parsedAmount = parseInt(amount, 10);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      const gstRate = 0.18;
      this.adjustedAmount = parsedAmount / (1 + gstRate);
      this.calculatedGST = parsedAmount - this.adjustedAmount;
      this.adjustedAmount = Math.round(this.adjustedAmount);
      this.calculatedGST = Math.round(this.calculatedGST);
      this.rechargeForm.get('rechargeAmount')?.setErrors(null); // Clear errors
    } else {
      this.calculatedGST = null;
      this.adjustedAmount = null;
      this.rechargeForm.get('rechargeAmount')?.setErrors({ 'pattern': true }); // Set error if invalid
    }
  }

  rechargeWallet() {
    if (this.rechargeForm.invalid) {
      return;
    }

    const rechargeAmount = this.rechargeForm.get('rechargeAmount')?.value;

    this.centralServerService.rechargeWallet(this.userId, rechargeAmount).subscribe(
      (response) => {
        const sessionId = response;
        this.initiatePayment(sessionId);
      },
      (error) => {
        console.error('Error initiating wallet recharge:', error);
      }
    );
  }

  initiatePayment(sessionId: string) {
    const cashfree = new Cashfree({ mode: 'sandbox' });
    cashfree
      .checkout({
        paymentSessionId: sessionId,
        redirectTarget: '_self' // Use _self to open in the same tab, adjust as needed
      })
      .then(() => {
        console.log('Redirecting to payment gateway...');
      })
      .catch((error: any) => {
        console.error('Error during payment initiation:', error);
      });
  }

  checkOrderStatus() {
    const fragment = this.route.snapshot.fragment;
    console.log('URL fragment:', fragment);
    if (fragment) {
      const matches = fragment.match(/balance\/(.+)/);
      if (matches && matches[1]) {
        const orderId = matches[1];
        console.log(orderId);
        this.centralServerService.checkTransactionStatus(orderId, this.userId).subscribe(
          (response) => {
            this.fetchWalletBalance();
            console.log('Transaction status:', response);
          },
          (error) => {
            console.error('Error checking transaction status:', error);
          }
        );
      }
    }
  }
}
