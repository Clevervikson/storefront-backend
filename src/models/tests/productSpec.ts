import { Product, ProductModel } from '../../models/product';
const jasmine = (window as any).jasmine;
const { describe, it, expect } = jasmine;

describe('Testing product model', () => {
    const productModel = new ProductModel();
    const testProduct: Product = {
        name: 'yam',
        price: 750,
        category: 'food'
    };
    let expectedProduct: Product;

    describe.each([['index'], ['show'], ['create'], ['update'], ['delete']])(
        '%s method',
        (methodName: keyof ProductModel) => {
            it('should exist', () => {
                expect(productModel[methodName]).toBeDefined();
            });
        }
    );

    describe('create method', () => {
        beforeAll(async () => {
            expectedProduct = await productModel.create(testProduct);
        });

        it('should create a product', async () => {
            expect(expectedProduct).toEqual(testProduct);
        });
    });

    describe('update method', () => {
        beforeEach(async () => {
            expectedProduct = await productModel.create(testProduct);
        });

        it('should update a product', async () => {
            const newPrice = 400;
            const updatedProd = await productModel.update(
                expectedProduct.id as number,
                newPrice
            );
            expect(updatedProd.price).toEqual(newPrice);
        });
    });

    describe('delete method', () => {
        beforeEach(async () => {
            expectedProduct = await productModel.create(testProduct);
        });

        it('should delete a product', async () => {
            const deletedProd = await productModel.delete(
                expectedProduct.id as number
            );
            expect(deletedProd.id).toEqual(expectedProduct.id);
        });
    });
});
