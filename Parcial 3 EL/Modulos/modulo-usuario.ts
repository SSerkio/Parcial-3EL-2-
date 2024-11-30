import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entidad';
import { UsuarioService } from './usuario.servicio';
import { UsuarioController } from './usuario.controlador';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [UsuarioService],
  controllers: [UsuarioController],
  exports: [UsuarioService]
})
export class UsuarioModule {}

// Servicio
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entidad';
import { CrearUsuarioDto, ActualizarUsuarioDto } from './usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepositorio: Repository<Usuario>
  ) {}

  async crearUsuario(dto: CrearUsuarioDto): Promise<Usuario> {
    const nuevoUsuario = this.usuarioRepositorio.create(dto);
    return await this.usuarioRepositorio.save(nuevoUsuario);
  }

  async obtenerUsuarioPorId(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepositorio.findOne({ 
      where: { id },
      relations: ['eventos', 'comentarios']
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async actualizarUsuario(id: number, dto: ActualizarUsuarioDto): Promise<Usuario> {
    const usuario = await this.obtenerUsuarioPorId(id);
    Object.assign(usuario, dto);
    return await this.usuarioRepositorio.save(usuario);
  }
}

// Controlador
import { Controller, Post, Get, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UsuarioService } from './usuario.servicio';
import { CrearUsuarioDto, ActualizarUsuarioDto } from './usuario.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @Post()
  async crearUsuario(@Body() dto: CrearUsuarioDto) {
    return await this.usuarioService.crearUsuario(dto);
  }

  @Get('/:id')
  async obtenerUsuario(@Param('id', ParseIntPipe) id: number) {
    return await this.usuarioService.obtenerUsuarioPorId(id);
  }

  @Get('/:id/eventos')
  async obtenerEventosDeUsuario(@Param('id', ParseIntPipe) id: number) {
    const usuario = await this.usuarioService.obtenerUsuarioPorId(id);
    return usuario.eventos;
  }

  @Patch('/:id')
  async actualizarUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarUsuarioDto
  ) {
    return await this.usuarioService.actualizarUsuario(id, dto);
  }
}
