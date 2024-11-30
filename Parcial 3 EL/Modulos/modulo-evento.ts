import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from './evento.entidad';
import { Categoria } from '../categorias/categoria.entidad';
import { EventoService } from './evento.servicio';
import { EventoController } from './evento.controlador';

@Module({
  imports: [TypeOrmModule.forFeature([Evento, Categoria])],
  providers: [EventoService],
  controllers: [EventoController],
  exports: [EventoService]
})
export class EventoModule {}

// Servicio
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from './evento.entidad';
import { Categoria } from '../categorias/categoria.entidad';
import { CrearEventoDto, ActualizarEventoDto } from './evento.dto';

@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(Evento)
    private eventoRepositorio: Repository<Evento>,
    @InjectRepository(Categoria)
    private categoriaRepositorio: Repository<Categoria>
  ) {}

  async crearEvento(dto: CrearEventoDto): Promise<Evento> {
    const categorias = dto.categoriasIds 
      ? await this.categoriaRepositorio.findByIds(dto.categoriasIds)
      : [];

    const nuevoEvento = this.eventoRepositorio.create({
      ...dto,
      categorias
    });

    return await this.eventoRepositorio.save(nuevoEvento);
  }

  async obtenerEventoPorId(id: number): Promise<Evento> {
    const evento = await this.eventoRepositorio.findOne({ 
      where: { id },
      relations: ['categorias', 'comentarios']
    });
    if (!evento) throw new NotFoundException('Evento no encontrado');
    return evento;
  }

  async obtenerDetallesEvento(id: number) {
    const evento = await this.eventoRepositorio.findOne({ 
      where: { id },
      relations: ['asistentes', 'categorias']
    });
    if (!evento) throw new NotFoundException('Evento no encontrado');
    return evento;
  }

  async obtenerComentariosEvento(id: number) {
    const evento = await this.eventoRepositorio.findOne({ 
      where: { id },
      relations: ['comentarios', 'comentarios.usuario']
    });
    if (!evento) throw new NotFoundException('Evento no encontrado');
    return evento.comentarios;
  }

  async actualizarEvento(id: number, dto: ActualizarEventoDto): Promise<Evento> {
    const evento = await this.obtenerEventoPorId(id);
    
    if (dto.categoriasIds) {
      const categorias = await this.categoriaRepositorio.findByIds(dto.categoriasIds);
      evento.categorias = categorias;
    }

    Object.assign(evento, dto);
    return await this.eventoRepositorio.save(evento);
  }
}

// Controlador
import { 
  Controller, 
  Post, 
  Get, 
  Patch, 
  Body, 
  Param, 
  ParseIntPipe 
} from '@nestjs/common';
import { EventoService } from './evento.servicio';
import { CrearEventoDto, ActualizarEventoDto } from './evento.dto';

@Controller('eventos')
export class EventoController {
  constructor(private eventoService: EventoService) {}

  @Post()
  async crearEvento(@Body() dto: CrearEventoDto) {
    return await this.eventoService.crearEvento(dto);
  }

  @Get('/:id')
  async obtenerEvento(@Param('id', ParseIntPipe) id: number) {
    return await this.eventoService.obtenerEventoPorId(id);
  }

  @Get('/:id/details')
  async obtenerDetallesEvento(@Param('id', ParseIntPipe) id: number) {
    return await this.eventoService.obtenerDetallesEvento(id);
  }

  @Get('/:id/comment')
  async obtenerComentariosEvento(@Param('id', ParseIntPipe) id: number) {
    return await this.eventoService.obtenerComentariosEvento(id);
  }

  @Patch('/:id')
  async actualizarEvento(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarEventoDto
  ) {
    return await this.eventoService.actualizarEvento(id, dto);
  }
}
