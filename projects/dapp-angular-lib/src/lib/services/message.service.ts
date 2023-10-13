import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  /**
   * Show a snack bar with a custom message and duration
   * @param message The message for the snack bar
   * @param duration The duration of the displayed message, default = 5000 (milliseconds)
   * @param position The position of the snackbar: "top" or "bottom", default = "bottom"
   * @param panelClass The style class name: "info", "success" or "error", default = "info"
   */
  showMessage(
    message: string,
    duration: number = 5000,
    panelClass: string = 'info',
    position: string = 'bottom'
  ) {
    const styles = `
      .snackbar-container {
        display: grid;
        overflow: hidden;
        font-size: 1.05rem;
        font-family: "Poppins", sans-serif;
        background-color: hsl(0, 0%, 100%);
        place-items: center;
      }

      .snackbar {
        background: hsl(0, 0%, 30%);
        color: hsl(0, 0%, 90%);
        position: fixed;
        bottom: 0%;
        opacity: 0;
        padding: 1em;
        border-radius: 10px;
        max-width: 90%;
        word-break: break-all;
        z-index: 9999 !important;
      }

      .snackbar[data-is-active=true] {
        animation: showAnim 0.5s linear forwards;
      }

      .snackbar[data-is-active=false] {
        animation: hideAnim 0.5s linear forwards;
      }

      .position-top {
        right: 40px;
        bottom: auto !important;
        max-width: 40%;
      }

      .position-bottom {
        top: auto !important;
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

    let top = 100;
    let bottom = 30;

    let div: Element;

    if (document.getElementsByClassName('snackbar-container').length > 0) {
      div = document.getElementsByClassName('snackbar-container')[0];

      for (let i = 0; i < div.children.length; i++) {
        const el = document.getElementById(`snackbar${i}`);

        if (el) {
          const positionLastElementTop = el.classList.contains('position-top');
          const positionLastElementBottom =
            el.classList.contains('position-bottom');

          if (position === 'top' && positionLastElementTop) {
            top += el.offsetHeight + 10;
          } else if (position === 'bottom' && positionLastElementBottom) {
            bottom += el.offsetHeight + 10;
          }
        }
      }
    } else {
      div = document.createElement('div');
      div.classList.add('snackbar-container');
    }

    let numberOfSnackbars = div.children.length;

    const snackbarContainer = div;

    const para = document.createElement('p');
    snackbarContainer.appendChild(para);

    const element = document.getElementsByTagName('body')[0];
    element.appendChild(snackbarContainer);

    para.classList.add(`snackbar`);
    para.setAttribute('id', `snackbar${numberOfSnackbars}`);

    if (position === 'top') {
      para.classList.add('position-top');
    } else if (position === 'bottom') {
      para.classList.add('position-bottom');
    }

    if (panelClass === 'success') {
      para.classList.add('success-snackbar');
    } else if (panelClass === 'error') {
      para.classList.add('error-snackbar');
    }

    const snackbar = document.getElementById(`snackbar${numberOfSnackbars}`);
    const text = document.createTextNode(message);

    if (snackbar) {
      if (position === 'top') {
        snackbar.style.top = `${top}px`;
      } else if (position === 'bottom') {
        snackbar.setAttribute('style', `bottom:${bottom}px !important`);
      }

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
          div.removeChild(snackbar);
        }, duration);
      }
    }
  }
}
