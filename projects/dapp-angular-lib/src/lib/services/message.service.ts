import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor() {
  }

  /**
   * Show a snack bar with a custom message and duration
   * @param message The message for the snack bar
   * @param duration The duration of the displayed message, default = 5000 (milliseconds)
   * @param panelClass The style class name: "info", "success" or "error"
   */
  showMessage(message: string, duration: number = 5000, panelClass: string = "info") {
    const styles = `
      .snackbar-container {
        display: grid;
        overflow: hidden;
        font-size: 1.05rem;
        font-family: "Poppins", sans-serif;
        background-color: hsl(0, 0%, 100%);
        min-height: 100vh;
        place-items: center;
      }

      .snackbar {
        background: hsl(0, 0%, 30%);
        color: hsl(0, 0%, 90%);
        position: absolute;
        bottom: -100px;
        opacity: 0;
        padding: 1em;
        border-radius: 10px;
      }
      .snackbar[data-is-active=true] {
        animation: showAnim 0.5s linear forwards;
      }
      .snackbar[data-is-active=false] {
        animation: hideAnim 0.5s linear forwards;
      }

      .success-snackbar {
        background-color: #D4EDDAFF !important;
        color: #155724FF !important;
        border: 1px solid #C3E6CBFF !important;
      }

      .error-snackbar {
        background-color: #F8D7DAFF !important;
        color: #721C24FF !important;
        border: 1px solid #F5C6CBFF;
      }

      @keyframes hideAnim {
        0% {
          opacity: 1;
          bottom: 30px;
        }
        50% {
          bottom: 15px;
          opacity: 0;
        }
        to {
          opacity: 0;
          bottom: -100px;
        }
      }
      @keyframes showAnim {
        0% {
          opacity: 0;
          bottom: -100px;
        }
        50% {
          bottom: 15px;
          opacity: 1;
        }
        to {
          opacity: 1;
          bottom: 30px;
        }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const div = document.createElement('div');
    div.classList.add('snackbar-container');

    const para = document.createElement('p');
    div.appendChild(para);

    const element = document.getElementsByTagName('body')[0];
    element.appendChild(div);

    para.classList.add('snackbar');
    para.setAttribute('id', 'snackbar');

    if (panelClass === 'success') {
      para.classList.add('success-snackbar')
    } else if (panelClass === 'error') {
      para.classList.add('error-snackbar')
    }

    const snackbar = document.getElementById('snackbar');
    const text = document.createTextNode(message);

    if (snackbar) {
      const oldChild = snackbar.firstChild;
      if (oldChild) {
        snackbar.replaceChild(text, oldChild);
      } else {
        snackbar.appendChild(text);
      }

      const isSnackbarActive = snackbar.dataset['isActive'] === 'true';

      if (isSnackbarActive) {
        snackbar.dataset['isActive'] = 'false';
      } else {
        snackbar.dataset['isActive'] = 'true';

        setTimeout(() => {
          snackbar.dataset['isActive'] = 'false';
        }, duration);
      }
    }
  }
}
