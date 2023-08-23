import { User, UserModel } from '../../models/user';

describe('User Model', () => {
    const testUser: User = {
        first_name: 'vicky',
        last_name: 'den',
        password: 'obi2023'
    };

    let usersModel: UserModel;
    let expectedUser: User;

    beforeAll(() => {
        usersModel = new UserModel();
    });

    it('should have an index method', () => {
        expect(usersModel.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(usersModel.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(usersModel.create).toBeDefined();
    });

    it('should have an update method', () => {
        expect(usersModel.update).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(usersModel.delete).toBeDefined();
    });

    describe('Create User', () => {
        beforeAll(async () => {
            expectedUser = await usersModel.create(testUser);
        });

        it('should create a user', () => {
            expect(expectedUser).toContain(testUser);
        });
    });

    describe('Get Users', () => {
        let usersList: User[];

        beforeAll(async () => {
            usersList = await usersModel.index();
        });

        it('should return a list of users', () => {
            expect(usersList.length).toBeGreaterThan(0);
        });

        it('should return a user based on the user_id', async () => {
            const user = await usersModel.show(expectedUser.user_id as number);
            expect(user).toContain(expectedUser);
        });
    });

    describe('Update and Delete User', () => {
        it('should update and delete a user', async () => {
            const newPass = 'newPassword#2023';
            const updatedUser = await usersModel.update(
                expectedUser.user_id as number,
                newPass
            );
            expect(updatedUser.password).toEqual(newPass);

            const deletedUser = await usersModel.delete(
                expectedUser.user_id as number
            );
            expect(deletedUser.user_id).toEqual(expectedUser.user_id);
        });
    });
});
