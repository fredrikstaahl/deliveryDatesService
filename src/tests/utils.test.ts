import { getStartOfWeekDate } from '../utils';
describe('Test getStartOftheWeekDate', () => {
  test('When passing any date except a monday, the first day of the week should be returned', () => {
    expect(getStartOfWeekDate(new Date('2022-02-10'))).toStrictEqual(new Date('2022-02-07'));
  });
});
