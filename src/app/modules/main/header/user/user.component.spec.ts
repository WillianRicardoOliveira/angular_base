import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserService } from '@services/user/user.service';

import { UserComponent } from './user.component';

describe('UserComponent', () => {
    let component: UserComponent;
    let fixture: ComponentFixture<UserComponent>;
    let userServiceMock: jasmine.SpyObj<UserService>;
    let routerMock: jasmine.SpyObj<Router>;

    beforeEach(
        waitForAsync(() => {
            userServiceMock = jasmine.createSpyObj<UserService>('UserService', [
                'logout'
            ]);
            routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);

            TestBed.configureTestingModule({
                declarations: [UserComponent],
                providers: [
                    { provide: UserService, useValue: userServiceMock },
                    { provide: Router, useValue: routerMock }
                ],
                schemas: [NO_ERRORS_SCHEMA]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(UserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should build initials from the user name', () => {
        expect(component.userInitials).toBe('WO');
    });

    it('should logout and redirect to login', () => {
        component.logout();

        expect(userServiceMock.logout).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
});