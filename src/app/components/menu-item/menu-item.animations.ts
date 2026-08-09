import {
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';

const TRANSITION_DURATION = 250;

export const rotateAnimation =
    trigger(
        'rotate',
        [
            state(
                'true',
                style({
                    transform:
                        'rotate(90deg)'
                })
            ),
            transition(
                'false <=> true',
                animate(
                    `${TRANSITION_DURATION}ms ease-out`
                )
            )
        ]
    );