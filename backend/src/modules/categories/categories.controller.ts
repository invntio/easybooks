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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  DeleteCategoryParams,
  FindOneCategoryParams,
  UpdateCategoryParams,
} from './utils/category-controller.params';
import {
  CATEGORY_CREATED,
  CATEGORY_DELETED,
  CATEGORY_FOUND_MANY,
  CATEGORY_FOUND_ONE,
  CATEGORY_UPDATED,
} from './utils/category-response.constants';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
    type: CategoryDto,
  })
  @ApiResponse({
    status: 400,
    description: 'The request was wrongly made.',
  })
  @ApiBody({ type: CreateCategoryDto })
  @ResponseMessage(CATEGORY_CREATED)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Get a list of all categories' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all categories.',
    type: CategoryDto,
  })
  @ResponseMessage(CATEGORY_FOUND_MANY)
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({
    summary: 'Get a list of categories with their subcategories',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of categories with their subcategories.',
    type: CategoryDto,
  })
  @ResponseMessage(CATEGORY_FOUND_MANY)
  @Get('subcategories')
  findAllWithSubcategories() {
    return this.categoriesService.findAllWithSubcategories();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a category by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the category with the specified ID.',
    type: CategoryDto,
  })
  @ApiResponse({
    status: 400,
    description: 'The category ID was invalid.',
  })
  @ApiResponse({
    status: 404,
    description: 'The category with the specified ID was not found.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The ID of the category',
  })
  @ResponseMessage(CATEGORY_FOUND_ONE)
  findOne(@Param() params: UpdateCategoryParams) {
    return this.categoriesService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Get a category by ID with its subcategories' })
  @ApiResponse({
    status: 200,
    description:
      'Returns the category with the specified ID with its subcategories.',
    type: CategoryDto,
  })
  @ApiResponse({
    status: 400,
    description: 'The category ID was invalid.',
  })
  @ApiResponse({
    status: 404,
    description: 'The category with the specified ID was not found.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The ID of the category',
  })
  @ResponseMessage(CATEGORY_FOUND_ONE)
  @Get('subcategories/:id')
  findOneWithSubcategories(@Param() params: FindOneCategoryParams) {
    return this.categoriesService.findOneWithSubcategories(params.id);
  }

  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully updated.',
    type: CategoryDto,
  })
  @ApiResponse({
    status: 400,
    description: 'The request was wrongly made.',
  })
  @ApiResponse({
    status: 404,
    description: 'The category with the specified ID was not found.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The ID of the category',
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ResponseMessage(CATEGORY_UPDATED)
  @Patch(':id')
  update(
    @Param() params: UpdateCategoryParams,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(params.id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully deleted.',
  })
  @ApiResponse({
    status: 400,
    description: 'The category ID was invalid.',
  })
  @ApiResponse({
    status: 404,
    description: 'The category with the specified ID was not found.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The ID of the category',
  })
  @ResponseMessage(CATEGORY_DELETED)
  @Delete(':id')
  remove(@Param() params: DeleteCategoryParams) {
    return this.categoriesService.remove(params.id);
  }
}
