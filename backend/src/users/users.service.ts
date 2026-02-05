import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm'; // necesario para inyectar
import { Repository } from 'typeorm'; 
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    
    const userToSave = { ...createUserDto, password: passwordHash };

    const newUser = this.usersRepository.create(userToSave);
    return await this.usersRepository.save(newUser);
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    return await this.usersRepository.findOneBy({id}); // busca solo uno y por el parametro que quieras
  }

  async findOneByDNI(dni: number) {
    return await this.usersRepository.findOneBy({dni});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, updateUserDto)
  }

  async remove(id: number) {
    return await this.usersRepository.delete({id});
  }
}
