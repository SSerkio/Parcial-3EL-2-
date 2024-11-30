import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './categoria.entidad';
import { CategoriaService } from './categoria.servicio';
import { CategoriaController } from './categoria.controlador';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  providers: [CategoriaService],
  controllers: [CategoriaController],
  exports: [CategoriaService]
})
export class CategoriaModule {}

// Servicio
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './categoria.entidad';
import { CrearCategoriaDto, ActualizarCategoriaDto } from './categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepositorio: Repository<Categoria>
  ) {}

  async crearCategoria(dto: CrearCategoriaDto): Promise<Categoria> {
    // Verificar si ya existe una categoría con el mismo nombre
    const categoriaExistente = await this.categoriaRepositorio.findOne({ 
      where: { nombre: dto.nombre } 
    });
    
    if (categoriaExistente) {
      throw new ConflictException('Ya existe una categoría con este nombre');
    }

    const nuevaCategoria = this.categoriaRepositorio.create(dto);
    return await this.categoriaRepositorio.save(nuevaCategoria);
  }

  async obtenerCategorias(): Promise<Categoria[]> {
    return await this.categoriaRepositorio.find({
      relations: ['eventos']
    });
  }

  async obtenerCategoriaPorId(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepositorio.findOne({ 
      where: { id },
      relations: ['eventos']
    });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');
    return categoria;
  }

  async actualizarCategoria(id: number, dto: ActualizarCategoriaDto): Promise<Categoria> {
    const categoria = await this.obtenerCategoriaPorId(id);

    // Si se intenta cambiar el nombre, verificar que no exista ya
    if (dto.nombre) {
      const categoriaExistente = await this.categoriaRepositorio.findOne({ 
        where: { nombre: dto.nombre } 
      });
      
      if (categoriaExistente && categoriaExistente.id !== id) {
        throw new ConflictException('Ya existe una categoría con este nombre');
      }
    }

    Object.assign(categoria, dto);
    return await this.categoriaRepositorio.save(categoria);
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
import { CategoriaService } from './categoria.servicio';
import { CrearCategoriaDto, ActualizarCategoriaDto } from './categoria.dto';

@Controller('categorias')
export class CategoriaController {
  constructor(private categoriaService: CategoriaService) {}

  @Post()
  async crearCategoria(@Body() dto: CrearCategoriaDto) {
    return await this.categoriaService.crearCategoria(dto);
  }

  @Get()
  async obtenerCategorias() {
    return await this.categoriaService.obtenerCategorias();
  }

  @Patch('/:id')
  async actualizarCategoria(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarCategoriaDto
  ) {
    return await this.categoriaService.actualizarCategoria(id, dto);
  }
}
