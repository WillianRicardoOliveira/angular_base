import {TestBed} from '@angular/core/testing';
import {ToastrService} from 'ngx-toastr';
import {AppService} from './app.service';

describe('AppService', () => {
    let service: AppService;
    let toastrService: jasmine.SpyObj<ToastrService>;

    beforeEach(() => {
        toastrService = jasmine.createSpyObj<ToastrService>(
            'ToastrService',
            ['error']
        );

        TestBed.configureTestingModule({
            providers: [
                AppService,
                {
                    provide: ToastrService,
                    useValue: toastrService
                }
            ]
        });

        service = TestBed.inject(AppService);
    });

    it('deve ser criado', () => {
        expect(service).toBeTruthy();
    });
});