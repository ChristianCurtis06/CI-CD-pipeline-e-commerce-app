import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from 'redux-mock-store';
import '@testing-library/jest-dom';
import { clearCart, updateProduct, removeProduct } from '../redux/cartSlice';
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
                    {
                        id: 2,
                        title: 'Pants',
                        price: '19.99',
                        category: 'clothing',
                        description: 'Pants description',
                        rating: { rate: 4.5, count: 150 },
                        image: 'imageUrl',
                        quantity: 1,
                    }
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

    test('changes product quantity successfully', async () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <Cart />
            </Provider>
        );

        const quantityInput = getByTestId('quantity-input-1');
        expect(quantityInput).toBeInTheDocument();
        
        fireEvent.change(quantityInput, { target: { value: '2' } });

        await waitFor(() => {
            expect(store.dispatch).toHaveBeenCalledWith(updateProduct(
                {
                    id: 1,
                    title: 'Shirt',
                    price: '9.99',
                    category: 'clothing',
                    description: 'Shirt description',
                    rating: { rate: 5, count: 250 },
                    image: 'imageUrl',
                    quantity: 2,
                }
            ));
        });
    });

    test('removes product successfully', async () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <Cart />
            </Provider>
        );

        const removeFromCartButton = getByTestId('remove-product-1');
        expect(removeFromCartButton).toBeInTheDocument();

        fireEvent.click(removeFromCartButton);

        await waitFor(() => {
            expect(store.dispatch).toHaveBeenCalledWith(removeProduct(1));
        });
    });
});
