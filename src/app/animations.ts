import { transition, state, style, trigger, animate } from '@angular/animations';

export const triggerDestaque = trigger('trigger-destaque', [

  state('inicio', style({
 //   border: '2px solid #B2B6FF'
  })),
  state('fim', style({
    //border: '4px solid #B2B6FF',
    filter: 'brightness(92%)',
    backgroundColor: '#caeff9'
  })),
  transition('inicio => fim', [
    // https://easings.net/pt-br
    animate('200ms ease-out',
      style({

        transform: 'scale(1.02)'
      })
    ),
    animate(200)
  ])

])


export const shownStateTrigger = trigger('shownState', [

  state('notShown', style({

  })),
  state('shown', style({

  })),
  transition('notShown => shown', [
    style({
      opacity: 0
    }),
    animate(300, style({
      opacity: 1
    }))

  ])


])
