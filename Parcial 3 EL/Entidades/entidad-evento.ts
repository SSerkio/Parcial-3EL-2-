import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entidad';
import { Categoria } from '../categorias/categoria.entidad';
import { Comentario } from '../comentarios/comentario.entidad';

@Entity('eventos')
export class Evento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column('text')
  descripcion: string;

  @Column('datetime')
  fechaInicio: Date;

  @Column('datetime')
  fechaFin: Date;

  @Column()
  ubicacion: string;

  @ManyToMany(() => Usuario, usuario => usuario.eventos)
  @JoinTable({ name: 'asistencia_evento' })
  asistentes: Usuario[];

  @ManyToMany(() => Categoria, categoria => categoria.eventos)
  @JoinTable({ name: 'categoria_evento' })
  categorias: Categoria[];

  @OneToMany(() => Comentario, comentario => comentario.evento)
  comentarios: Comentario[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  fechaActualizacion: Date;
}
