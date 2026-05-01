import { ExtendedComponent } from './extendedComponent.js';


export class PopupComponent extends ExtendedComponent {
    constructor(selector, props, id) {
        super(selector, props);
        this.size = props.size ? props.size : null;
        this.BToMPage = props.BToMPage ? true : false;
        this.id = id || Math.random().toString(36).substr(2, 9);
        this.popupElement = null; 
        this.onCloseRequest = props.onCloseRequest != undefined ? props.onCloseRequest : true;
    }

    withData(procId, docId) {
        this.procId = procId;
        this.docId = docId;
    }

    content() {
       return ``;
    }

    show(isAttach= true) {
        if (!this.popupElement) {
            const markup = this.render();
            document.body.insertAdjacentHTML('beforeend', markup);
            this.popupElement = document.getElementById(`popup-${this.id}`);
            if(isAttach){
                this.attachEvents();
            }
        }
        this.popupOverlay = this.popupElement.querySelector(`#popup-overlay-${this.id}`);
        this.popupContent = this.popupElement.querySelector(`#popup-content-${this.id}`);
        if (this.popupElement && this.popupOverlay && this.popupContent) {
            this.popupElement.style.display = 'flex';
            this.popupElement.style.animation = 'slideInFromLeft 0.4s ease-out forwards';
            this.popupOverlay.style.display = 'flex';
            this.popupContent.style.display = 'flex';
        } else {
            console.error('Popup elements not found');
        }
    }

    async hide(isRemove) {
        if (this.popupElement) {
            this.popupElement.style.animation = 'slideOutToLeft 0.3s ease-in forwards';
            if(this.onCloseRequest && isRemove){
                await req('/table/remove', {procId:this.procId, docId:this.docId});
            }
            await new Promise((resolve) => {
                const handleAnimationEnd = () => {
                    if(this.popupElement){
                        this.popupElement.removeEventListener('animationend', handleAnimationEnd);
                        document.body.removeChild(this.popupElement);
                        this.popupOverlay.style.display = 'none';
                        this.popupContent.style.display = 'none';
                    }
                    this.detachEvents();
                    this.popupElement = null;
                    this.popupOverlay = null;
                    this.popupContent = null;
                    resolve();
                };
                this.popupElement.addEventListener('animationend', handleAnimationEnd);
                setTimeout(handleAnimationEnd, 350);
            });
        }
    }

    async close(isRemove) {
        await this.hide(isRemove);
    }

    open() {
        this.show();
    }

    attachEvents() {
        this.popupOverlay = document.getElementById(`popup-overlay-${this.id}`);
        this.popupContent = document.getElementById(`popup-content-${this.id}`);
        // Delegate close actions to body so dynamic popup controls are handled consistently.
        this.addEvent('body',`#close-popup-${this.id}-1`, 'click', async () => await this.hide(true));
        this.addEvent('body',`#close-popup-${this.id}-2`, 'click', async () => await this.hide(true));
        this.addEvent('body',`#close-popup-${this.id}-3`, 'click', async () => await this.hide(true));
        this.addEvent('body',`#cancel-${this.id}`, 'click', async () => await this.hide(true));
    }

    leftCloseBtn() {
        // Left chevron close button for mobile layout.
        const html = this.isMobile && this.size !== 'small'
            ? `<span class="close-button2 angled-less-than" id="close-popup-${this.id}-2" style="color:white !important; font-weight:900; font-size:26px; font-family: 'Arial Black', sans-serif;">&#10216;</span>`
            : ``;
        return html;
    }

    rightCloseBtn() {
        // Standard close icon for desktop and compact popup size.
        const html = (this.size === 'small' || !this.isMobile)
            ? `<span class="close-button" id="close-popup-${this.id}-1">&times;</span>`
            : ``;
        return html;
    }

    bottomCloseBtn() {
        return this.size !== 'small' && this.BToMPage !== false
            ? `<button class="closePopup" id="close-popup-${this.id}-3" ><i class="bi bi-arrow-left"></i> Back to main page</button>`
            : ``;
    }

    bottomBarBtn() {
        return !this.isMobile
            ? `<div class="modal-footer" style="
                        display:flex;
                        justify-content:flex-end;
                        position:absolute;
                        bottom:0; right:20px;
                        width:100%;
                        padding:10px;">
          <div class="btn-group">
            <button type="button" id="cancel-${this.id}"
                    class="btn btn-secondary cancel"
                    style="background-color:#3a3a3a; color:#fff; border:1px solid #555; border-radius:6px; cursor:pointer; font-size:14px; padding:6px 12px; margin-right:10px;">
              Close
            </button>
            <button type="button" class="btn btn-primary save"
                    style="background-color:#007bff; color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:14px; padding:6px 18px; min-width:120px;">
              Ok
            </button>
          </div>
       </div>`
            : ``;
    }

