import { animate, style, transition, trigger } from '@angular/animations';

export const collapseTrigger = trigger(
    'collapse',
    [
        transition(
            ':enter',
            [
                style({ height: 0, opacity: 0 }),
                animate('.5s ease-out')
            ]
        ),
        transition(
            ':leave',
            [
                animate('.3s ease-in', style({ height: 0, opacity: 0 }))
            ]
        )
    ]
);

export const secondaryToolbar = trigger('secondaryToolbar', [
    transition(':enter', [
        style({
            transform: 'scaleY(0)'
        }),
        animate('100ms')
    ])
])