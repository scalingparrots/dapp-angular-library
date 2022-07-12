import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private _snackBar: MatSnackBar) {
  }

  /**
   * Show a snack bar with a custom message and duration
   * @param message The message for the snack bar
   * @param duration The duration of the displayed message, default = 5000 (milliseconds)
   * @param panelClass The style class name
   */
  showMessage(message: string, duration: number = 5000, panelClass?: string[]) {
    this._snackBar.open(message, undefined, {
      duration,
      panelClass
    });
  }
}
