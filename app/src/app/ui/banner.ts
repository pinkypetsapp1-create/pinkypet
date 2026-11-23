import { Component, input } from '@angular/core';

/** Banner de error del Design System (role="alert"). */
@Component({
  selector: 'pp-banner',
  host: { class: 'pp-banner', role: 'alert' },
  template: `<span class="pp-icon pp-icon--filled" aria-hidden="true">error</span><p>{{ text() }}</p>`,
})
export class Banner {
  readonly text = input.required<string>();
}
