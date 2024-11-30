import { IsString, IsNotEmpty, IsDate, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearEventoDto {
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @IsString({ message: 'El título debe ser un texto' })
  titulo: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser un texto' })
  descripcion: string;

  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
  @IsDate({ message: 'Formato de fecha de inicio inválido' })
  @Type(() => Date)
  fechaInicio: Date;

  @IsNotEmpty({ message: 'La fecha de fin es obligatoria' })
  @IsDate({ message: 'Formato de fecha de fin inválido' })
  @Type(() => Date)
  fechaFin: Date;

  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  @IsString({ message: 'La ubicación debe ser un texto' })
  ubicacion: string;

  @IsOptional()
  @IsArray({ message: 'Las categorías deben ser un arreglo' })
  categoriasIds?: number[];
}

export class ActualizarEventoDto {
  @IsOptional()
  @IsString({ message: 'El título debe ser un texto' })
  titulo?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  descripcion?: string;

  @IsOptional()
  @IsDate({ message: 'Formato de fecha de inicio inválido' })
  @Type(() => Date)
  fechaInicio?: Date;

  @IsOptional()
  @IsDate({ message: 'Formato de fecha de fin inválido' })
  @Type(() => Date)
  fechaFin?: Date;

  @IsOptional()
  @IsString({ message: 'La ubicación debe ser un texto' })
  ubicacion?: string;

  @IsOptional()
  @IsArray({ message: 'Las categorías deben ser un arreglo' })
  categoriasIds?: number[];
}
