import { triggerDestaque } from '@/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '@services/base/base.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],

  animations: [triggerDestaque]

})
export class GridComponent implements OnInit {

  @Input() lista: any

  @Input() coluna: any

  @Input() rota: any

  objectKeys = Object.keys

  indexTarefa = -1

  constructor(
    private service: BaseService,
    private router: Router,
    private toastr: ToastrService
    ) {}

  ngOnInit(): void {}

  excluir(id: number) {
    this.service.excluir(this.rota.gateway, id).subscribe(
      (retorno) => {
        // Lógica para lidar com o valor emitido
        this.router.navigate([this.rota.listar])
        this.toastr.success('Inativado com successo');
      },
      (erro) => {}
    )    
  }

}
