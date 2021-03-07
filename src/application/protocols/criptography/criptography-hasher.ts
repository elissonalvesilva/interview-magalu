export interface CriptograpyHasher {
  hash(plaintext: string): Promise<string>;
}
