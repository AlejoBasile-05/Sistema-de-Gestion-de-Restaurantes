import { Test, TestingModule } from '@nestjs/testing';
import { IngredientsService } from './ingredients.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';

describe('IngredientsService', () => {
  let service: IngredientsService;

  // Mock básico del repositorio (para que no intente conectarse a la base de datos real)
  const mockIngredientRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientsService,
        {
            provide: getRepositoryToken(Ingredient),
            useValue: mockIngredientRepository,
        },
      ],
    }).compile();

    service = module.get<IngredientsService>(IngredientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /*
  it('debería retornar un ingrediente si existe', () => {
      // Tu lógica...
  });
  */
});