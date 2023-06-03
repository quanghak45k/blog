import { CreatedTimeColumn } from "src/common/decorators/created-time.decorator";
import { UpdatedTimeColumn } from "src/common/decorators/updated-time.decorator";
import { MAX_LENGTH_USER_ID } from "src/constants/const";
import { generateUserIdWithPrefix } from "src/utils/string.util";
import { BeforeInsert, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('increment')
    readonly id!: number;

    @Index('idx_users_id', { unique: true })
    @Column({ type: 'varchar', name: 'users_id' })
    userId!: string;

    @Index('idx_email', { unique: true })
    @Column({ type: 'varchar' })
    email!: string;

    @Index('idx_username', { unique: true })
    @Column({ type: 'varchar', name: 'username' })
    username!: string;

    @Column({ type: 'varchar', name: 'full_name', nullable: true })
    fullName!: string;

    @Column({ type: 'varchar', nullable: true })
    password!: string;

    @CreatedTimeColumn()
    readonly createdTime!: Date;

    @UpdatedTimeColumn()
    readonly updatedTime!: Date;

    @BeforeInsert()
    generateId() {
        if (!this.userId) {
            this.userId = generateUserIdWithPrefix(MAX_LENGTH_USER_ID);
        }
    }

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}