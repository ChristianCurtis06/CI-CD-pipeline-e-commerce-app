import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from 'redux-mock-store';
import '@testing-library/jest-dom';
import { clearCart } from '../redux/cartSlice';
import Cart from '../components/Cart';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

const mockStore = configureStore([]);
const mockNavigate = jest.fn();

describe('Cart Component', () => {
    let store: any;
    
    beforeEach(() => {
        store = mockStore({
            cart: {
                cart: [
                    {
                        id: 1,
                        title: 'Shirt',
                        price: '9.99',
                        category: 'clothing',
                        description: 'Shirt description',
                        rating: { rate: 5, count: 250 },
                        image: 'imageUrl',
                        quantity: 1,
                    },
                ],
            },
        });
        store.dispatch = jest.fn();

        const { useNavigate } = require('react-router-dom');
        useNavigate.mockReturnValue(mockNavigate);

        window.alert = jest.fn();
    });

    test('checkout handled correctly', async () => {
        const { getByText} = render(
            <Provider store={store}>
                <Cart />
            </Provider>
        );

        const checkoutButton = getByText(/Checkout/i);
        fireEvent.click(checkoutButton);

        await waitFor(() => {
            expect(store.dispatch).toHaveBeenCalledWith(clearCart());
            expect(mockNavigate).toHaveBeenCalledWith('/');
            expect(window.alert).toHaveBeenCalledWith('You have been checked out! Your cart has been emptied.');
        });
    });
/*
test('adds product to user cart correctly', async () => {
    
});
*/
});
