import { render } from '@testing-library/react-native'

import SignIn from '@/app/sign-in'
import { PrimaryButtonLG } from '@/components/PrimaryButton'

describe('<HomeScreen />', () => {
    test('Text renders correctly on HomeScreen', () => {
        const { getByText } = render(<SignIn />)
        getByText('Sign In')
    })

    test('Button renders correctly', () => {
        const tree = render(<PrimaryButtonLG>Some text</PrimaryButtonLG>).toJSON()

        expect(tree).toMatchSnapshot()
    })
})