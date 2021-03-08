import jwt from 'jsonwebtoken';

import {
  CriptograpyDecrypter,
  CriptograpyEncrypter,
} from './../../application/protocols/criptography';

export class JwtAdapter implements CriptograpyEncrypter, CriptograpyDecrypter {
  constructor(private readonly secret: string) {}

  async encrypt(plaintext: string): Promise<string> {
    return jwt.sign({ id: plaintext }, this.secret);
  }

  async decrypt(ciphertext: string): Promise<string> {
    return jwt.verify(ciphertext, this.secret) as any;
  }
}
