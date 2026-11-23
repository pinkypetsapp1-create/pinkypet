import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Session } from '../../core/session';
import { NavigationBar } from '../../ui/navigation-bar';
import { SHAPES_PROCESO } from '../../ui/shapes';
import { TopAppBar } from '../../ui/top-app-bar';

/** Proceso · Cómo adoptar (ComoAdoptar.dc.html) en sus 4 estados de usuario. */
@Component({
  selector: 'pp-proceso',
  imports: [IonContent, RouterLink, TopAppBar, NavigationBar],
  templateUrl: './proceso.page.html',
  styleUrl: './proceso.page.css',
})
export class ProcesoPage {
  protected readonly session = inject(Session);
  protected readonly scrolled = signal(false);

  protected readonly hero = computed(() => {
    switch (this.session.state()) {
      case 'solicitud':
        return { titulo: `Tu solicitud para adoptar a ${this.session.activePetName()} está en proceso`, texto: 'La protectora la está revisando. Te avisaremos cuando responda.', cta: 'Ver el estado de mi solicitud', link: '/proceso/solicitud' };
      case 'completo':
        return { titulo: 'Elige una mascota compatible', texto: 'Ya tienes tus resultados. Mira la ficha de cada mascota y envía tu solicitud cuando lo tengas claro.', cta: 'Ver mis mascotas compatibles', link: '/mascotas' };
      case 'registrado':
        return { titulo: 'Empieza por el test', texto: 'Responde 15 preguntas y verás qué mascotas encajan contigo.', cta: 'Descubrir mi compatibilidad', link: '/test' };
      default:
        return { titulo: 'Empieza por el test', texto: 'El test te dice qué mascotas encajan con tu hogar y tu día a día. Necesitas una cuenta para hacerlo.', cta: 'Descubrir mi compatibilidad', link: '/registro' };
    }
  });

  private readonly actual = computed(() => ({ solicitud: 3, completo: 1, registrado: 0, invitado: 0 })[this.session.state()]);
  protected readonly pasos = computed(() =>
    [
      ['Haz el test de compatibilidad.', '15 preguntas sobre tu hogar, tu día a día y lo que buscas en una mascota.'],
      ['Revisa las mascotas compatibles y su ficha.', 'Verás por qué encaja cada uno contigo y qué necesita para estar bien.'],
      ['Envía una solicitud de adopción.', 'Solo puedes tener una solicitud en proceso a la vez.'],
      ['Espera una respuesta.', 'La protectora revisa tu solicitud y te responde. Puedes seguir el estado en todo momento.'],
    ].map(([titulo, texto], i) => {
      const st = i < this.actual() ? 'done' : i === this.actual() ? 'current' : 'pending';
      const label = { done: 'completado', current: 'paso actual', pending: 'pendiente' }[st];
      return { n: i + 1, titulo, texto, st, forma: SHAPES_PROCESO[i], aria: `Paso ${i + 1} de 4, ${titulo} ${label}` };
    }),
  );
  protected readonly requisitos = [
    'Ser mayor de edad y presentar tu DNI o NIE.',
    'Que todas las personas con las que vives estén de acuerdo con la adopción.',
    'Si vives de alquiler, que el contrato permita tener mascotas.',
    'Hacer una entrevista con la protectora y aceptar el seguimiento después de la adopción.',
    'Firmar el contrato de adopción y abonar la cuota, si la protectora la tiene.',
  ];
}
