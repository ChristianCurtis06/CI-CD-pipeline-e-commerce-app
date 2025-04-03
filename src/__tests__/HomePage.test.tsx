import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from 'redux-mock-store';
import '@testing-library/jest-dom';
import { addProduct } from '../redux/cartSlice';
import HomePage from '../components/HomePage';
import { useProducts, useProductsByCategory } from '../queries/Products';
import { useCategories } from '../queries/Categories';

jest.mock('../queries/Products', () => ({
    useProducts: jest.fn(),
    useProductsByCategory: jest.fn(),
}));

jest.mock('../queries/Categories', () => ({
    useCategories: jest.fn(),
}));

const mockProducts = [
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
];

const mockCategories: string[] = ['clothing', 'electronics', 'jewelery'];

const mockStore = configureStore([]);

describe('HomePage Component', () => {
    let store: any;
    
    beforeEach(() => {
        (useProducts as jest.Mock).mockReturnValue({
            data: mockProducts,
            isLoading: false,
            isError: false,
        });

        (useProductsByCategory as jest.Mock).mockReturnValue({
            data: mockProducts,
            isLoading: false,
            isError: false,
        });

        (useCategories as jest.Mock).mockReturnValue({
            data: mockCategories,
            isLoading: false,
            isError: false,
        });

        store = mockStore({
            cart: {
                cart: [],
            },
        });
        store.dispatch = jest.fn();

        window.alert = jest.fn();
    });

    test('basic structure matches the snapshot', () => {
        const { asFragment, getByText } = render(
            <Provider store={store}>
                <HomePage />
            </Provider>
        );

        expect(asFragment()).toMatchSnapshot();
    });

    test('renders products correctly', async () => {
        const { getAllByText} = render(
            <Provider store={store}>
                <HomePage />
            </Provider>
        );

        await waitFor(() => {
            expect(getAllByText(/Shirt/i).length).toBeGreaterThan(0);
            expect(getAllByText(/Pants/i).length).toBeGreaterThan(0);
        });
    });

    test('adds product to user cart correctly', async () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <HomePage />
            </Provider>
        );

        const addToCartButton = getByTestId('add-product-1');
        expect(addToCartButton).toBeInTheDocument();

        fireEvent.click(addToCartButton);

        await waitFor(() => {
            expect(store.dispatch).toHaveBeenCalledWith(
                addProduct({
                    id: 1,
                    title: 'Shirt',
                    price: '9.99',
                    description: 'Shirt description',
                    category: 'clothing',
                    rating: { rate: 5, count: 250 },
                    image: 'imageUrl',
                    quantity: 1,
                })
            );
        });
    });
});
