// Las seis mascotas del diseño. Textos LITERALES de design/alta-fidelidad/Ficha.dc.html (objeto D y FOTO)
// y de Catalogo.dc.html (tipo y motivo corto). Los «atributos» se derivan de esos textos (docs/SPEC.md §4.1)
// y son los que usa el cálculo de compatibilidad. Un test comprueba que los textos siguen coincidiendo con el diseño.
import type { PetAttributes } from "../compatibility/rules";

export interface PetSeed {
  slug: string;
  nombre: string;
  especie: string;
  sexo: string;
  edad: string;
  ciudad: string;
  provincia: string;
  tamano: string;
  tipo: "gato" | "perro" | "otros";
  necesidadesEspeciales: boolean;
  info: Record<"estadoSalud" | "vacunacion" | "cuidados" | "comportamiento" | "nivelActividad" | "convivenciaMascotas" | "necesidadesEspeciales" | "historia", string>;
  encaja: string;
  cuenta: string;
  motivoCorto: string;
  foto: { asset: string; alt: string };
  atributos: PetAttributes;
}

export const PETS: readonly PetSeed[] = [
  {
    "slug": "luna",
    "nombre": "Luna",
    "especie": "Gata",
    "sexo": "Hembra",
    "edad": "3 años",
    "ciudad": "Barcelona",
    "provincia": "Barcelona",
    "tamano": "Pequeño",
    "tipo": "gato",
    "necesidadesEspeciales": true,
    "info": {
      "estadoSalud": "Buena. Visión reducida en el ojo izquierdo.",
      "vacunacion": "Al día",
      "cuidados": "Rutina estable y pocos cambios en casa.",
      "comportamiento": "Tranquila y cariñosa.",
      "nivelActividad": "Baja",
      "convivenciaMascotas": "Se lleva bien con otros gatos.",
      "necesidadesEspeciales": "Sí: visión reducida en un ojo.",
      "historia": "Rescatada en la calle."
    },
    "encaja": "Busca un hogar tranquilo y una rutina estable.",
    "cuenta": "Se orienta de maravilla si los muebles se quedan en su sitio: así su visión reducida no es un problema.",
    "motivoCorto": "Encaja con tu rutina",
    "foto": {
      "asset": "fotos/luna.jpg",
      "alt": "Luna, gata gris y blanca, sentada junto a un muro de piedra y unas flores"
    },
    "atributos": {
      "tamano": "pequeno",
      "etapa": "adulto",
      "actividad": "bajo",
      "vivienda": "piso",
      "horasSolaMax": 8,
      "tiempoDiario": "bajo",
      "convivenciaNinos": "desconocido",
      "convivenciaMascotas": "si",
      "costeMensual": "bajo",
      "necesidadesEspeciales": "leves",
      "experiencia": "basica"
    }
  },
  {
    "slug": "simba",
    "nombre": "Simba",
    "especie": "Gato",
    "sexo": "Macho",
    "edad": "1 año",
    "ciudad": "Badalona",
    "provincia": "Barcelona",
    "tamano": "Pequeño",
    "tipo": "gato",
    "necesidadesEspeciales": false,
    "info": {
      "estadoSalud": "Buena.",
      "vacunacion": "Al día",
      "cuidados": "Juego diario y rascador.",
      "comportamiento": "Curioso y juguetón.",
      "nivelActividad": "Alta",
      "convivenciaMascotas": "Dato no disponible",
      "necesidadesEspeciales": "No",
      "historia": "Nació en una colonia felina."
    },
    "encaja": "Se adapta bien a un piso y puede quedarse solo unas horas.",
    "cuenta": "Disfrutará mucho con un buen rato de juego cada día.",
    "motivoCorto": "Necesita juego diario",
    "foto": {
      "asset": "fotos/simba.jpg",
      "alt": "Simba, gato naranja y blanco, sentado en un camino de piedra"
    },
    "atributos": {
      "tamano": "pequeno",
      "etapa": "adulto",
      "actividad": "alto",
      "vivienda": "piso",
      "horasSolaMax": 6,
      "tiempoDiario": "medio",
      "convivenciaNinos": "desconocido",
      "convivenciaMascotas": "desconocido",
      "costeMensual": "bajo",
      "necesidadesEspeciales": "ninguna",
      "experiencia": "ninguna"
    }
  },
  {
    "slug": "rocky",
    "nombre": "Rocky",
    "especie": "Perro",
    "sexo": "Macho",
    "edad": "5 años",
    "ciudad": "Sabadell",
    "provincia": "Barcelona",
    "tamano": "Grande",
    "tipo": "perro",
    "necesidadesEspeciales": false,
    "info": {
      "estadoSalud": "Buena.",
      "vacunacion": "Al día",
      "cuidados": "Dos paseos largos al día.",
      "comportamiento": "Noble y enérgico.",
      "nivelActividad": "Alta",
      "convivenciaMascotas": "Se lleva bien con otros perros.",
      "necesidadesEspeciales": "No",
      "historia": "Dato no disponible"
    },
    "encaja": "Le gustan las personas activas.",
    "cuenta": "Será más feliz con mucho espacio y dos paseos largos al día.",
    "motivoCorto": "Necesita mucho espacio",
    "foto": {
      "asset": "fotos/rocky.jpg",
      "alt": "Rocky, perro de pelo dorado, sentado en el césped con la lengua fuera"
    },
    "atributos": {
      "tamano": "grande",
      "etapa": "adulto",
      "actividad": "alto",
      "vivienda": "casa_jardin",
      "horasSolaMax": 4,
      "tiempoDiario": "alto",
      "convivenciaNinos": "desconocido",
      "convivenciaMascotas": "si",
      "costeMensual": "alto",
      "necesidadesEspeciales": "ninguna",
      "experiencia": "basica"
    }
  },
  {
    "slug": "kira",
    "nombre": "Kira",
    "especie": "Perra",
    "sexo": "Hembra",
    "edad": "8 años",
    "ciudad": "Barcelona",
    "provincia": "Barcelona",
    "tamano": "Mediano",
    "tipo": "perro",
    "necesidadesEspeciales": true,
    "info": {
      "estadoSalud": "Artrosis leve en las patas traseras.",
      "vacunacion": "Al día",
      "cuidados": "Paseos cortos y revisiones veterinarias periódicas.",
      "comportamiento": "Tranquila y sociable.",
      "nivelActividad": "Baja",
      "convivenciaMascotas": "Se lleva bien con perros y gatos.",
      "necesidadesEspeciales": "Sí: artrosis leve.",
      "historia": "Su familia anterior ya no podía cuidarla."
    },
    "encaja": "Es tranquila y se adapta a una rutina estable.",
    "cuenta": "Estará genial con paseos cortos y sus revisiones veterinarias al día.",
    "motivoCorto": "Necesita paseos cortos",
    "foto": {
      "asset": "fotos/kira.jpg",
      "alt": "Kira, perra blanca y marrón con collar rosa, sentada en un parque"
    },
    "atributos": {
      "tamano": "mediano",
      "etapa": "mayor",
      "actividad": "bajo",
      "vivienda": "piso",
      "horasSolaMax": 6,
      "tiempoDiario": "medio",
      "convivenciaNinos": "desconocido",
      "convivenciaMascotas": "si",
      "costeMensual": "alto",
      "necesidadesEspeciales": "medias",
      "experiencia": "basica"
    }
  },
  {
    "slug": "coco",
    "nombre": "Coco",
    "especie": "Conejo",
    "sexo": "Macho",
    "edad": "2 años",
    "ciudad": "L'Hospitalet de Llobregat",
    "provincia": "Barcelona",
    "tamano": "Pequeño",
    "tipo": "otros",
    "necesidadesEspeciales": false,
    "info": {
      "estadoSalud": "Buena.",
      "vacunacion": "Al día",
      "cuidados": "Salir de la jaula y moverse libremente cada día.",
      "comportamiento": "Tímido al principio.",
      "nivelActividad": "Media",
      "convivenciaMascotas": "Dato no disponible",
      "necesidadesEspeciales": "No",
      "historia": "Entregado por su familia anterior."
    },
    "encaja": "Se adapta bien a un piso y a tu horario.",
    "cuenta": "Le encanta salir de la jaula y moverse libremente cada día.",
    "motivoCorto": "Encaja con tu espacio",
    "foto": {
      "asset": "fotos/coco.jpg",
      "alt": "Coco, conejo blanco y beige de orejas caídas, sentado sobre una alfombra"
    },
    "atributos": {
      "tamano": "pequeno",
      "etapa": "adulto",
      "actividad": "medio",
      "vivienda": "piso",
      "horasSolaMax": 8,
      "tiempoDiario": "medio",
      "convivenciaNinos": "desconocido",
      "convivenciaMascotas": "desconocido",
      "costeMensual": "bajo",
      "necesidadesEspeciales": "ninguna",
      "experiencia": "ninguna"
    }
  },
  {
    "slug": "nube",
    "nombre": "Nube",
    "especie": "Cobaya",
    "sexo": "Hembra",
    "edad": "4 años",
    "ciudad": "Terrassa",
    "provincia": "Barcelona",
    "tamano": "Pequeño",
    "tipo": "otros",
    "necesidadesEspeciales": true,
    "info": {
      "estadoSalud": "Necesita revisiones dentales.",
      "vacunacion": "No aplica",
      "cuidados": "Dieta rica en heno y revisiones dentales.",
      "comportamiento": "Tranquila y sociable.",
      "nivelActividad": "Media",
      "convivenciaMascotas": "Convive mejor con otra cobaya.",
      "necesidadesEspeciales": "Sí: problemas dentales.",
      "historia": "Rescatada de un abandono."
    },
    "encaja": "Es tranquila y sociable.",
    "cuenta": "Estará estupenda con sus revisiones dentales y, si puede ser, la compañía de otra cobaya.",
    "motivoCorto": "Necesita cuidado dental",
    "foto": {
      "asset": "fotos/nube.jpg",
      "alt": "Nube, cobaya blanca y naranja sobre una manta azul"
    },
    "atributos": {
      "tamano": "pequeno",
      "etapa": "adulto",
      "actividad": "medio",
      "vivienda": "piso",
      "horasSolaMax": 4,
      "tiempoDiario": "medio",
      "convivenciaNinos": "desconocido",
      "convivenciaMascotas": "prefiere_compania_especie",
      "costeMensual": "medio",
      "necesidadesEspeciales": "altas",
      "experiencia": "basica"
    }
  },
  {
    "slug": "donatello",
    "nombre": "Donatello",
    "especie": "Perro",
    "sexo": "Macho",
    "edad": "3 años",
    "ciudad": "Vigo",
    "provincia": "A Coruña",
    "tamano": "Pequeño",
    "tipo": "perro",
    "necesidadesEspeciales": false,
    "info": {
      "estadoSalud": "Buena",
      "vacunacion": "Al día",
      "cuidados": "Dos paseos largos al día.",
      "comportamiento": "Energético y loco.",
      "nivelActividad": "Media",
      "convivenciaMascotas": "Sí",
      "necesidadesEspeciales": "No",
      "historia": "Rescatado en la calle."
    },
    "encaja": "Le gustan las personas activas.",
    "cuenta": "Será más feliz con mucho espacio y dos paseos largos al día.",
    "motivoCorto": "Necesita mucho ejercicio.",
    "foto": {
      "asset": "fotos/donatello.jpg",
      "alt": "Donatello, perro salchicha"
    },
    "atributos": {
      "tamano": "pequeno",
      "etapa": "adulto",
      "actividad": "alto",
      "vivienda": "piso",
      "horasSolaMax": 4,
      "tiempoDiario": "medio",
      "convivenciaNinos": "no",
      "convivenciaMascotas": "si",
      "costeMensual": "medio",
      "necesidadesEspeciales": "ninguna",
      "experiencia": "basica"
    }
  }
];
