import { AfterViewInit, ChangeDetectionStrategy, Component, inject, Input, NgZone, OnInit, signal } from '@angular/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerAndroidScanningLibrary, CapacitorBarcodeScannerCameraDirection, CapacitorBarcodeScannerScanOrientation, CapacitorBarcodeScannerTypeHintALLOption } from '@capacitor/barcode-scanner';


@Component({
  selector: 'app-barcode-scanner',
  imports: [],
  templateUrl: './barcode-scanner.html',
  styleUrls: ['./barcode-scanner.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcodeScanner {
  @Input() barcodeFormats = ['qr-code','code-128'];
  private readonly ngZone = inject(NgZone);

    // public barcodes: Barcode[] = [];
  public isSupported = false;
  public isPermissionGranted = false;
  public readonly isScanning = signal(false);

 async scan(): Promise<string | null> {
    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHintALLOption.ALL,        
        scanText: 'scan a barcode',
        scanInstructions: 'You knnow what to do',
        web: {
          showCameraSelection: true,
          scannerFPS: 30,
          
        },
        cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
        scanOrientation: CapacitorBarcodeScannerScanOrientation.PORTRAIT,
      });
      console.log('Scan result:', result);
      return result.ScanResult;
    } catch (error) {
      console.error('Error scanning barcode:', error); 
      return null;
    }
  }
}
