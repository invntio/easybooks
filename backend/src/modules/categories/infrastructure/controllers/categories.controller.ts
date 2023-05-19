import { ResponseMessage } from '@common/decorators/response.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from '../../application/services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import {
  DeleteCategoryParams,
  FindOneCategoryParams,
  UpdateCategoryParams,
} from '../params/categories.params';
import { CATEGORY_RESPONSES } from '../../common/categories.responses';
import { CategoryPresenter } from '../presenters/category.presenter';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @ApiCreatedResponse({
    description: 'The category has been successfully created.',
    type: CategoryPresenter,
  })
  @ApiBadRequestResponse({
    description: 'The request was wrongly made.',
  })
  @ApiBody({ type: CreateCategoryDto })
  @ResponseMessage(CATEGORY_RESPONSES.CREATED)
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryPresenter> {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Get a list of all categories' })
  @ApiOkResponse({
    description: 'Returns a list of all categories.',
    type: CategoryPresenter,
    isArray: true,
  })
  @ResponseMessage(CATEGORY_RESPONSES.FOUND_MANY)
  @Get()
  findAll(): Promise<CategoryPresenter[]> {
    return this.categoriesService.findAll();
  }

  @ApiOperation({
    summary: 'Get a list of categories with their subcategories',
  })
  @ApiOkResponse({
    description: 'Returns a list of categories with their subcategories.',
    type: CategoryPresenter,
    isArray: true,
  })
  @ResponseMessage(CATEGORY_RESPONSES.FOUND_MANY)
  @Get('subcategories')
  findAllWithSubcategories(): Promise<CategoryPresenter[]> {
    return this.categoriesService.findAllWithSubcategories();
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
  @ResponseMessage(CATEGORY_RESPONSES.FOUND_ONE)
  findOne(@Param() params: UpdateCategoryParams): Promise<CategoryPresenter> {
    return this.categoriesService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Get a category by ID with its subcategories' })
  @ApiOkResponse({
    description:
      'Returns the category with the specified ID with its subcategories.',
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
  @ResponseMessage(CATEGORY_RESPONSES.FOUND_ONE)
  @Get('subcategories/:id')
  findOneWithSubcategories(
    @Param() params: FindOneCategoryParams,
  ): Promise<CategoryPresenter> {
    return this.categoriesService.findOneWithSubcategories(params.id);
  }

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
  @ResponseMessage(CATEGORY_RESPONSES.UPDATED)
  @Patch(':id')
  update(
    @Param() params: UpdateCategoryParams,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    return this.categoriesService.update(params.id, updateCategoryDto);
  }

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
  @ResponseMessage(CATEGORY_RESPONSES.DELETED)
  @Delete(':id')
  remove(@Param() params: DeleteCategoryParams): Promise<void> {
    return this.categoriesService.remove(params.id);
  }
}
