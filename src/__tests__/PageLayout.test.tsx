import PageLayout from "../components/PageLayout";
import { render } from "@testing-library/react";

jest.mock('../components/NavBar', () => () => <div>Mock NavBar</div>);

describe('PageLayout Component', () => {
    test('renders children and matches the snapshot', () => {
        const { asFragment, getByText } = render(
            <PageLayout>
                <div>Mock Child Content</div>
            </PageLayout>
        );

        expect(getByText("Mock Child Content")).toBeInTheDocument();
        expect(getByText("Mock NavBar")).toBeInTheDocument();

        expect(asFragment()).toMatchSnapshot();
    });
});