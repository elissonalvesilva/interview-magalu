export interface CriptograpyHashComparer {
  compare: (plaitext: string, digest: string) => Promise<boolean>;
}
