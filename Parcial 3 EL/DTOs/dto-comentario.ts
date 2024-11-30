import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CrearComentarioDto {
  @IsNotEmpty({ message: 'El contenido del comentario es obligatorio' })
  @IsString({ message: 'El contenido debe ser un texto' })
  contenido: string;

  @IsNotEmpty({ message: 'El ID de usuario es obligatorio' })
  @IsNumber({}, { message: 'El ID de usuario debe ser un número' })
  usuarioId: number;

  @IsNotEmpty({ message: 'El ID de evento es obligatorio' })
  @IsNumber({}, { message: 'El ID de evento debe ser un número' })
  eventoId: number;
}

export class ActualizarComentarioDto {
  @IsNotEmpty({ message: 'El contenido del comentario es obligatorio' })
  @IsString({ message: 'El contenido debe ser un texto' })
  contenido: string;
}
