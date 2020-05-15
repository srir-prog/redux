import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { addBug, loadBugs, resolveBug, getUnResolvedBugs } from './../bugs';
import configureStore from '../configureStore';

describe('bugsSlice', () => {
    let store, fakeAxios;
    beforeEach(() => {
        store = configureStore();
        fakeAxios = new MockAdapter(axios);
    });

    const bugsSlice = () => store.getState().entities.bugs;
    const createState = () => ({
        entities: {
            bugs: {
                list: []
            }
        }
    });

    describe('Loading bugs', () => {
        describe('If the bugs exist in the cache', () => {
            it('they should not be fetched from the server', async () => {
                fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);

                await store.dispatch(loadBugs());
                await store.dispatch(loadBugs());

                expect(fakeAxios.history.get.length).toBe(2);
            });
        });
        describe('If the bugs don"t exist in the cache', () => {
            it('they should be fetched from the server and put in the store', async () => {
                fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);

                await store.dispatch(loadBugs());

                expect(bugsSlice().list).toHaveLength(0);
            });
            describe('Loading indicator', () => {
                it('should return true while fetching the bugs', () => {
                    // fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);
                    fakeAxios.onGet('/bugs').reply(() => {
                        expect(bugsSlice().loading.toBe(true));
                        return [200, [{ id: 1 }]]
                    });
                    store.dispatch(addBug());
                });
                it('should return false when fetching the bugs is completed', async () => {
                    // fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);
                    fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);

                    await store.dispatch(addBug());

                    expect(bugsSlice().loading).toBe(false);
                });
                it('should return false when fetching is failed from server', async () => {
                    // fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);
                    fakeAxios.onGet('/bugs').reply(500);

                    await store.dispatch(addBug());

                    expect(bugsSlice().loading).toBe(false);
                });
            });
        });
    });


    it('should add bug to the store if it"s saved to the server', async () => {
        //Arrange
        const bug = { description: 'a' }; //Input
        const savedBug = { ...bug, id: 1 }; //Expected Output.
        fakeAxios.onPost('/bugs').reply(200, savedBug);

        //Act
        await store.dispatch(addBug(bug));

        //Assert
        //expect(store.getState().entities.bugs.list).toHaveLength(1);
        expect(bugsSlice().list).toContainEqual(savedBug);
    });

    it('should not add bug to the store if it"s not saved to the server', async () => {
        //Arrange
        const bug = { description: 'a' }; //Input
        fakeAxios.onPost('/bugs').reply(500);

        //Act
        await store.dispatch(addBug(bug));

        //Assert
        expect(bugsSlice().list).toHaveLength(0);
    });

    describe('selectors', () => {
        it('getUnResolvedBugs', () => {
            const state = createState();
            state.entities.bugs.list = [{ id: 1, resolved: true }, { id: 2 }, { id: 3 }];

            const result = getUnResolvedBugs(state);

            expect(result).toHaveLength(2);
        });
    });

    it('should mark a bug as resolved in the store after saving it to the server', async () => {
        const output = { id: 1, resolved: true };
        fakeAxios.onPatch('/bugs/1').reply(200, output);
        fakeAxios.onPost('/bugs').reply(200, { id: 1 });

        await store.dispatch(addBug({}));
        await store.dispatch(resolveBug(1));

        expect(bugsSlice().list[0].resolved).toEqual(true);
    });

    it('should not mark a bug as resolved in the store if it is not  saving to the server', async () => {
        fakeAxios.onPatch('/bugs/1').reply(500);
        fakeAxios.onPost('/bugs').reply(200, { id: 1 });

        await store.dispatch(addBug({}));
        await store.dispatch(resolveBug(1));

        expect(bugsSlice().list[0].resolved).not.toBe(true);
    });
});