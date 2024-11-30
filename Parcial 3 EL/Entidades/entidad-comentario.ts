import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entidad';
import { Evento } from '../eventos/evento.entidad';

@Entity('comentarios')
export class Comentario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  contenido: string;

  @ManyToOne(() => Usuario, usuario => usuario.comentarios)
  usuario: Usuario;

  @ManyToOne(() => Evento, evento => evento.comentarios)
  evento: Evento;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  fechaActualizacion: Date;
}
