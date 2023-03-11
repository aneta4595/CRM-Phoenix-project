import { PasswordErrorPipe } from './password-error.pipe';

describe('PasswordErrorPipe', () => {
  it('create an instance', () => {
    const pipe = new PasswordErrorPipe();
    expect(pipe).toBeTruthy();
  });
});
