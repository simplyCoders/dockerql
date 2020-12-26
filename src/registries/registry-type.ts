// ----------------------------------------------
// RegistryType class
// ----------------------------------------------

/* eslint-disable no-useless-constructor, no-unused-vars, no-empty-function */
export class RegistryType {
  constructor(
        public type: string,
        public init: any,
        public getNamespaces: any,
        public getRepos: any,
        public getImages: any,
  ) {}
}
/* eslint-disable no-useless-constructor, no-unused-vars, no-empty-function */
