import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comentario } from './comentario.entidad';
import { Usuario } from '../usuarios/usuario.entidad';
import { Evento } from '../eventos/evento.entidad';
import { ComentarioService } from './comentario.servicio';
import { ComentarioController } from './comentario.controlador';

@Module({
  imports: [TypeOrmModule.forFeature([Comentario, Usuario, Evento])],
  providers: [ComentarioService],
  controllers: [ComentarioController],
  exports: [ComentarioService]
})
export class ComentarioModule {}

// Servicio
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from './comentario.entidad';
import { Usuario } from '../usuarios/usuario.entidad';
import { Evento } from '../eventos/evento.entidad';
import { CrearComentarioDto, ActualizarComentarioDto } from './comentario.dto';

@Injectable()
export class ComentarioService {
  constructor(
    @InjectRepository(Comentario)
    private comentarioRepositorio: Repository<Comentario>,
    @InjectRepository(Usuario)
    private usuarioRepositorio: Repository<Usuario>,
    @InjectRepository(Evento)
    private eventoRepositorio: Repository<Evento>
  ) {}

  async crearComentario(usuarioId: number, eventoId: number, dto: CrearComentarioDto): Promise<Comentario> {
    // Verificar si el usuario existe
    const usuario = await this.usuarioRepositorio.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    // Verificar si el evento existe
    const evento = await this.eventoRepositorio.findOne({ where: { id: eventoId } });
    if (!evento) throw new NotFoundException('Evento no encontrado');

    const nuevoComentario = this.comentarioRepositorio.create({
      contenido: dto.contenido,
      usuario,
      evento
    });

    return await this.comentarioRepositorio.save(nuevoComentario);
  }

  async obtenerComentarioPorId(id: number): Promise<Comentario> {
    const comentario = await this.comentarioRepositorio.findOne({ 
      where: { id },
      relations: ['usuario', 'evento']
    });
    if (!comentario) throw new NotFoundException('Comentario no encontrado');
    return comentario;
  }

  async actualizarComentario(id: number, dto: ActualizarComentarioDto): Promise<Comentario> {
    const comentario = await this.obtenerComentarioPorId(id);
    
    Object.assign(comentario, dto);
    return await this.comentarioRepositorio.save(comentario);
  }

  async eliminarComentario(id: number): Promise<void> {
    const comentario = await this.obtenerComentarioPorId(id);
    await this.comentarioRepositorio.remove(comentario);
  }
}

// Controlador
import { 
  Controller, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  ParseIntPipe 
} from '@nestjs/common';
import { ComentarioService } from './comentario.servicio';
import { CrearComentarioDto, ActualizarComentarioDto } from './comentario.dto';

@Controller('comentarios')
export class ComentarioController {
  constructor(private comentarioService: ComentarioService) {}

  @Post('/:usuarioId/:eventoId')
  async crearComentario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('eventoId', ParseIntPipe) eventoId: number,
    @Body() dto: CrearComentarioDto
  ) {
    return await this.comentarioService.crearComentario(usuarioId, eventoId, dto);
  }

  @Patch('/:id')
  async actualizarComentario(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarComentarioDto
  ) {
    return await this.comentarioService.actualizarComentario(id, dto);
  }

  @Delete('/:id')
  async eliminarComentario(@Param('id', ParseIntPipe) id: number) {
    await this.comentarioService.eliminarComentario(id);
    return { mensaje: 'Comentario eliminado exitosamente' };
  }
}
