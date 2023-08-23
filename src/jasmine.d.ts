declare module 'jasmine-core' {
    interface Jasmine {
        describe(description: string, specDefinitions: () => void): void;
        it(description: string, specDefinitions: () => void): void;
        expect(actual: any): jasmine.Matchers;
    }
    const jasmine: Jasmine;
    export = jasmine;
}
