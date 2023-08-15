import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { LoginGuard } from 'src/login.guard';
import { PermissionGuard } from 'src/user/permission.guard';
import { BbbService } from './bbb.service';
import { CreateBbbDto } from './dto/create-bbb.dto';
import { UpdateBbbDto } from './dto/update-bbb.dto';

@Controller('bbb')
export class BbbController {
  constructor(private readonly bbbService: BbbService) {}

  @Post()
  @UseGuards(LoginGuard, PermissionGuard)
  create(@Body() createBbbDto: CreateBbbDto) {
    return this.bbbService.create(createBbbDto);
  }

  @Get()
  @UseGuards(LoginGuard, PermissionGuard)
  @SetMetadata('permission', 'query_bbb')
  findAll() {
    return this.bbbService.findAll();
  }

  @Get(':id')
  @SetMetadata('permission', 'query_bbb')
  @UseGuards(LoginGuard, PermissionGuard)
  findOne(@Param('id') id: string) {
    return this.bbbService.findOne(+id);
  }

  @Patch(':id')
  @SetMetadata('permission', 'update_bbb')
  @UseGuards(LoginGuard, PermissionGuard)
  update(@Param('id') id: string, @Body() updateBbbDto: UpdateBbbDto) {
    return this.bbbService.update(+id, updateBbbDto);
  }

  @Delete(':id')
  @SetMetadata('permission', 'remove_bbb')
  @UseGuards(LoginGuard, PermissionGuard)
  remove(@Param('id') id: string) {
    return this.bbbService.remove(+id);
  }
}
