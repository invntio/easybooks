import { ResponseMessage } from '@common/decorators/response.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from '../../application/services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import {
  DeleteCategoryParams,
  FilterCategoryByCriteriaParams,
  FindOneCategoryParams,
  SearchByKeywordParams,
  UpdateCategoryParams,
} from '../params/categories.params';
import { CATEGORIES_RESPONSES } from '../../common/categories.responses';
import { CategoryPresenter } from '../presenters/category.presenter';
import { CategorySearchUseCase } from '@modules/categories/application/usecases/categories-search.usecase';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly categoriesSearchUseCase: CategorySearchUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a new category' })
  @ApiCreatedResponse({
    description: 'The category has been successfully created.',
    type: CategoryPresenter,
  })
  @ApiBadRequestResponse({
    description: 'The request was wrongly made.',
  })
  @ApiBody({ type: CreateCategoryDto })
  @ResponseMessage(CATEGORIES_RESPONSES.CREATED)
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryPresenter> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Get a list of categories by keyword',
  })
  @ApiOkResponse({
    description:
      'Returns a list of categories that contains the keyword provided ',
    type: CategoryPresenter,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'The keyword provided was invalid',
  })
  @ApiNotFoundResponse({
    description: 'No categories were found containing the keyword provided',
  })
  @ApiQuery({
    name: 'keyword',
    type: 'string',
    required: false,
    description: 'The keyword to search in the categories',
  })
  @ResponseMessage(CATEGORIES_RESPONSES.FOUND_MANY)
  search(@Query() params: SearchByKeywordParams): Promise<CategoryPresenter[]> {
    return this.categoriesSearchUseCase.searchCategoriesByKeyword(
      params.keyword,
    );
  }

  @Get('filter')
  @ApiOperation({
    summary: 'Get a list of categories by criteria',
  })
  @ApiOkResponse({
    description:
      'Returns a list of categories that meets the criteria provided ',
    type: CategoryPresenter,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'The criteria provided was invalid',
  })
  @ApiNotFoundResponse({
    description: 'No categories were found with the criteria provided',
  })
  @ApiQuery({
    name: 'name',
    type: 'string',
    required: false,
    description: 'The name of the category',
  })
  @ApiQuery({
    name: 'isActive',
    type: 'boolean',
    required: false,
    description: 'The active status of the category',
  })
  @ResponseMessage(CATEGORIES_RESPONSES.FOUND_MANY)
  filter(@Query() criteria: FilterCategoryByCriteriaParams): Promise<any[]> {
    return this.categoriesSearchUseCase.filterCategoriesByCriteria({
      name: criteria.name,
      isActive: criteria.isActive,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a category by ID',
  })
  @ApiOkResponse({
    description: 'Returns the category with the specified ID.',
    type: CategoryPresenter,
  })
  @ApiBadRequestResponse({
    description: 'The category ID was invalid.',
  })
  @ApiNotFoundResponse({
    description: 'The category with the specified ID was not found.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The ID of the category',
  })
  @ResponseMessage(CATEGORIES_RESPONSES.FOUND_ONE)
  findOne(@Param() params: FindOneCategoryParams): Promise<CategoryPresenter> {
    return this.categoriesService.findOne(params.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all categories' })
  @ApiOkResponse({
    description: 'Returns a list of all categories.',
    type: CategoryPresenter,
    isArray: true,
  })
  @ResponseMessage(CATEGORIES_RESPONSES.FOUND_MANY)
  findAll(): Promise<CategoryPresenter[]> {
    return this.categoriesService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiNoContentResponse({
    description: 'The category has been successfully updated.',
  })
  @ApiBadRequestResponse({
    description: 'The request was wrongly made.',
  })
  @ApiNotFoundResponse({
    description: 'The category with the specified ID was not found.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The ID of the category',
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ResponseMessage(CATEGORIES_RESPONSES.UPDATED)
  update(
    @Param() params: UpdateCategoryParams,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    return this.categoriesService.update(params.id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiNoContentResponse({
    description: 'The category has been successfully deleted.',
  })
  @ApiBadRequestResponse({
    description: 'The category ID was invalid.',
  })
  @ApiNotFoundResponse({
    description: 'The category with the specified ID was not found.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The ID of the category',
  })
  @ResponseMessage(CATEGORIES_RESPONSES.DELETED)
  remove(@Param() params: DeleteCategoryParams): Promise<void> {
    return this.categoriesService.remove(params.id);
  }
}
