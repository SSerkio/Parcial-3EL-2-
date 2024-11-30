import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Evento } from '../eventos/evento.entidad';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @ManyToMany(() => Evento, evento => evento.categorias)
  eventos: Evento[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  fechaActualizacion: Date;
}
