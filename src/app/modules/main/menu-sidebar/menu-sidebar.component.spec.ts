import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { MenuSidebarComponent } from './menu-sidebar.component';

describe('MenuSidebarComponent', () => {
    let component: MenuSidebarComponent;
    let fixture: ComponentFixture<MenuSidebarComponent>;

    const storeMock = {
        select: jasmine.createSpy('select').and.returnValue(
            of({
                sidebarSkin: 'sidebar-dark-primary'
            })
        )
    };

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [MenuSidebarComponent],
                providers: [
                    { provide: Store, useValue: storeMock }
                ],
                schemas: [NO_ERRORS_SCHEMA]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(MenuSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should apply sidebar skin from ui state', () => {
        expect(component.classes).toBe(
            'main-sidebar elevation-4 sidebar-dark-primary'
        );
    });
});