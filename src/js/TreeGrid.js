import '../css/treegrid.css';
import React from 'react';
import Header from './Header';
import Body from './Body';
import { getRowsWithChildren } from './util/TreeUtils';

import { sortBy } from 'lodash';

function sort(data, sortKey, sortDir) {
  const newData = sortBy(data, function(o) { return o[sortKey]; });
  if (sortDir === 'asc') {
    return newData;
  } else {
    return newData.reverse();
  }
}

class TreeGrid extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'TreeGrid';
    this.handleSort = this.handleSort.bind(this);
    this.state = {
      sortedColumns: {}
    };
  }

  handleSort(column) {
    if (column.field in this.state.sortedColumns) {
      // toggle sorting
      const sortDir = this.state.sortedColumns[column.field];
      if (sortDir === 'asc') {
        this.state.sortedColumns[column.field] = 'desc';
      } else if (sortDir === 'desc') {
        // remove sorting if it is already sorted by descending order
        delete this.state.sortedColumns[column.field];
      }
      this.setState({
        sortedColumns: this.state.sortedColumns
      });
    } else {
      // sort column in ascending order
      this.state.sortedColumns[column.field] = 'asc';
      this.setState({
        sortedColumns: this.state.sortedColumns
      });
    }
  }

  render() {
    let { columns, id, parentId } = this.props.options;
    const { data } = this.props;
    // use intial data from props by default
    let renderData = data;
    // check if sort is applied in any of the columns
    const sortKeys = Object.keys(this.state.sortedColumns);
    if (sortKeys.length > 0) {
      const sortKey = sortKeys[0];
      const sortDir = this.state.sortedColumns[sortKey];
      console.log('Sorting by ' + sortKey);
      renderData = sort(data, sortKey, sortDir);
    }

    // assign defaults
    if (!id) {
      id = 'id';
    }
    if(!parentId) {
      parentId = 'parentId';
    }

    const metadata = getRowsWithChildren(renderData, id, parentId);

    return (
      <div className='tgrid'>
        <Header
          columns={columns}
          onSort={this.handleSort}
          sortedColumns={this.state.sortedColumns}>
        </Header>
        <Body
          columns={columns}
          data={renderData}
          metadata={metadata}
          idField={id}
          parentIdField={parentId}>
        </Body>
      </div>
    );
  }
}

TreeGrid.propTypes = {
  data: React.PropTypes.array.isRequired,
  options: React.PropTypes.object.isRequired
}

export default TreeGrid;