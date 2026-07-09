import { Component, OnInit } from '@angular/core';
import { FormBuscaService } from '@services/site/form-busca/form-busca.service';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    standalone: false
})
export class ModalComponent implements OnInit {
  
  constructor(public formBuscaService: FormBuscaService) {}
  
  ngOnInit(): void {}

}
