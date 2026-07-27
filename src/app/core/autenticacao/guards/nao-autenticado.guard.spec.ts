import {TestBed, inject, waitForAsync} from '@angular/core/testing';

import {NaoAutenticadoGuard} from './nao-autenticado.guard';

describe('NaoAutenticadoGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NaoAutenticadoGuard]
        });
    });

    it('should ...', inject([NaoAutenticadoGuard], (guard: NaoAutenticadoGuard) => {
        expect(guard).toBeTruthy();
    }));
});
