const mockAxios = require('axios');
const calculatePrice = require('../src/helpers/calculatePrice');

describe('CALCULATE PRICE', () => {
  Date.now = jest.fn(() => 1571094389234);

  it('calls coindesk API and returns buying rate', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          bpi: {
            USD: {
              rate_float: 126.5235
            }
          }
        }
      })
    );

    const response = await calculatePrice({
      type: 'buy',
      margin: 2.0,
      exchangeRate: 350
    });

    expect(response).toMatchObject({
      rate: '45168.89',
      id: 2,
      type: 'buy',
      date: Date.now()
    });
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenLastCalledWith(
      'https://api.coindesk.com/v1/bpi/currentprice.json'
    );
  });

  it('calls coindesk API and returns selling rate', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          bpi: {
            USD: {
              rate_float: 126.5235
            }
          }
        }
      })
    );

    const response = await calculatePrice({
      type: 'sell',
      margin: 2.0,
      exchangeRate: 350
    });

    expect(response).toMatchObject({
      rate: '43397.56',
      id: 3,
      type: 'sell',
      date: Date.now()
    });
    expect(mockAxios.get).toHaveBeenCalledTimes(2);
    expect(mockAxios.get).toHaveBeenLastCalledWith(
      'https://api.coindesk.com/v1/bpi/currentprice.json'
    );
  });

  it('throws error if type is not valid', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          bpi: {
            USD: {
              rate_float: 126.5235
            }
          }
        }
      })
    );

    try {
      await calculatePrice({
        type: 'money',
        margin: 2.0,
        exchangeRate: 350
      });
    } catch (error) {
      expect(error.message).toMatch('invalid transaction type');
    }
  });
});
