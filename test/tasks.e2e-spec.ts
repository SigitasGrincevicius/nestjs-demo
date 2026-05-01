import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';
import { TaskStatus } from '../src/tasks/task.model';

describe('Tasks (e2e)', () => {
  let testSetup: TestSetup;
  let authToken: string;
  let taskId: string;

  const testUser = {
    email: 'test@example.com',
    password: 'Password123!',
    name: 'Luke Skywalker',
  };

  beforeEach(async () => {
    testSetup = await TestSetup.create(AppModule);

    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(201);

    authToken = loginResponse.body.accessToken;

    const profileResponse = await request(testSetup.app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const response = await request(testSetup.app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Complete Jedi Training',
        description: 'Train with Master Yoda on Dagobah.',
        status: TaskStatus.OPEN,
        userId: profileResponse.body.id,
        labels: [{ name: 'rebellion' }],
      })
      .expect(201);
    taskId = response.body.id;
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });

  it('task has been created', () => {
    expect(taskId).toBeDefined();
  });
});
