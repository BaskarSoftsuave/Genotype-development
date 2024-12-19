import {Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ModelService} from "./model.service";

@Component({
  selector: 'jw-modal',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModelComponent implements OnInit ,OnDestroy{
  id!: string;
  private element: any;

  constructor(private modalService: ModelService, private elementRef: ElementRef
  ) {
    this.element = elementRef.nativeElement;
  }

  ngOnInit(): void {
    if (!this.element.id) {
      console.error('modal must have an id');
      return;
    }

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close modal on background click
    this.element.addEventListener('click', (elementRef: { target: { className: string; }; }) => {
      if (elementRef.target.className == 'jw-modal') {
        this.close();
      }
    });

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.modalService.add(this);
  }

  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }

  // open modal
  open(): void {
    this.element.style.display = 'block';
    document.body.classList.add('jw-modal-open');
  }

  // close modal
  close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('jw-modal-open');
  }

}