    getSmallStyle() {
        return this.size === 'small'
            ? `<style>
                    #close-popup-${this.id}-1 {
                        right: 10px;
                    }
                    .close-button:hover {
                        color: white;
                    }
                    #popup-content-${this.id} .popup-sub-content {
                        padding: 20px;
                        display: grid;
                        grid-template-columns: 20% 60% 20%;
                        width: 100%;
                        max-width: 500px;
                        margin: auto;  
                        box-sizing: border-box;                  
                    }
                    #popup-content-${this.id} input[type="text"],
                    #popup-content-${this.id} input[type="email"] {
                        grid-column: 1 / 4;
                        width: 100%; 
                        height: 40px; 
                        font-size: 16px; 
                        padding: 5px; 
                    }
                    #popup-content-${this.id} button {
                        padding: 8px;
                        margin-top: 20px; 
                        grid-column: 1 / 3;
                        width: 80%; 
                        background-color: blue;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    #popup-content-${this.id} label {
                        grid-column: 1 / 4;
                        margin-bottom: 5px;
                    }
                    #popup-content-${this.id} {
                        width:75%;
                        top: 30vh;
                        bottom: 40vw;
                        border-radius: 8px;
                    }
                    #close-popup-${this.id}-3{
                        width: 97% !important; 
                    }
                </style>` : ``;
    }

    detachEvents() {
        this.currentEventHandlers.forEach(handler => {
            const { element, eventType, method } = handler;
            element.removeEventListener(eventType, method);
        });
        this.currentEventHandlers = [];
    }

    render() {
        return `
            <style>
                .popup {
                    display: none; 
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000; 
                    
                    
                }
                input[type="text"] {
                    background-color: #222222;
                    color: #fff;
                }
                input[type="date"] {
                    background-color: #222222;
                    color: #fff;
                }
                select {
                    background-color: #222222;
                    color: #f6f5f5;
                }
                select option {
                    background-color: #222222;
                    color: #ffffff;
                }
                .popup-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5); 
                }
                
                input[type="datetime-local"].styled-input {
                  background-color: #222222;
                  color: #ffffff;
                  border: 1px solid #afaeae;
                  border-radius: 6px;
                  padding: 8px 10px;
                }
                
                
                input[type="datetime-local"].styled-input::-webkit-calendar-picker-indicator {
                  filter: invert(1);           
                  opacity: 0.8;
                  cursor: pointer;
                }
                
                
                input[type="datetime-local"].styled-input::-webkit-datetime-edit,
                input[type="datetime-local"].styled-input::-webkit-datetime-edit-fields-wrapper,
                input[type="datetime-local"].styled-input::-webkit-datetime-edit-text,
                input[type="datetime-local"].styled-input::-webkit-datetime-edit-hour-field,
                input[type="datetime-local"].styled-input::-webkit-datetime-edit-minute-field,
                input[type="datetime-local"].styled-input::-webkit-datetime-edit-day-field,
                input[type="datetime-local"].styled-input::-webkit-datetime-edit-month-field,
                input[type="datetime-local"].styled-input::-webkit-datetime-edit-year-field {
                  color: #ffffff;
                }
                
                
                input[type="datetime-local"].styled-input:focus {
                  outline: none;
                  border-color: #6b6bff;
                  box-shadow: 0 0 0 3px rgba(107,107,255,0.2);
                }
                
                
                input[type="datetime-local"].styled-input {
                  color-scheme: dark;
                }
                textarea.styled-input.form-control {
                  background-color: #222222;
                  color: #ffffff;
                  border: 1px solid #eeeeee;  
                  border-radius: 6px;
                  padding: 8px 10px;
                  min-height: 90px;
                  resize: vertical;           
                  color-scheme: dark;         
                }
                textarea.styled-input.form-control::placeholder {
                  color: #cfcfcf;
                }
                textarea.styled-input.form-control:focus {
                  outline: none;
                  border-color: #ffffff;
                  box-shadow: 0 0 0 3px rgba(255,255,255,0.15);
                }

                .popup-content {
                    position: relative;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    z-index: 1001; 
                    color: white;
                }

            </style>
            ${this.getSmallStyle()}
            <div id="popup-${this.id}" class="popup" >
                <div class="popup-overlay" id="popup-overlay-${this.id}"></div>
                <div class="popup-content" id="popup-content-${this.id}">
                    ${this.rightCloseBtn()}
                    ${this.leftCloseBtn()}
                    ${this.content()}
                    ${this.bottomCloseBtn()}
                    ${this.bottomBarBtn()}
                </div>
               
            </div>`;
    }
}


