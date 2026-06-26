import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BarcodeScanner } from "../components/barcode-scanner/barcode-scanner";

@Component({
  selector: 'app-home-page',
  imports: [BarcodeScanner],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  title = 'Home Page';
}
