// npm run mascota:leer -- ../mascotas/nueva-mascota.md [--escribir]
// Lee la ficha de mascota nueva, la comprueba y muestra (o escribe) todo lo que hay que añadir:
// la entrada de src/seed/pets.data.ts y los fragmentos del diseño (Ficha, Catalogo, Main) con el % de la cuenta demo.
// Lo usa la skill /nueva-mascota. Sin --escribir no cambia ningún archivo.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { computeCompatibility, type PetAttributes } from '../src/compatibility/rules';
import { DEMO_ANSWERS } from '../src/seed/demo.data';
import { PETS, type PetSeed } from '../src/seed/pets.data';

const PROVINCIAS = ['A Coruña', 'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Baleares', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ceuta', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Jaén', 'La Rioja', 'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Melilla', 'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'];

function leerFicha(path: string): Map<string, string> {
  const campos = new Map<string, string>();
  for (const linea of readFileSync(path, 'utf8').split('\n')) {
    if (/^\s*(>|#|-|\*|\|)/.test(linea)) continue;
    const m = linea.match(/^([A-ZÁÉÍÓÚÑ][^:]{1,60}):\s*(.*)$/);
    if (m) campos.set(m[1].trim(), m[2].trim());
  }
  return campos;
}

const errores: string[] = [];
const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

function main(): void {
  const args = process.argv.slice(2);
  const fichaPath = resolve(args.find((a) => !a.startsWith('--')) ?? '../mascotas/nueva-mascota.md');
  const escribir = args.includes('--escribir');
  if (!existsSync(fichaPath)) throw new Error(`No encuentro la ficha: ${fichaPath}`);
  const f = leerFicha(fichaPath);

  const texto = (campo: string, max = 300): string => {
    const v = f.get(campo) ?? '';
    if (!v) errores.push(`Falta «${campo}».`);
    else if (v.length > max) errores.push(`«${campo}» es demasiado largo (${v.length} caracteres; máximo ${max}).`);
    return v;
  };
  const opcion = <T extends string>(campo: string, opciones: Record<string, T>): T => {
    const v = f.get(campo) ?? '';
    const k = v ? Object.keys(opciones).find((o) => sinTildes(v).startsWith(sinTildes(o))) : undefined;
    if (!v) errores.push(`Falta «${campo}».`);
    else if (!k) errores.push(`«${campo}» debe ser una de: ${Object.keys(opciones).join(' · ')} (ahora: «${v}»).`);
    return (k ? opciones[k] : Object.values(opciones)[0]) as T;
  };
  const literal = (campo: string, opciones: string[]): string => {
    const v = f.get(campo) ?? '';
    const k = opciones.find((o) => sinTildes(o) === sinTildes(v));
    if (!v) errores.push(`Falta «${campo}».`);
    else if (!k) errores.push(`«${campo}» debe ser una de: ${opciones.join(' · ')} (ahora: «${v}»).`);
    return k ?? v;
  };

  const nombre = texto('Nombre', 30);
  const slug = sinTildes(nombre).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (PETS.some((p) => p.slug === slug)) errores.push(`Ya existe una mascota con el nombre «${nombre}».`);
  const provincia = literal('Provincia', PROVINCIAS);
  const ne = texto('Necesidades especiales', 120);
  if (ne && ne !== 'No' && !ne.startsWith('Sí: ')) errores.push('«Necesidades especiales» debe ser «No» o empezar por «Sí: ».');
  const motivo = texto('Motivo corto', 25);
  const archivo = texto('Archivo de la foto', 60);
  const fotoPath = join(dirname(fichaPath), 'fotos', archivo);
  if (archivo && !existsSync(fotoPath)) errores.push(`No encuentro la foto en mascotas/fotos/${archivo}.`);
  if (archivo && !/\.jpe?g$/i.test(archivo)) errores.push('La foto debe ser JPG.');
  const alt = texto('Descripción de la foto', 160);
  if (alt && nombre && !alt.startsWith(nombre)) errores.push('«Descripción de la foto» debe empezar por el nombre de la mascota.');
  const horas = Number((f.get('Horas que puede estar sola') ?? '').replace(',', '.'));
  if (!Number.isFinite(horas) || horas < 0 || horas > 24) errores.push('«Horas que puede estar sola» debe ser un número entre 0 y 24.');

  const pet: PetSeed = {
    slug,
    nombre,
    especie: texto('Especie', 20),
    sexo: literal('Sexo', ['Macho', 'Hembra']),
    edad: texto('Edad', 20),
    ciudad: texto('Ciudad', 40),
    provincia,
    tamano: literal('Tamaño', ['Pequeño', 'Mediano', 'Grande']),
    tipo: opcion('Tipo', { Gato: 'gato', Perro: 'perro', Otros: 'otros' } as const),
    necesidadesEspeciales: ne.startsWith('Sí'),
    info: {
      estadoSalud: texto('Estado de salud', 120),
      vacunacion: literal('Vacunación', ['Al día', 'Pendiente', 'No aplica']),
      cuidados: texto('Cuidados', 120),
      comportamiento: texto('Comportamiento', 80),
      nivelActividad: literal('Nivel de actividad', ['Baja', 'Media', 'Alta']),
      convivenciaMascotas: texto('Convivencia con otras mascotas', 120),
      necesidadesEspeciales: ne,
      historia: texto('Historia', 160),
    },
    encaja: texto('Por qué encaja', 120),
    cuenta: texto('Lo que cuenta la protectora', 180),
    motivoCorto: motivo,
    foto: { asset: `fotos/${slug}.jpg`, alt },
    atributos: {
      tamano: opcion('Tamaño', { Pequeño: 'pequeno', Mediano: 'mediano', Grande: 'grande' } as const),
      etapa: opcion('Etapa de vida', { Cachorro: 'cachorro', Adulto: 'adulto', Mayor: 'mayor' } as const),
      actividad: opcion('Actividad que necesita', { Baja: 'bajo', Media: 'medio', Alta: 'alto' } as const),
      vivienda: opcion('Vivienda mínima', { 'Piso con terraza': 'piso_exterior', 'Casa con jardín': 'casa_jardin', Piso: 'piso' } as const),
      horasSolaMax: horas,
      tiempoDiario: opcion('Tiempo diario que necesita', { Poco: 'bajo', Medio: 'medio', Mucho: 'alto' } as const),
      convivenciaNinos: opcion('Convive con niños pequeños', { Sí: 'si', 'No se sabe': 'desconocido', No: 'no' } as const),
      convivenciaMascotas: opcion('Convive con otras mascotas', { Sí: 'si', 'No se sabe': 'desconocido', No: 'no', Prefiere: 'prefiere_compania_especie' } as const),
      costeMensual: opcion('Coste mensual', { Bajo: 'bajo', Medio: 'medio', Alto: 'alto' } as const),
      necesidadesEspeciales: opcion('Nivel de necesidades especiales', { Ninguna: 'ninguna', Leves: 'leves', Medias: 'medias', Altas: 'altas' } as const),
      experiencia: opcion('Experiencia necesaria', { Ninguna: 'ninguna', Básica: 'basica', 'Con experiencia': 'responsable' } as const),
    } satisfies PetAttributes,
  };
  if (pet.necesidadesEspeciales !== (pet.atributos.necesidadesEspeciales !== 'ninguna')) {
    errores.push('«Necesidades especiales» y «Nivel de necesidades especiales» no coinciden (una dice que sí y la otra que no).');
  }

  if (errores.length) {
    console.error(`La ficha tiene ${errores.length} ${errores.length === 1 ? 'problema' : 'problemas'}:\n  - ${errores.join('\n  - ')}`);
    process.exit(1);
  }

  // % de la cuenta demo (persona@ejemplo.com): es el que muestra el diseño en la ficha y la tarjeta.
  const demo = computeCompatibility(pet.atributos, DEMO_ANSWERS);
  const q = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  const meta = [pet.especie, pet.sexo, pet.edad, pet.ciudad, pet.tamano].join(' · ');
  const diseno = {
    'Ficha.dc.html · D': `      ${slug}: { name: ${q(nombre)}, meta: ${q(meta)}, ne: ${pet.necesidadesEspeciales}, pct: ${demo.porcentaje}, b: [${demo.bloques.hogar}, ${demo.bloques.diaADia}, ${demo.bloques.mascota}],\n        info: [${Object.values(pet.info).map(q).join(', ')}],\n        encaja: ${q(pet.encaja)}, cuenta: ${q(pet.cuenta)} }`,
    'FOTO (Ficha, Catalogo, Main)': `      ${slug}: ['<URL de la foto en Alta fidelidad>', ${q(alt)}]`,
    'Catalogo.dc.html · animals': `      { id: ${q(nombre)}, tipo: '${pet.tipo}', ne: ${pet.necesidadesEspeciales}, sexo: ${q(pet.sexo)}, edad: ${q(pet.edad)}, city: ${q(pet.ciudad)}, size: ${q(pet.tamano)}, prov: ${q(provincia)}, pct: ${demo.porcentaje}, reason: ${q(motivo)} }`,
    'Main.dc.html · lista': `{ name: ${q(nombre)}, pct: ${demo.porcentaje} }`,
  };

  console.log(`✔ Ficha correcta: ${nombre} (${slug}) · foto mascotas/fotos/${basename(fotoPath)}`);
  console.log(`  Cuenta demo: ${demo.porcentaje} % (hogar ${demo.bloques.hogar} · día a día ${demo.bloques.diaADia} · mascota ${demo.bloques.mascota})${demo.compatible ? '' : ' · NO compatible (< 50 %)'}`);
  console.log('\n== Fragmentos para el diseño ==');
  for (const [k, v] of Object.entries(diseno)) console.log(`-- ${k}\n${v}`);
  console.log('\n== Entrada de pets.data.ts ==\n' + JSON.stringify(pet, null, 2));

  if (escribir) {
    const dataPath = join(__dirname, '../src/seed/pets.data.ts');
    const src = readFileSync(dataPath, 'utf8');
    const fin = src.lastIndexOf('];');
    const entrada = JSON.stringify(pet, null, 2).split('\n').map((l) => '  ' + l).join('\n');
    writeFileSync(dataPath, src.slice(0, fin).replace(/\}\s*$/, '},\n') + entrada + '\n' + src.slice(fin));
    console.log(`\n✔ Añadida a ${dataPath}`);
  }
}

main();
