import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog.jsx'

test('renders content', async () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: '@testing-library',
        url: 'https://testing-library.com/',
    }
    const mockHandler = vi.fn()

    const {container} = render(<Blog blog={blog} handler={mockHandler}/>)
    screen.debug(container)
    const user = userEvent.setup()
    const button = await screen.getByText('like')
    await user.click(button)
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(
        'Component testing is done with react-testing-library @testing-library'
    )
    expect(mockHandler.mock.calls).toHaveLength(1)

    // const element = screen.getByText('Component testing is done with react-testing-library @testing-library')
    // expect(element).toBeDefined()
})