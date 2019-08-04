import React, {Component} from "react";
import PropTypes from 'prop-types';

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {},
            paginationData: {},
            nextPageUrl: null,
            prevPageUrl: null,
            currentPage: null
        };
    }

    componentDidMount() {
        this.setState({options: this.props.options, paginationData: this.props.data});
        this.getProps(this.props);
    }

    componentWillReceiveProps(props, nextContext) {
        this.setState({options: props.options, paginationData: props.data});
        this.getProps(props);
    }

    // Transform props
    getProps = (props) => {
        let defaultProps = Pagination.defaultProps.options;
        let options = this.state.options;
        Object.keys(defaultProps).forEach(function (key) {
            if (!options[key]) {
                options[key] = props[key] ? props[key] : defaultProps[key];
            }
        });
        this.setState({options: options, paginationData: props.data});
    };

    // Check if page is active
    isCurrent = (page) => {
        return this.state.paginationData.current_page === page;
    };

    // Handle pagination buttons click event
    handleClick = (page) => {
        let parameters = {};
        if (this.props.requestParams) {
            parameters = this.props.requestParams;
        }
        parameters.page = page;
        this.props.changePage(parameters);
    };

    // Generate pagination buttons
    generatePagination = () => {
        let paginationData = this.state.paginationData;
        let pagination = (<div></div>);
        if (Object.keys(paginationData).length) {
            let options = this.state.options;
            let current = paginationData.current_page ? paginationData.current_page : paginationData.meta.current_page,
                last = paginationData.last_page ? paginationData.last_page : paginationData.meta.last_page,
                delta = parseInt(options.numbersCountForShow),
                left = current - delta,
                right = current + delta + 1,
                range = [],
                rangeWithDots = [],
                l;
            for (let i = 1; i <= last; i++) {
                if ((i === 1 || i === last) || (i >= left && i < right)) {
                    range.push(i);
                }
            }
            for (let i of range) {
                if (l) {
                    if (i - l === 2) {
                        rangeWithDots.push(l + 1);
                    } else if (i - l !== 1) {
                        rangeWithDots.push('...');
                    }
                }
                rangeWithDots.push(i);
                l = i;
            }

            let nextPageUrl = paginationData.next_page_url ? paginationData.next_page_url : paginationData.meta.next_page_url;
            let prevPageUrl = paginationData.prev_page_url ? paginationData.prev_page_url : paginationData.meta.prev_page_url;
            pagination = (
                <ul className={options.containerClass}>
                    {prevPageUrl ?
                        <li className={options.prevButtonClass}
                            onClick={() => this.handleClick(current - 1)}>
                            <button type="button"
                                    className={options.numberButtonClass}>{options.prevButtonText}</button>
                        </li> : ""}
                    {rangeWithDots.map((page, index) =>
                        this.generateNumber(page, index)
                    )}
                    {nextPageUrl ?
                        <li className={options.nextButtonClass}
                            onClick={() => this.handleClick(current + 1)}>
                            <button type="button"
                                    className={options.numberButtonClass}>{options.nextButtonText}</button>
                        </li>
                        : ""}
                </ul>
            );
        }
        return pagination;
    };

    generateNumber(page, index) {
        let options = this.state.options;
        return (
            <li className={this.isCurrent(page) ? options.numberButtonClass + " " + options.activeClass :
                options.numberButtonClass}
                onClick={() => this.handleClick(page === '...' ? index + 1 : page)} key={index}>
                <button type="button" className={options.numberClass}>{page}</button>
            </li>
        );
    }

    render() {
        return (
            <div>
                {this.generatePagination()}
            </div>
        );
    }
}

Pagination.defaultProps = {
    options: {
        containerClass: "pagination",
        prevButtonClass: "page-item",
        prevButtonText: "Prev",
        nextButtonClass: "page-item",
        nextButtonText: "Next",
        numberButtonClass: "page-item",
        numberClass: "page-link",
        numbersCountForShow: 2,
        activeClass: 'active'
    },
    data: {}
};

Pagination.propTypes = {
    options: PropTypes.shape({
        containerClass: PropTypes.string,
        nextButtonClass: PropTypes.string,
        nextButtonText: PropTypes.string,
        prevButtonClass: PropTypes.string,
        prevButtonText: PropTypes.string,
        numberButtonClass: PropTypes.string,
        numberClass: PropTypes.string,
        numberCountForShow: PropTypes.number,
        activeClass: PropTypes.string
    }),
    data: PropTypes.object
};
export default Pagination;