import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Evento } from '../eventos/evento.entidad';
import { Comentario } from '../comentarios/comentario.entidad';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  correo: string;

  @Column()
  contrasena: string;

  @ManyToMany(() => Evento, evento => evento.asistentes)
  eventos: Evento[];

  @OneToMany(() => Comentario, comentario => comentario.usuario)
  comentarios: Comentario[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  fechaActualizacion: Date;
}
