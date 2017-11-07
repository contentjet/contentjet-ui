import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import s from './Pagination.css';


function PaginationItem(props) {

  const onClick = (e) => {
    e.preventDefault();
    props.onClick(props.value);
  };

  let className = classnames(
    s.paginationItem,
    {
      [s.active]: props.active
    },
    props.className
  );
  return (
    <li className={className} key={props.value}>
      <a
        className={s.paginationItemLink}
        href="#"
        onClick={onClick}
      >
        {Array.isArray(props.value) ? '\u2026' : props.value}
      </a>
    </li>
  );

}
PaginationItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  value: PropTypes.node,
  active: PropTypes.bool
};


class Pagination extends Component {

  constructor(props) {
    super(props);
    this.onPrevious = this.onPrevious.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  onPrevious() {
    this.props.onPrevious(this.props.currentPage - 1);
  }

  onNext() {
    this.props.onNext(this.props.currentPage + 1);
  }

  render() {
    if (this.props.totalPages === 0 || this.props.totalPages === 1) return null;

    let lastPageNumber = this.props.totalPages + 1;
    let pageNumbers = _.range(1, lastPageNumber);
    let maxSize = 12; // Must not be < 12.
    if (this.props.totalPages > maxSize) {
      // Last, Second-last, Third-last or Forth-last page selected
      if (this.props.currentPage >= lastPageNumber - 6) {
        pageNumbers = _.range(lastPageNumber - (maxSize - 2), lastPageNumber);
        pageNumbers.unshift(1, [2, lastPageNumber - (maxSize - 2) - 1]);
      // First, Second, Third or Forth page selected
      } else if (this.props.currentPage <= 6) {
        pageNumbers = _.range(1, maxSize - 1);
        pageNumbers.push([maxSize - 1, this.props.totalPages-1], this.props.totalPages);
      // Everything else
      } else {
        pageNumbers = [
          1,
          [2, this.props.currentPage - 4],
          this.props.currentPage - 3,
          this.props.currentPage - 2,
          this.props.currentPage - 1,
          this.props.currentPage,
          this.props.currentPage + 1,
          this.props.currentPage + 2,
          this.props.currentPage + 3,
          [this.props.currentPage + 4, this.props.totalPages - 1],
          this.props.totalPages
        ];
      }
    }

    let items = pageNumbers.map((value) => {
      return (
        <PaginationItem
          value={value}
          key={value}
          active={this.props.currentPage === value}
          onClick={this.props.onClick}
        />
      );
    });

    if (this.props.onPrevious && this.props.currentPage !== 1) {
      items.unshift(
        <PaginationItem
          value="«"
          key="«"
          onClick={this.onPrevious}
        />
      );
    }
    if (this.props.onNext && this.props.currentPage !== this.props.totalPages) {
      items.push(
        <PaginationItem
          value="»"
          key="»"
          onClick={this.onNext}
        />
      );
    }

    let className = classnames(s.pagination, this.props.className);
    return (
      <ul className={className}>
        {items}
      </ul>
    );
  }

}
Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func
};


export default Pagination;
