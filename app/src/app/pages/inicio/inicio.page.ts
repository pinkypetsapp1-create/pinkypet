import { Component, computed, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import type { CompatibilityList, PetList, PetSummary } from '../../core/api.types';
import { Api } from '../../core/api';
import { Session } from '../../core/session';
import { AccountPrompts } from '../../ui/account-prompts';
import { Dialog } from '../../ui/dialog';
import { NavigationBar } from '../../ui/navigation-bar';
import { SHAPE_HERO_112, SHAPE_HERO_80 } from '../../ui/shapes';
import { Splash } from '../../ui/splash';
import { TopAppBar } from '../../ui/top-app-bar';

interface Bloque {
  icon: string;
  titulo: string;
  pct: number;
  track: string;
  active: string;
  /** Textos aprobados por el equipo (Main.dc.html, BLOQUES). */
  texto: string;
  peso: string;
}

interface CarouselItem {
  id: string;
  nombre: string;
  foto: string;
  pct: number | null;
  link: string;
  aria: string;
}

/** Inicio (design/alta-fidelidad/Main.dc.html) en sus estados: sin cuenta, registrado, con test y con solicitud. */
@Component({
  selector: 'pp-inicio',
  imports: [IonContent, RouterLink, TopAppBar, NavigationBar, AccountPrompts, Splash, Dialog],
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.css',
})
export class InicioPage {
  private readonly api = inject(Api);
  protected readonly session = inject(Session);
  protected readonly scrolled = signal(false);
  protected readonly shape112 = SHAPE_HERO_112;
  protected readonly shape80 = SHAPE_HERO_80;

  protected readonly conTest = computed(() => ['completo', 'solicitud'].includes(this.session.state()));

  /** Con test: compatibles ordenados (con %). Sin test: el catálogo en su orden. */
  private readonly pets = resource({
    params: () => ({ conTest: this.conTest(), user: this.session.user()?.id }),
    loader: async ({ params }): Promise<PetSummary[]> =>
      params.conTest
        ? (await this.session.authed<CompatibilityList>('/compatibility')).items
        : (await this.api.request<PetList>('/pets')).items,
  });

  protected readonly carousel = computed<CarouselItem[]>(() => {
    const test = this.conTest();
    return (this.pets.hasValue() ? this.pets.value() : []).map((p) => {
      const pct = test ? (p.compatibilidad?.porcentaje ?? null) : null;
      return {
        id: p.id,
        nombre: p.nombre,
        foto: 'assets/' + p.foto.asset,
        pct,
        link: test ? `/mascotas/${p.id}` : '/mascotas',
        aria: test ? `${p.nombre}, ${pct} % compatible. Ver su ficha` : `${p.nombre}. Ver las mascotas`,
      };
    });
  });

  protected readonly hero = computed(() => {
    const state = this.session.state();
    if (state === 'solicitud') {
      return {
        titulo: `Tu solicitud para adoptar a ${this.session.activePetName()} está en proceso`,
        texto: 'La protectora la está revisando. Te avisaremos cuando responda.',
        cta: 'Ver el estado de mi solicitud',
        link: '/proceso/solicitud',
      };
    }
    if (state === 'completo') {
      const n = this.carousel().length;
      return {
        titulo: n === 1 ? '1 mascota encaja contigo' : `${n} mascotas encajan contigo`,
        texto: 'Ya tienes tus resultados. Mira por qué encaja cada uno contigo y elige con calma.',
        cta: 'Ver mis mascotas compatibles',
        link: '/mascotas',
      };
    }
    return {
      titulo: '¿Qué mascota encaja contigo?',
      texto: 'El test de compatibilidad valora qué mascota encaja con tu hogar, tu día a día y lo que buscas en una mascota, antes de que decidas adoptar.',
      cta: 'Descubrir mi compatibilidad',
      link: state === 'registrado' ? '/test' : '/registro',
    };
  });

  /** Bloques del test, con la geometría de los anillos del diseño (circunferencia 251,33 de r = 40). */
  protected readonly bloques: Bloque[] = [
    {
      icon: 'chair', titulo: 'Mi hogar', pct: 34, track: '0 85.45 153.88 251.33', active: '73.45 251.33',
      texto: 'Una mascota pasa casi todo su tiempo en casa. Estas 5 preguntas comprueban si tu hogar está preparado para ella: si hay niños pequeños u otras mascotas, si todas las personas con las que vives están de acuerdo, el tipo de vivienda y si permite tener animales.',
      peso: 'Cuenta un 34 % del resultado. Los tres bloques pesan casi lo mismo; el hogar, un poco más, porque sin una casa preparada lo demás no se puede cumplir.',
    },
    {
      icon: 'schedule', titulo: 'Mi día a día', pct: 33, track: '0 82.94 156.39 251.33', active: '70.94 251.33',
      texto: 'Cuidar de una mascota pide tiempo cada día. Estas 5 preguntas miran cuántas horas estaría sola, cuánto tiempo puedes dedicarle, quién la cuidaría si viajas o enfermas, tu ritmo de vida y si ya has tenido mascotas.',
      peso: 'Cuenta un 33 % del resultado, un tercio del test.',
    },
    {
      icon: 'pet_supplies', titulo: 'La mascota que busco', pct: 33, track: '0 82.94 156.39 251.33', active: '70.94 251.33',
      texto: 'Cada mascota tiene su carácter y sus necesidades. Estas 5 preguntas recogen lo que buscas: tamaño, nivel de actividad y edad, lo que puedes dedicar cada mes a sus cuidados y si adoptarías una mascota con necesidades especiales.',
      peso: 'Cuenta un 33 % del resultado, un tercio del test.',
    },
  ];

  /** Ventana de cada bloque (Main-Info-*.dc.html). Al cerrarla, el foco vuelve a la caja que la abrió. */
  protected readonly bloqueAbierto = signal<Bloque | null>(null);
  private cajaQueAbrio: HTMLElement | null = null;
  protected readonly ctaBloque = computed(() =>
    this.conTest()
      ? { texto: 'Revisar mis respuestas', link: '/perfil' }
      : { texto: 'Hacer el test de compatibilidad', link: this.session.state() === 'invitado' ? '/registro' : '/test' },
  );

  protected abrirBloque(b: Bloque, e: Event): void {
    this.cajaQueAbrio = e.currentTarget as HTMLElement;
    this.bloqueAbierto.set(b);
  }

  protected cerrarBloque(): void {
    this.bloqueAbierto.set(null);
    this.cajaQueAbrio?.focus();
    this.cajaQueAbrio = null;
  }
}
