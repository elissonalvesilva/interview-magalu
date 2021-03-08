export interface CriptograpyEncrypter {
  encrypt: (plaintext: string) => Promise<string>;
}
