import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // hash()
  // plain text -> hash
  // for the same input -> the same output
  // --------------------
  // bcrypt.hash -> was called
  //             -> password was passed to it & salt rounds
  // mocks & spies
  it('should hash password', async () => {
    const mockHash = 'hashed_password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);
    const password = 'password123';
    const result = await service.hash(password);

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(result).toBe(mockHash);
  });

  it('should correctly verify password', async () => {
    const plainPassword = 'correct_password';
    const hashedPassword = 'hashed_password';
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await service.verify(plainPassword, hashedPassword);

    expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    expect(result).toBe(true);
  });

  it('should fail an incorrect password', async () => {
    const plainPassword = 'wrong_password';
    const hashedPassword = 'hashed_password';
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const result = await service.verify(plainPassword, hashedPassword);

    expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    expect(result).toBe(false);
  });
});
