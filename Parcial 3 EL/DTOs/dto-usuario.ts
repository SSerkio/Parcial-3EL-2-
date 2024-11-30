import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CrearUsuarioDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre: string;

  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail({}, { message: 'Formato de correo inválido' })
  correo: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena: string;
}

export class ActualizarUsuarioDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre?: string;

  @IsEmail({}, { message: 'Formato de correo inválido' })
  correo?: string;
}
