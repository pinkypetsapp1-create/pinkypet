import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Errors } from '../common/errors';
import type { Answers } from '../compatibility/questions';
import { computeCompatibility } from '../compatibility/rules';
import { PetDetailView, PetFiltersDto, PetSummaryView } from './pets.dto';
import { Pet, PetDocument } from './pet.schema';

@Injectable()
export class PetsService {
  constructor(@InjectModel(Pet.name) private readonly pets: Model<PetDocument>) {}

  /** Mascotas disponibles con filtros. Con respuestas, añade el % y ordena de mayor a menor. */
  async list(filters: PetFiltersDto, answers: Answers | null): Promise<PetSummaryView[]> {
    const q: FilterQuery<PetDocument> = { disponible: true };
    if (filters.tipo?.length) q.tipo = { $in: filters.tipo };
    if (filters.ne === true) q.necesidadesEspeciales = true;
    if (filters.provincia) q.provincia = filters.provincia;
    const docs = await this.pets.find(q).sort({ orden: 1 });
    const items = docs.map((d) => PetsService.summary(d, answers));
    return answers ? items.sort((a, b) => b.compatibilidad!.porcentaje - a.compatibilidad!.porcentaje) : items;
  }

  async detail(slug: string, answers: Answers | null): Promise<PetDetailView> {
    const d = await this.pets.findOne({ slug });
    if (!d) throw Errors.petNotFound();
    return {
      ...PetsService.summary(d, answers),
      info: d.info as unknown as PetDetailView['info'],
      encaja: d.encaja,
      cuenta: d.cuenta,
      disponible: d.disponible,
    };
  }

  findBySlug(slug: string): Promise<PetDocument | null> {
    return this.pets.findOne({ slug });
  }

  async setAvailable(slug: string, disponible: boolean): Promise<void> {
    await this.pets.updateOne({ slug }, { disponible });
  }

  static summary(d: PetDocument, answers: Answers | null): PetSummaryView {
    const view: PetSummaryView = {
      id: d.slug, nombre: d.nombre, especie: d.especie, sexo: d.sexo, edad: d.edad, ciudad: d.ciudad,
      provincia: d.provincia, tamano: d.tamano, tipo: d.tipo, necesidadesEspeciales: d.necesidadesEspeciales,
      motivoCorto: d.motivoCorto, foto: { asset: d.foto.asset, alt: d.foto.alt },
    };
    if (answers) {
      const r = computeCompatibility(d.atributos, answers);
      view.compatibilidad = { porcentaje: r.porcentaje, bloques: r.bloques, compatible: r.compatible };
    }
    return view;
  }
}
