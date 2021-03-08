export interface CriptograpyDecrypter {
  decrypt: (ciphertext: string) => Promise<string>;
}
