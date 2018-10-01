import { connectRouterWithPagination } from '../react-router-pagination';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('react-router-pagination', () => {
  const wrappedComponentProps = {
    location: {
      search: '',
    },
    history: {
      push: jest.fn(),
    },
    onPageChange: jest.fn(),
  };

  const WrappedComponent = () => <div />;
  class PaginationComponent extends React.Component {
    handleClick = page => this.props.onChange(page);
    render() {
      return <div />;
    }
  }
  const ComponentWithPagination = connectRouterWithPagination(PaginationComponent)(WrappedComponent);

  it('render wrapped component component correctly', () => {
    const wrapper = mount(<ComponentWithPagination {...wrappedComponentProps} />);

    expect(wrapper.find(WrappedComponent).exists()).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('render pagination component correctly', () => {
    const wrapper = mount(<ComponentWithPagination {...wrappedComponentProps} />);
    mount(wrapper.find(WrappedComponent).prop('pagination')({}));

    expect(wrapper.find(WrappedComponent).props().pagination).not.toBe(undefined);
    expect(wrapper).toMatchSnapshot();
  });

  it('add page param if it is missing', () => {
    const wrapper = mount(<ComponentWithPagination {...wrappedComponentProps} />);

    wrapper.setProps({ location: { search: '' } });

    expect(wrapper.props().history.push).toHaveBeenCalledWith({ search: '?page=1' });
  });

  it('fetches page with param from URL', () => {
    const props = {
      location: {
        search: '?page=2',
      },
      onPageChange: jest.fn(),
    };
    const wrapper = mount(<ComponentWithPagination {...props} />);

    expect(wrapper.props().onPageChange).toHaveBeenCalledWith({ page: 2 });
  });

  it('fetches new page when page param changes', () => {
    const wrapper = mount(<ComponentWithPagination {...wrappedComponentProps} />);

    wrapper.setProps({ location: { search: '?page=2' } });
    expect(wrapper.props().onPageChange).toHaveBeenCalledWith({ page: 2 });

    wrapper.setProps({ location: { search: '?page=3' } });
    expect(wrapper.props().onPageChange).toHaveBeenCalledWith({ page: 3 });
  });

  it('changes history when handle click in pagination component', () => {
    const wrapper = mount(<ComponentWithPagination {...wrappedComponentProps} />);
    const paginationWrapper = mount(
      wrapper.find(WrappedComponent).prop('pagination')({
        onChange: page => wrapper.instance().updateCurrentURL(page),
      }),
    );

    paginationWrapper.instance().handleClick(1);
    expect(wrapper.props().history.push).toHaveBeenCalledWith({ search: '?page=1' });

    paginationWrapper.instance().handleClick(2);
    expect(wrapper.props().history.push).toHaveBeenCalledWith({ search: '?page=2' });
  });
});
