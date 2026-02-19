import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Checkout } from './entities/checkout.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class CheckoutsService {
  constructor (
    @InjectRepository(Checkout) private readonly checkoutRepository: Repository<Checkout>
  ) {}
  create(createCheckoutDto: CreateCheckoutDto) {
    const checkout =  this.checkoutRepository.create(createCheckoutDto)
    return this.checkoutRepository.save(checkout)
  }

  findAll() {
    return this.checkoutRepository.find()
  }

  findOne(id: number) {
    return this.checkoutRepository.findOneBy({id})
  }

  update(id: number, updateCheckoutDto: UpdateCheckoutDto) {
    return this.checkoutRepository.update(id, updateCheckoutDto)
  }

  remove(id: number) {
    return this.checkoutRepository.delete({id})
  }
}
