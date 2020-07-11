import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Question } from '~/polling/question.entity';
import { Vote } from '~/polling/vote.entity';

@Entity({ schema: 'public', name: 'options' })
export class Option {
    @PrimaryGeneratedColumn({ name: 'option_id' })
    public optionId!: number;

    @Column({ name: 'label' })
    public label!: string;

    @Column({ name: 'sublabel' })
    public sublabel!: string | null;

    @ManyToOne(
        type => Question,
        question => question.options,
    )
    @JoinColumn({ name: 'question_id' })
    public question!: Question;

    @OneToMany(
        type => Vote,
        vote => vote.option,
    )
    public votes!: Vote[];
}
