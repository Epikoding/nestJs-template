import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { Result } from '../../../base.result';
import { GetUserDto } from '../dto/get-user.dto';
import { mock } from 'jest-mock-extended';


describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const userServiceMock = mock<UserService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('hello', () => {

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should find a user by email', async () => {
      const userDto = GetUserDto.createInstance(1, 'this_is_email_address_1', 'this_is_name_1');
      const result = Result.success(userDto);

      jest.spyOn(userService, 'findUserByEmail').mockImplementation(async () => result);

      expect(await controller.findUserByEmail('this_is_email_address_1')).toBe(result);
    });
  });

  
});