import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../../infrastructure/dto/create-category.dto';
import { UpdateCategoryDto } from '../../infrastructure/dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../domain/entity/category.entity';
import { IsNull, Repository, TypeORMError } from 'typeorm';
import { CATEGORIES_RESPONSES } from '../../common/categories.responses';
import { CategoryPresenter } from '@modules/categories/infrastructure/presenters/category.presenter';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryPresenter> {
    const categoryExist = await this.checkIfExists({
      name: createCategoryDto.name,
    });

    if (categoryExist)
      throw new TypeORMError(CATEGORIES_RESPONSES.ALREADY_EXISTS);

    const newCategory = this.categoriesRepository.create(createCategoryDto);

    return this.categoriesRepository.save(newCategory);
  }

  findAll(): Promise<CategoryPresenter[]> {
    return this.categoriesRepository.find();
  }

  async findOne(id: string): Promise<CategoryPresenter> {
    const category = await this.categoriesRepository.findOne({
      where: { id: id },
    });

    if (!category) throw new TypeORMError(CATEGORIES_RESPONSES.NOT_FOUND_ONE);

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const category = await this.categoriesRepository.findOne({
      where: { id: id },
    });

    if (!category) throw new TypeORMError(CATEGORIES_RESPONSES.NOT_FOUND_ONE);

    await this.categoriesRepository.update(category.id, updateCategoryDto);
  }

  async remove(id: string): Promise<void> {
    const categoryExist: boolean = await this.checkIfExists({
      id: id,
    });

    if (!categoryExist)
      throw new TypeORMError(CATEGORIES_RESPONSES.NOT_FOUND_ONE);

    await this.categoriesRepository.delete(id);
  }

  async checkIfExists(props: Partial<Category>): Promise<boolean> {
    return await this.categoriesRepository.exist({ where: props });
  }
}
