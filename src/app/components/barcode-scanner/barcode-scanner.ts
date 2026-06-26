import { AfterViewInit, ChangeDetectionStrategy, Component, inject, Input, NgZone, OnInit, signal } from '@angular/core';
import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner as MLKitBarcodeScanner,
  LensFacing,
  StartScanOptions,
} from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-barcode-scanner',
  imports: [],
  templateUrl: './barcode-scanner.html',
  styleUrls: ['./barcode-scanner.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcodeScanner implements AfterViewInit {
  @Input() barcodeFormats = ['qr-code', 'ean-13', 'code-128'];
  private readonly ngZone = inject(NgZone);

    public barcodes: Barcode[] = [];
  public isSupported = false;
  public isPermissionGranted = false;
  public readonly isScanning = signal(false);

  ngAfterViewInit() {
   MLKitBarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
      console.log('isSupported', this.isSupported);
    });
    MLKitBarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === 'granted';
      console.log('isPermissionGranted', this.isPermissionGranted);
      if (!this.isPermissionGranted) {
        this.requestPermission();
      }
    });
    MLKitBarcodeScanner.removeAllListeners().then(() => {
      MLKitBarcodeScanner.addListener(
        'googleBarcodeScannerModuleInstallProgress',
        (event) => {
          this.ngZone.run(() => {
            console.log('googleBarcodeScannerModuleInstallProgress', event);           
          });
        },
      );
    });
  }

  public async requestPermission(): Promise<void> {
    const result = await MLKitBarcodeScanner.requestPermissions();
    this.isPermissionGranted = result.camera === 'granted';
  }

  public async stopScan(): Promise<void> {
    await MLKitBarcodeScanner.stopScan();
    this.isScanning.set(false);
  }

  public async startScan(): Promise<void> {
    this.isScanning.set(true);
    const formats = this.barcodeFormats;
    MLKitBarcodeScanner.startScan({
      formats: formats as BarcodeFormat[],
      lensFacing: LensFacing.Back,
      videoElement: document.querySelector('video') as HTMLVideoElement,
    }).then((result) => {
      this.ngZone.run(() => {
        
        console.log('barcodes', this.barcodes);
      });
    }).catch((error) => {
      console.error('Error starting scan:', error);
      this.isScanning.set(false);
    }); 
  }
}
