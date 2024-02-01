import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../app.module';

describe('UserController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/user/list (GET)', async () => {
    return request(app.getHttpServer())
      .get('/user/list')
      .expect(200)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);

        expect(response.body.data.length).toBeGreaterThan(0);
        response.body.data.forEach(user => {
          expect(user).toHaveProperty('userId');
          expect(user).toHaveProperty('name');
          expect(user).toHaveProperty('email');
        });
      });
  });

  it('/user/:userId (GET)', async () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(200)
      .then(response => {
        expect(response.body).toBeDefined();
        // Check that the response body has the expected structure
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('email');
        // Add more assertions as needed based on your user model
      });
  });


  it('/user/email (GET)', () => {
    const email = 'this_is_email_address_2';

    return request(app.getHttpServer())
      .get(`/user?email=${email}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('userId');
        expect(res.body.data.userId).toEqual(2);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});